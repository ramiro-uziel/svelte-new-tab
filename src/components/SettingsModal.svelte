<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { quintOut } from 'svelte/easing';
	import Tabs from './Tabs.svelte';
	import About from './Settings/About.svelte';
	import FileLayout from './Settings/FileLayout.svelte';
	import Theming from './Settings/Theming/Theming.svelte';
	import Donate from './Settings/Donate.svelte';
	import Placeholder from './Settings/Placeholder.svelte';

	let parent: Element;
	let enabled = true;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function reload() {
		dispatch('reload');
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
	let items = [
		{ label: 'About', icon: 'fa-solid fa-circle-info', value: 1, component: About },
		{ label: 'Layout', icon: 'fa-solid fa-list', value: 2, component: FileLayout },
		{ label: 'Theming', icon: 'fa-solid fa-palette', value: 3, component: Theming },
		{ label: 'Donate', icon: 'fa-solid fa-heart', value: 4, component: Donate }
	];
</script>

<div transition:fade={{ duration: 80 }}>
	<div
		class="bg-black bg-opacity-60 w-screen h-screen fixed flex justify-center items-center font-Bitter backdrop-blur z-10"
		bind:this={parent}
	>
		<div
			class="backdrop-blur-md relative bg-transparent outline outline-[#353535] outline-1 rounded-2xl p-5"
			use:clickoutside={{ enabled, limit: { parent } }}
			on:clickoutside={close}
			transition:fly={{ y: -20, easing: quintOut }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				class="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl svg-filter"
				style="z-index: 0;"
			>
				<defs>
					<filter
						id="turbulence"
						x="0"
						y="0"
						width="100%"
						height="100%"
						filterUnits="objectBoundingBox"
						color-interpolation-filters="sRGB"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.70"
							numOctaves="4"
							stitchTiles="stitch"
						/>
					</filter>
				</defs>
				<rect width="100%" height="100%" filter="url(#turbulence)" />
			</svg>

			<!--
				<button
				class="text-[#464646] hover:text-white fa-solid fa-close absolute top-0 right-0 p-6 active:translate-y-[2px] duration-100"
				on:click={close}
				/>
			-->
			<div class="mt-0 py-5 px-8 mb-2 min-h-[340px] min-w-[585px]">
				<Tabs {items} on:close={close} on:reload={reload} on:sreload={reload}>
					<div slot="close"><span class="fa-solid fa-close" /></div>
				</Tabs>
			</div>
		</div>
	</div>
</div>

<style>
	/* Default opacity for Chrome */
	.svg-filter {
		opacity: 0.2;
	}

	/* Specific opacity for Firefox */
	@supports (-moz-appearance: none) {
		.svg-filter {
			opacity: 0.1;
		}
	}
</style>
