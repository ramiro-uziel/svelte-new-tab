<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	import ItemEditModal from '../components/ItemEditModal.svelte';
	import InfoModal from '../components/InfoModal.svelte';
	const flipDurationMs = 150;

	let columns: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	}[];
	let isReady = false;
	let dragDisabled = true;

	function toggleDragAbility() {
		if (showModal) {
			showModal = false;
		}
		dragDisabled = !dragDisabled;
	}

	let infoModalVisible = false;

	function toggleInfo() {
		infoModalVisible = !infoModalVisible;
	}

	let showModal = false;
	let currentItem: {
		id: string;
		text: string;
		icon: string;
		url: string;
	};

	function openModal(item: { id: string; text: string; icon: string; url: string }): void {
		currentItem = item;
		showModal = true;
	}

	function handleSave(
		event: CustomEvent<{ id: string; text: string; icon: string; url: string }>
	): void {
		const updatedItem = event.detail; // Getting the updated item from the event detail
		const index = columns.findIndex((col) => col.items.some((i) => i.id === updatedItem.id));
		const itemIndex = columns[index].items.findIndex((i) => i.id === updatedItem.id);
		columns[index].items[itemIndex] = updatedItem;
		saveColumnsToStorage();
		showModal = false;
	}

	function handleCancel(): void {
		showModal = false;
	}
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

	function loadColumnsFromStorage() {
		if (typeof window !== 'undefined') {
			const storedColumns = localStorage.getItem('columnsData');
			return storedColumns ? JSON.parse(storedColumns) : getDefaultColumns();
		}
		return getDefaultColumns();
	}

	onMount(() => {
		setTimeout(() => {
			columns = loadColumnsFromStorage();
			isReady = true;
		}, 0);
	});

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

	function saveColumnsToStorage() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('columnsData', JSON.stringify(columns));
		}
	}
</script>

<body class="bg-newtab w-full h-screen flex flex-col justify-center items-center">
	{#if showModal}
		<ItemEditModal item={currentItem} on:save={handleSave} on:cancel={handleCancel} />
	{/if}

	{#if infoModalVisible}
		<InfoModal on:close={toggleInfo} />
	{/if}

	<div class="absolute bottom-0 right-0 items-center space-x-2 p-8">
		<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${dragDisabled ? 'text-[#181818]' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
			on:click={toggleDragAbility}
		>
			<i class="fa-solid fa-pencil p-5"></i>
		</button>
	</div>

	<div class="absolute bottom-0 left-0 items-center space-x-2 p-8">
		<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${infoModalVisible ? 'text-[#fdf6e3] hover:text-[#fdf6e3]' : 'text-[#181818] '}`}
			on:click={toggleInfo}
		>
			<i class="fa-solid fa-info p-5"></i>
		</button>
	</div>

	{#if isReady}
		<div transition:fade={{ duration: 300 }} class="grid grid-cols-3 gap-x-28 gap-y-10">
			{#each columns as column, i (column.id)}
				<div class="">
					<div
						class="text-2xl font-Bitter font-bold mb-3 flex items-center gap-3 pl-3"
						style="color: {column.color}"
					>
						<i class={column.icon} />
						{column.text}
					</div>
					<div
						on:consider={(e) => handleConsider(e, i)}
						on:finalize={(e) => handleFinalize(e, i)}
						use:dndzone={{
							items: column.items,
							flipDurationMs,
							dragDisabled,
							dropTargetStyle: {
								outline: 'rgba(255, 255, 255, 0.3) solid 1px',
								borderRadius: '10px',
								outlineStyle: 'dashed'
							}
						}}
						class="flex flex-col space-y-2 p-2"
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
								<div>
									{item.text}
								</div>
								{#if !dragDisabled}
									<button
										class="ml-auto rounded-full hover:bg-[#444] bg-transparent"
										on:click|stopPropagation={(event) => {
											openModal(item);
											event.stopPropagation();
										}}
									>
										<i class="fa-solid fa-gear text-[#fdf6e3] p-2"></i>
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
