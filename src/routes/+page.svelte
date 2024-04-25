<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	import ItemEditModal from '../components/ItemEditModal.svelte';
	import ColumnEditModal from '../components/ColumnEditModal.svelte';
	import InfoModal from '../components/InfoModal.svelte';
	const flipDurationMs = 150;

	let columns: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	}[];

	let currentItem: {
		id: string;
		text: string;
		icon: string;
		url: string;
	};

	let currentColumn: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	};

	function getDefaultColumns() {
		return [
			{
				id: 'SOCIAL',
				text: 'Social',
				icon: 'fa-solid fa-envelope',
				color: '#e67e80',
				items: [
					{
						id: '1',
						text: 'Gmail',
						icon: 'fa-solid fa-envelope',
						url: 'https://mail.google.com/mail/u/0/#inbox'
					},
					{
						id: '2',
						text: 'Twitter',
						icon: 'fa-brands fa-twitter',
						url: 'https://www.twitter.com/'
					},
					{
						id: '3',
						text: 'Discord',
						icon: 'fa-brands fa-discord',
						url: 'https://discord.com/login'
					},
					{
						id: '4',
						text: 'Reddit',
						icon: 'fa-brands fa-reddit',
						url: 'https://www.reddit.com/'
					}
				]
			},
			{
				id: 'CODE',
				text: 'Code',
				icon: 'fa-solid fa-terminal',
				color: '#a7c080',
				items: [
					{
						id: '5',
						text: 'GitHub',
						icon: 'fa-brands fa-github',
						url: 'https://github.com/login'
					},
					{
						id: '6',
						text: 'Codewars',
						icon: 'fa-solid fa-fan',
						url: 'https://www.codewars.com/dashboard'
					},
					{
						id: '7',
						text: 'Hacker News',
						icon: 'fa-brands fa-square-hacker-news',
						url: 'https://news.ycombinator.com/'
					},
					{
						id: '8',
						text: 'Flathub',
						icon: 'fa-solid fa-flask',
						url: 'https://flathub.org/'
					}
				]
			},
			{
				id: 'CLASS',
				text: 'Class',
				icon: 'fa-solid fa-book',
				color: '#dbbc7f',
				items: [
					{
						id: '9',
						text: 'Calendar',
						icon: 'fa-solid fa-calendar',
						url: 'https://calendar.google.com/calendar/u/0/r?pli=1'
					},
					{
						id: '10',
						text: 'Drive [Tec]',
						icon: 'fa-brands fa-google-drive',
						url: 'https://drive.google.com/drive/u/1/my-drive'
					},
					{
						id: '11',
						text: 'Drive [Per]',
						icon: 'fa-brands fa-google-drive',
						url: 'https://drive.google.com/drive/u/0/my-drive'
					},
					{
						id: '12',
						text: 'Canvas',
						icon: 'fa-solid fa-chalkboard',
						url: 'https://experiencia21.tec.mx/'
					}
				]
			},
			{
				id: 'MEDIA',
				text: 'Media',
				icon: 'fa-solid fa-clapperboard',
				color: '#7fbbb3',
				items: [
					{
						id: '13',
						text: 'Youtube',
						icon: 'fa-brands fa-youtube',
						url: 'https://www.youtube.com/'
					},
					{
						id: '14',
						text: 'Twitch',
						icon: 'fa-brands fa-twitch',
						url: 'https://www.twitch.tv/'
					},
					{
						id: '15',
						text: 'Spotify',
						icon: 'fa-brands fa-spotify',
						url: 'https://open.spotify.com'
					},
					{
						id: '16',
						text: 'Aniwatch',
						icon: 'fa-solid fa-file-video',
						url: 'https://aniwatch.to'
					}
				]
			},
			{
				id: 'UTILITY',
				text: 'Utility',
				icon: 'fa-solid fa-gear',
				color: '#d699b6',
				items: [
					{
						id: '17',
						text: 'ChatGPT',
						icon: 'fa-solid fa-robot',
						url: 'https://chat.openai.com/'
					},
					{
						id: '18',
						text: 'Cobalt',
						icon: 'fa-solid fa-wrench',
						url: 'https://cobalt.tools/'
					},
					{
						id: '19',
						text: 'Home Assistant',
						icon: 'fa-solid fa-home',
						url: 'http://homeassistant:8123/lovelace/default_view'
					},
					{
						id: '20',
						text: 'Portainer',
						icon: 'fa-solid fa-server',
						url: 'https://shitville.duckdns.org:9443'
					}
				]
			},
			{
				id: 'MUSIC',
				text: 'Music',
				icon: 'fa-solid fa-music',
				color: '#83c092',
				items: [
					{
						id: '21',
						text: 'Soundcloud',
						icon: 'fa-brands fa-soundcloud',
						url: 'https://soundcloud.com/'
					},
					{
						id: '22',
						text: 'Apple Music',
						icon: 'fa-brands fa-apple',
						url: 'https://www.music.apple.com/'
					},
					{
						id: '23',
						text: 'Youtube Music',
						icon: 'fa-brands fa-youtube',
						url: 'https://www.music.youtube.com/'
					},
					{
						id: '24',
						text: 'Last.fm',
						icon: 'fa-brands fa-lastfm',
						url: 'https://www.last.fm/user/'
					}
				]
			}
		];
	}

	let isReady = false;
	let dragDisabled = true;
	let morphDisabled = false;
	let infoModalVisible = false;
	let showItemEditModal = false;
	let showColumnEditModal = false;

	$: anyModalVisible = infoModalVisible || showItemEditModal || showColumnEditModal;

	function toggleDragAbility() {
		if (showItemEditModal) {
			showItemEditModal = false;
		}
		dragDisabled = !dragDisabled;
	}

	function toggleInfo() {
		infoModalVisible = !infoModalVisible;
	}

	function openItemModal(item: { id: string; text: string; icon: string; url: string }): void {
		currentItem = item;
		showItemEditModal = true;
	}

	function openColumnModal(column: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	}): void {
		currentColumn = column;
		showColumnEditModal = true;
	}

	function handleItemSave(
		event: CustomEvent<{ id: string; text: string; icon: string; url: string }>
	): void {
		const updatedItem = event.detail;
		const columnIndex = columns.findIndex((col) => col.items.some((i) => i.id === updatedItem.id));

		if (columnIndex === -1) {
			const targetColumnIndex = columns.findIndex((col) => col.id === currentColumn.id);
			if (targetColumnIndex !== -1) {
				columns[targetColumnIndex].items.push(updatedItem);
			} else {
				console.error('No valid column found to add new item');
				return;
			}
		} else {
			const itemIndex = columns[columnIndex].items.findIndex((i) => i.id === updatedItem.id);
			if (itemIndex !== -1) {
				columns[columnIndex].items[itemIndex] = updatedItem;
			} else {
				console.error('Item index not found, cannot update item');
				return;
			}
		}
		columns = [...columns];
		saveColumnsToStorage();
		showItemEditModal = false;
	}

	function handleColumnSave(
		event: CustomEvent<{
			id: any;
			text: string;
			icon: string;
			color: string;
			items: { id: string; text: string; icon: string; url: string }[];
		}>
	): void {
		const updatedItem = event.detail;
		const index = columns.findIndex((col) => col.id === updatedItem.id);
		columns[index] = updatedItem;
		saveColumnsToStorage();
		showColumnEditModal = false;
	}

	function handleCancel(): void {
		showItemEditModal = false;
		showColumnEditModal = false;
	}

	function loadColumnsFromStorage() {
		if (typeof window !== 'undefined') {
			const storedColumns = localStorage.getItem('columnsData');
			return storedColumns ? JSON.parse(storedColumns) : getDefaultColumns();
		}
		return getDefaultColumns();
	}

	function saveColumnsToStorage() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('columnsData', JSON.stringify(columns));
		}
	}

	function handleConsider(
		e: CustomEvent<DndEvent<{ id: string; text: string; icon: string; url: string }>>,
		i: number
	) {
		columns[i].items = e.detail.items;
	}

	function handleFinalize(
		e: CustomEvent<DndEvent<{ id: string; text: string; icon: string; url: string }>>,
		i: number
	) {
		columns[i].items = e.detail.items;
		saveColumnsToStorage();
	}

	function handleColumnConsider(e: CustomEvent<DndEvent<(typeof columns)[0]>>) {
		const newColumns = e.detail.items;
		columns = newColumns;
	}

	function handleColumnFinalize(e: CustomEvent<DndEvent<(typeof columns)[0]>>) {
		const newColumns = e.detail.items;
		columns = newColumns;
		saveColumnsToStorage();
	}

	if (typeof window !== 'undefined') {
		const handleGlobalKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && anyModalVisible) {
				event.preventDefault();
				event.stopPropagation();
			} else if (event.key === 'Escape') {
				dragDisabled = true;
			}
		};

		onMount(() => {
			window.addEventListener('keydown', handleGlobalKeydown);
		});

		onDestroy(() => {
			window.removeEventListener('keydown', handleGlobalKeydown);
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
		}
	}

	onMount(() => {
		setTimeout(() => {
			columns = loadColumnsFromStorage();
			isReady = true;
		}, 0);
	});

	function openNewItemModal(columnId: number) {
		const column = columns.find((col) => col.id === columnId);
		if (!column) {
			console.error('Column not found');
			return;
		}
		currentColumn = column;
		currentItem = {
			id: Date.now().toString(),
			text: '',
			icon: '',
			url: ''
		};
		showItemEditModal = true;
	}

	function handleDelete(event: CustomEvent<string>): void {
		const itemId = event.detail;
		columns = columns.map((column) => ({
			...column,
			items: column.items.filter((item) => item.id !== itemId)
		}));
		columns = [...columns];
		saveColumnsToStorage();
		showItemEditModal = false;
	}
</script>

<body class="bg-newtab w-full h-screen flex flex-col justify-center items-center">
	{#if showItemEditModal}
		<ItemEditModal
			item={currentItem}
			on:save={handleItemSave}
			on:cancel={handleCancel}
			on:delete={handleDelete}
		/>
	{/if}

	{#if showColumnEditModal}
		<ColumnEditModal item={currentColumn} on:save={handleColumnSave} on:cancel={handleCancel} />
	{/if}

	{#if infoModalVisible}
		<InfoModal on:close={toggleInfo} />
	{/if}

	<div class="absolute bottom-0 right-0 items-center space-x-2 p-8">
		<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${dragDisabled ? 'text-[#181818]' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
			on:click={toggleDragAbility}
			on:keydown={handleKeydown}
		>
			<i class="fa-solid fa-pencil p-5"></i>
		</button>
	</div>

	<div class="absolute bottom-0 left-0 items-center space-x-2 p-8">
		<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${infoModalVisible ? 'text-[#fdf6e3] hover:text-[#fdf6e3]' : 'text-[#181818] '}`}
			on:click={toggleInfo}
			on:keydown={handleKeydown}
		>
			<i class="fa-solid fa-info p-5"></i>
		</button>
	</div>

	{#if isReady}
		<div
			transition:fade={{ duration: 300 }}
			class="grid grid-cols-3 gap-x-28 gap-y-10"
			on:consider={(e) => handleColumnConsider(e)}
			on:finalize={(e) => handleColumnFinalize(e)}
			use:dndzone={{
				items: columns,
				type: 'columns',
				flipDurationMs,
				dragDisabled,
				morphDisabled,
				dropTargetStyle: {
					outline: 'rgba(255, 255, 255, 0.3) solid 1px',
					borderRadius: '10px',
					outlineStyle: 'dashed'
				}
			}}
		>
			{#each columns as column, i (column.id)}
				<div class="p-0.5" animate:flip={{ duration: flipDurationMs, easing: quintOut }}>
					<div
						class="text-2xl font-Bitter font-bold mb-3 flex items-center gap-3 pl-3"
						style="color: {column.color}"
					>
						<i class={column.icon} />
						{column.text}
						{#if !dragDisabled}
							<button
								transition:fade={{ duration: 100 }}
								class="ml-auto rounded-full bg-transparent"
								on:click|stopPropagation={(event) => {
									openColumnModal(column);
									event.stopPropagation();
								}}
							>
								<i class="fa-solid fa-gear text-[20px] hover:text-light-blue duration-200"></i>
							</button>
							<button
								transition:fade={{ duration: 100 }}
								class="rounded-full bg-transparent mr-2.5"
								on:click|stopPropagation={(event) => {
									openNewItemModal(column.id);
									event.stopPropagation();
								}}
							>
								<i class="fa-solid fa-plus text-[20px] p-2 hover:text-light-blue duration-200"></i>
							</button>
						{/if}
					</div>
					<div
						on:consider={(e) => handleConsider(e, i)}
						on:finalize={(e) => handleFinalize(e, i)}
						use:dndzone={{
							items: column.items,
							type: 'column.items',
							flipDurationMs,
							dragDisabled,
							morphDisabled,
							dropTargetStyle: {
								outline: 'rgba(255, 255, 255, 0.3) solid 1px',
								borderRadius: '10px',
								outlineStyle: 'dashed'
							}
						}}
						class="flex flex-col space-y-2 p-2 min-h-[23vh]"
					>
						{#each column.items as item (item.id)}
							<a
								href={dragDisabled ? item.url : undefined}
								class="bg-newtab p-2 px-2 rounded-[10px] border border-[#545454] text-[#fdf6e3]
								hover:bg-[#2c2c2c] hover:border-[#c1f4ff] hover:text-[#c1f4ff]
								font-Bitter text-[18px] flex items-center duration-75"
								animate:flip={{ duration: flipDurationMs, easing: quintOut }}
							>
								<div class="w-[30px] flex justify-center ml-[-4px] mr-1">
									<i class={`${item.icon} `} />
								</div>
								<div class="text-clip">
									{item.text}
								</div>
								{#if !dragDisabled}
									<button
										transition:fade={{ duration: 100 }}
										class="ml-auto rounded-full bg-transparent"
										on:click|stopPropagation={(event) => {
											openItemModal(item);
											event.stopPropagation();
										}}
									>
										<i
											class="fa-solid fa-gear text-[#fdf6e3] hover:text-[#c1f4ff] px-[2px] duration-200"
										></i>
									</button>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</body>
