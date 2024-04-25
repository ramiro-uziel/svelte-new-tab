<!-- ItemEditModal.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';

	let parent: Element;
	let isOpen: boolean;

	let isParentEnabled: boolean | undefined;
	let isPickerDisabled: boolean | undefined;
	let isEventActive: boolean = false;

	$: isParentEnabled = !isOpen;
	$: isParentEnabled = isEventActive;

	export let item: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	} = {
		id: '',
		text: '',
		icon: '',
		color: '',
		items: []
	};

	let editedItem: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	} = { ...item };

	const dispatch = createEventDispatcher();

	function save() {
		dispatch('save', editedItem);
	}

	function cancel() {
		dispatch('cancel');
	}

	if (typeof window !== 'undefined') {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === 'Escape') {
				event.stopPropagation();

				if (event.key === 'Enter') {
					save();
				} else if (event.key === 'Escape') {
					cancel();
				}
			}
		};

		window.addEventListener('keydown', handleKeydown);

		onDestroy(() => {
			window.removeEventListener('keydown', handleKeydown);
		});
	}
</script>

<div
	class="bg-black backdrop-blur bg-opacity-60 w-screen h-screen absolute flex justify-center items-center font-Bitter"
	transition:fade={{ duration: 150 }}
	bind:this={parent}
>
	<div
		class="relative backdrop-blur-lg outline outline-[#353535] outline-1 rounded-2xl w-96 p-5"
		use:clickoutside={{ enabled: isParentEnabled }}
		on:clickoutside={cancel}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			class="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl opacity-10"
			style="z-index: -1;"
		>
			<defs>
				<filter id="turbulence" x="0" y="0" width="100%" height="100%">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.80"
						numOctaves="4"
						stitchTiles="stitch"
					/>
				</filter>
			</defs>
			<rect width="100%" height="100%" filter="url(#turbulence)" />
		</svg>

		<div class="text-white text-md flex flex-col gap-4 p-5 selection:bg-[#39756d]">
			<label class="flex flex-col gap-2"
				>Text<input
					class="text-white text-base outline outline-[#838383] outline-1 p-2 rounded bg-transparent"
					type="text"
					bind:value={editedItem.text}
				/></label
			>
			<label class="flex flex-col gap-2"
				>Icon<input
					class="text-white text-base outline outline-[#838383] outline-1 p-2 rounded bg-transparent"
					type="text"
					bind:value={editedItem.icon}
				/></label
			>
			<div class="flex flex-col gap-2">
				Color
				<div
					class="dark flex gap-2 outline outline-[#838383] outline-1 p-2 rounded color-picker-class"
				>
					<ColorPicker
						bind:isOpen
						bind:hex={editedItem.color}
						bind:disableCloseClickOutside={isPickerDisabled}
						sliderDirection={'horizontal'}
						components={ChromeVariant}
						textInputModes={['hex']}
						isTextInput={false}
						label={''}
						--input-size="24px"
						--input-radius=""
					/>
					<input
						class="text-white text-base bg-transparent outline-none"
						type="text"
						bind:value={editedItem.color}
					/>
				</div>
			</div>
			<div class="flex flex-row gap-5 mt-5 justify-between items-center">
				<button
					class="bg-newtab text-sm outline outline-[#545454] outline-1 hover:outline-[#a7c080] rounded hover:text-[#a7c080] p-2 w-full duration-100"
					on:click={save}>Save</button
				>
				<button
					class="bg-newtab text-sm outline outline-[#545454] outline-1 hover:outline-[#e67e80] rounded hover:text-[#e67e80] p-2 w-full duration-100"
					on:click={cancel}>Cancel</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.dark {
		--cp-bg-color: #171717;
		--cp-border-color: #171717;
	}
</style>
