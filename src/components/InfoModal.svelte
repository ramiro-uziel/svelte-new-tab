<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { browser } from '$app/environment';

	let parent: Element;
	let enabled = true;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	if (typeof window !== 'undefined') {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === 'Escape') {
				event.stopPropagation();

				if (event.key === 'Enter') {
					close();
				} else if (event.key === 'Escape') {
					close();
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
	transition:fade={{ duration: 80 }}
	bind:this={parent}
>
	<div
		class="relative bg-transparent backdrop-blur-lg outline outline-[#353535] outline-1 rounded-2xl w-96 p-5"
		use:clickoutside={{ enabled, limit: { parent } }}
		on:clickoutside={close}
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

		<button
			class="text-[#464646] hover:text-white fa-solid fa-close absolute top-0 right-0 p-5 active:translate-y-[2px] duration-100"
			on:click={close}
		/>

		<div class="text-white text-md flex flex-col gap-4 p-5 selection:bg-[#39756d]">
			<div class="flex flex-col gap-2">
				Author
				<div
					class="text-white text-base select-all outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent"
				>
					@ramirouziel
				</div>
			</div>

			<div class="flex flex-col gap-2">
				Version
				<div
					class="text-white text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent"
				>
					0.2
				</div>
			</div>
		</div>
	</div>
</div>
