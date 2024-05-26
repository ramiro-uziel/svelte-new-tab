<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function importColumns(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const reader = new FileReader();
			reader.onload = function (e) {
				const content = e.target?.result as string;
				const data = JSON.parse(content);
				localStorage.setItem('columnsData', JSON.stringify(data));
				dispatch('reload');
				dispatch('ready');
				/*
				const userConfirmed = confirm(
					'Columns imported successfully. Do you want to reload the page?'
				);
				if (userConfirmed) {
					window.location.reload();
				}
				*/
			};
			reader.readAsText(file);
		}
	}

	function triggerFileInput() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = importColumns;
		input.click();
	}
</script>

<div class="flex flex-col w-full selection:bg-[#39756d]">
	<div class="flex flex-col gap-4 items-center mt-20">
		<div
			class="flex flex-col justify-center items-center text-white text-base outline-1 p-2 rounded bg-transparent"
		>
			Import a layout in JSON format.
			<div class="flex flex-row gap-2 mt-2 text-[#ffffff81] text-sm">
				<i class="fa-solid fa-info-circle text-xs mt-0.5 border-[#ffffff81] text-[#ffffff81]" />
				<p>On import, the layout is saved in your browser's local storage.</p>
			</div>
		</div>

		<div class="flex flex-col gap-4 w-96">
			<div class="flex flex-row gap-4">
				<button
					class="text-white w-full text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent hover:text-light-blue hover:bg-[#ffffff09] flex items-center justify-center hover:outline duration-100 active:scale-[98%]"
					on:click={triggerFileInput}
				>
					<i class="text-sm fa-solid fa-arrow-up" />
					<span class="ml-2">Import</span>
				</button>
			</div>
		</div>
	</div>
</div>
