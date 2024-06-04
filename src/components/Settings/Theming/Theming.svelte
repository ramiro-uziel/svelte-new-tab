<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { hexToHSL, HSLToHex } from '$lib/utils/color';

	interface Item {
		id: string;
		text: string;
		icon: string;
		url: string;
	}

	interface Section {
		id: string;
		text: string;
		icon: string;
		color: string;
		originalColor: string;
		items: Item[];
	}

	interface SectionWithBackup extends Section {
		backupOriginalColor: string;
	}

	import Knob from './Knob.svelte';
	let value = 0;
	let sections: SectionWithBackup[] = [];

	const dispatch = createEventDispatcher();

	onMount(() => {
		const storedSections = localStorage.getItem('columnsData');
		if (storedSections) {
			sections = JSON.parse(storedSections).map((section: Section) => ({
				...section,
				originalColor: section.color,
				backupOriginalColor: section.color
			}));
		} else {
			sections = [];
		}
	});

	function handleColorChange(sectionId: string, newColor: string) {
		sections = sections.map((section) => {
			if (section.id === sectionId) {
				const newHSL = hexToHSL(newColor);
				newHSL.h = (newHSL.h - value * 3.6) % 360;
				if (newHSL.h < 0) newHSL.h += 360;
				const adjustedColor = HSLToHex(newHSL.h, newHSL.s, newHSL.l);
				return { ...section, color: newColor, originalColor: adjustedColor };
			}
			return section;
		});
	}

	function shiftHue(hex: string, degree: number): string {
		const hsl = hexToHSL(hex);
		hsl.h = (hsl.h + degree) % 360;
		if (hsl.h < 0) hsl.h += 360;
		return HSLToHex(hsl.h, hsl.s, hsl.l);
	}

	function darkenColor(hex: string, amount: number): string {
		let { h, s, l } = hexToHSL(hex);
		l -= amount;
		if (l < 0) l = 0;
		return HSLToHex(h, s, l);
	}

	function ensureVisibleTextColor(hex: string): string {
		const { h, s, l } = hexToHSL(hex);
		let newL = l;
		if (l < 50) {
			newL = 75;
		} else {
			newL = 25;
		}
		return HSLToHex(h, s, newL);
	}

	function resetColors() {
		value = 0;
		sections = sections.map((section) => ({
			...section,
			color: section.backupOriginalColor,
			originalColor: section.backupOriginalColor
		}));
	}

	function saveColors() {
		const data = sections.map(({ id, text, icon, color, items }) => ({
			id,
			text,
			icon,
			color,
			items
		}));
		localStorage.setItem('columnsData', JSON.stringify(data));
		dispatch('reload');
	}

	$: sections = sections.map((section) => ({
		...section,
		color: shiftHue(section.originalColor, value * 3.6)
	}));
</script>

<div class="flex flex-row">
	<div class="flex flex-col mr-10 gap-2 justify-center items-center">
		<p class="text-white">Hue</p>
		<Knob bind:value max={100} min={0} pixelRange={180} />
		<div class="flex flex-col gap-3 mt-3">
			<button on:click={saveColors}>
				<i
					class="hover:text-light-blue text-white duration-100 border border-[#464646] hover:bg-[#ffffff28] rounded-lg p-4 text-base w-15 h-5 flex items-center justify-center fa-solid fa-save active:translate-y-0.5"
				></i>
			</button>
			<button on:click={resetColors}>
				<i
					class="hover:text-light-blue text-white duration-100 border border-[#464646] hover:bg-[#ffffff28] rounded-lg p-4 text-base w-15 h-5 flex items-center justify-center fa-solid fa-undo active:translate-y-0.5"
				></i>
			</button>
		</div>
	</div>
	<div
		class="grid grid-cols-3 gap-4 flex-1 h-[200px] max-h-[200px] overflow-auto  overflow-x-hidden"
	>
		{#each sections as section}
			<div
				class="min-h-[92px] w-full rounded flex items-center justify-center text-white font-bold color-box-text"
				style="background-color: {section.color}"
			>
				<div class="flex flex-col items-center justify-center">
					<p style="color: {ensureVisibleTextColor(section.color)}">
						{section.text}
					</p>

					<input
						type="color"
						value={section.color}
						style={`border-color: ${ensureVisibleTextColor(section.color)}`}
						on:input={(e) => handleColorChange(section.id, e.currentTarget.value)}
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	input[type='color'] {
		position: relative;
		width: 32px;
		height: 32px;
		border-radius: 20px;
		padding: 0;
		border: 2px solid;
		overflow: hidden;
	}

	input[type='color']::-moz-color-swatch {
		border: none;
		border-radius: 0px;
		overflow: hidden;
	}

	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
		border-radius: 10px;
		overflow: hidden;
	}

	input[type='color']::-webkit-color-swatch {
		border: none;
	}

	input[type='color']:disabled {
		filter: grayscale(100%);
	}
</style>
