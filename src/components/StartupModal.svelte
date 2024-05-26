<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { quintOut } from 'svelte/easing';
	import Tabs from './Tabs.svelte';
	import StartupAbout from './Settings/StartupAbout.svelte';
	import StartupFileLayout from './Settings/StartupFileLayout.svelte';
	import Donate from './Settings/Donate.svelte';

	let parent: Element;
	let enabled = true;

	const dispatch = createEventDispatcher();
	let renderSVG = true; // Control re-render

	function close() {
		dispatch('close');
	}

	function reload() {
		dispatch('reload');
	}

	function ready() {
		console.log('StartupModal Component Set Ready');
		dispatch('ready');
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
		{ label: 'First Time', icon: 'fa-solid fa-house', value: 1, component: StartupAbout },
		{ label: 'Layout', icon: 'fa-solid fa-list', value: 2, component: StartupFileLayout },
		{ label: 'Donate', icon: 'fa-solid fa-heart', value: 4, component: Donate }
	];

	function handleTabChange() {
		renderSVG = false; // Hide SVG
		setTimeout(() => {
			renderSVG = true; // Show SVG after a short delay
		}, 0);
	}
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
			<div class="mt-0 py-5 px-8 mb-2 min-h-[475px] min-w-[585px]">
				<Tabs
					{items}
					on:tabchange={handleTabChange}
					on:close={close}
					on:reload={reload}
					on:ready={ready}
				>
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
