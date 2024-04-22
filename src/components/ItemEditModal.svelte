<!-- ItemEditModal.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';

	let parent: Element;
	let enabled = true;

	export let item: { id: string; text: string; icon: string; url: string } = {
		id: '',
		text: '',
		icon: '',
		url: ''
	};

	let editedItem: { id: string; text: string; icon: string; url: string } = { ...item };

	const dispatch = createEventDispatcher();

	function save() {
		dispatch('save', editedItem);
	}

	function cancel() {
		dispatch('cancel');
	}

	function clickedOut(e: CustomEvent<MouseEvent>) {
		console.log('[!] User clicked');
	}
</script>

<div
	class="bg-black backdrop-blur bg-opacity-60 w-screen h-screen absolute flex justify-center items-center font-Bitter"
	transition:fade={{ duration: 150 }}
	bind:this={parent}
>
	<div
		class="relative backdrop-blur-lg outline outline-[#353535] outline-1 rounded-2xl w-96 p-5"
		use:clickoutside={{ enabled, limit: { parent } }}
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
			<label class="flex flex-col gap-2"
				>URL<input
					class="text-white text-base outline outline-[#838383] outline-1 p-2 rounded bg-transparent"
					type="text"
					bind:value={editedItem.url}
				/></label
			>
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
