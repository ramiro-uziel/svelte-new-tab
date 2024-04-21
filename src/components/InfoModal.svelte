<!-- ItemEditModal.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';

	let parent: Element;
	let enabled = true;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
</script>

<div
	class="bg-black bg-opacity-60 w-screen h-screen absolute flex justify-center items-center font-Bitter"
	transition:fade={{ duration: 150 }}
	bind:this={parent}
>
	<div
		class="bg-newtab outline outline-[#838383] outline-1 absolute rounded-2xl w-96 p-5"
		use:clickoutside={{ enabled, limit: { parent } }}
		on:clickoutside={close}
	>
		<button class="text-white fa-solid fa-close absolute top-0 right-0 p-5" on:click={close} />

		<div class="text-white text-md flex flex-col gap-4 p-5">
			<div class="flex flex-col gap-2">
				Author
				<div
					class="text-white text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent"
				>
					@ramirouziel
				</div>
			</div>

			<div class="flex flex-col gap-2">
				Version
				<div
					class="text-white text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent"
				>
					0.1
				</div>
			</div>
		</div>
	</div>
</div>
