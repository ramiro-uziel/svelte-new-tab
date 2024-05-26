<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function loadColumnsFromStorage() {
		if (typeof window !== 'undefined') {
			const columnsData = localStorage.getItem('columnsData');
			return columnsData ? JSON.parse(columnsData) : null;
		}
		return null;
	}

	function downloadJSON(data: any, filename: string) {
		const jsonStr = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function saveFile(data: any, filename: string) {
		const options = {
			types: [
				{
					description: 'JSON Files',
					accept: {
						'application/json': ['.json']
					}
				}
			]
		};

		if ('showSaveFilePicker' in window) {
			try {
				// Show save file picker
				const handle = await (window as any).showSaveFilePicker({
					suggestedName: filename,
					...options
				});

				// Create a writable stream
				const writable = await handle.createWritable();

				// Write the contents of the file
				await writable.write(JSON.stringify(data, null, 2));

				// Close the file and write the contents to disk
				await writable.close();
			} catch (error) {
				console.error('Error saving file:', error);
			}
		} else {
			console.warn(
				'The File System Access API is not supported in this browser. Downloading directly.'
			);
			downloadJSON(data, filename);
		}
	}

	async function loadAndDownloadColumns() {
		const loadedColumns = loadColumnsFromStorage();
		if (loadedColumns) {
			const filename = 'columnsData.json';
			await saveFile(loadedColumns, filename);
		} else {
			alert('No columns data found in local storage.');
		}
	}

	function resetColumns() {
		if (typeof window !== 'undefined') {
			const userConfirmed = confirm(
				'Are you sure you want to reset?\nThis will erase the local storage and cookies.'
			);
			if (userConfirmed) {
				localStorage.removeItem('columnsData');
				document.cookie.split(';').forEach((c) => {
					document.cookie = c
						.replace(/^ +/, '')
						.replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
				});
				window.location.reload();
			}
		}
	}

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
	<div class="flex flex-col gap-4 items-center">
		<div
			class="flex flex-col justify-center items-center text-white text-base outline-1 p-2 rounded bg-transparent"
		>
			Export or import the layout in a file.
			<div class="flex flex-row gap-2 mt-2 text-[#ffffff81] text-sm">
				<i class="fa-solid fa-info-circle text-xs mt-0.5 border-[#ffffff81] text-[#ffffff81]" />
				<p>On import, the layout is saved in your browser's local storage.</p>
			</div>
		</div>

		<div class="flex flex-col gap-4 w-96">
			<div class="flex flex-row gap-4">
				<button
					class="text-white w-52 text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent hover:text-light-blue hover:bg-[#ffffff09] flex items-center justify-center hover:outline duration-100 active:scale-[98%]"
					on:click={triggerFileInput}
				>
					<i class="text-sm fa-solid fa-arrow-up" />
					<span class="ml-2">Import</span>
				</button>
				<button
					class="text-white w-52 text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent hover:text-light-blue hover:bg-[#ffffff09] flex items-center justify-center hover:outline duration-100 active:scale-[98%]"
					on:click={loadAndDownloadColumns}
				>
					<i class="text-sm fa-solid fa-arrow-down" />
					<span class="ml-2">Export</span>
				</button>
			</div>
			<button
				class="text-white w-full text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent hover:text-red-300 hover:bg-[#ffffff09] flex items-center justify-center hover:outline duration-100 active:scale-[98%]"
				on:click={resetColumns}
			>
				<i class="text-sm fa-solid fa-trash" />
				<span class="ml-2">Reset</span>
			</button>
		</div>
	</div>
</div>
