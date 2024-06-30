<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import SvelteFuse from 'svelte-fuse';
	import type { ResultType } from 'svelte-fuse';
	import { CornerDownLeftIcon } from 'svelte-feather-icons';

	type ColumnItem = {
		id: string;
		text: string;
		icon: string;
		url?: string;
		items?: ColumnItem[];
	};

	type UrlItem = {
		id: string;
		text: string;
		icon: string;
		url: string;
	};

	let columnsData: ColumnItem[] = [];
	let urls: UrlItem[] = [];

	function extractUrls(items: ColumnItem[]): UrlItem[] {
		let extractedUrls: UrlItem[] = [];

		items.forEach((item) => {
			if (item.url) {
				extractedUrls.push({ id: item.id, text: item.text, icon: item.icon, url: item.url });
			}
			if (item.items) {
				extractedUrls = extractedUrls.concat(extractUrls(item.items));
			}
		});

		return extractedUrls;
	}

	onMount(() => {
		const storedSections = localStorage.getItem('columnsData');
		if (storedSections) {
			columnsData = JSON.parse(storedSections);
			urls = extractUrls(columnsData);
		}
	});

	let fuseOptions = {
		keys: ['text', 'url']
	};
	let query = '';
	let result: ResultType<UrlItem> = [];
	let parent: Element;
	let clickoutside_enabled = true;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	let selectedIndex = 0;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === 'Escape') {
			event.stopPropagation();
		}

		if (event.key === 'Enter' && query.length > 0) {
			if (query.startsWith('ch ')) {
				const searchQuery = query.slice(3);
				const chatgptUrl = `https://chat.openai.com/?model=gpt-4o&q=${encodeURIComponent(searchQuery)}`;
				window.location.href = chatgptUrl;
			} else if (query.startsWith('g ')) {
				const searchQuery = query.slice(2);
				const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
				window.location.href = googleUrl;
			} else if (result.length > 0) {
				window.location.href = result[selectedIndex].item.url;
			} else {
				const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
				window.location.href = googleUrl;
			}
		} else if (event.key === 'ArrowDown' && result.length > 0) {
			event.preventDefault();
			selectedIndex = (selectedIndex + 1) % Math.min(result.length, 10);
		} else if (event.key === 'ArrowUp' && result.length > 0) {
			event.preventDefault();
			selectedIndex =
				(selectedIndex - 1 + Math.min(result.length, 10)) % Math.min(result.length, 10);
		} else if (event.key === 'Enter' || event.key === 'Escape') {
			close();
		}
	}

	$: if (query) {
		selectedIndex = 0;
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('keydown', handleKeydown);

		onDestroy(() => {
			window.removeEventListener('keydown', handleKeydown);
		});
	}
</script>

<div transition:fade={{ duration: 30 }}>
	<div
		class="bg-black bg-opacity-60 w-screen h-screen fixed flex justify-center items-center font-Bitter z-10"
		bind:this={parent}
	>
		<div class="rounded-md relative bg-transparent w-[500px] h-[580px]">
			<div
				class="bg-zinc-800 bg-opacity-20 text-white text-md flex flex-col gap-4 p-1 selection:bg-[#39756d] rounded-md backdrop-blur outline-dashed outline-[#464646] outline-1"
				use:clickoutside={{ enabled: clickoutside_enabled, limit: { parent } }}
				on:clickoutside={close}
			>
				<div class="flex flex-col">
					<div class="flex flex-row items-center">
						<i class="ml-4 mr-1 fa-solid fa-search text-md text-zinc-600"></i>
						<input
							class="placeholder-zinc-600 p-3 rounded bg-transparent outline-none text-lg w-full"
							bind:value={query}
							placeholder="Search"
							autofocus
						/>
						<div class="mr-5 text-zinc-600 outline outline-1 rounded-md p-1">
							<CornerDownLeftIcon size="16" />
						</div>
					</div>
					{#if !query.startsWith('ch ') && !query.startsWith('g ')}
						<ul class="overflow-y-auto max-h-[calc(100vh-150px)]">
							{#if result.length > 0}
								<li class="mt-2"></li>
							{/if}
							{#each result.slice(0, 10) as { item }, index}
								<a href={item.url} class="block">
									<li
										class="mt-1 p-3 bg-black bg-opacity-40 rounded-md list-item {index ===
										selectedIndex
											? 'outline outline-1 -outline-offset-1 outline-light-blue'
											: ''} hover:bg-opacity-60 cursor-pointer flex items-center"
									>
										<i class="{item.icon} icon"></i>
										<span class="pl-2">{item.text}</span>
										<span class="pl-2 text-sm text-zinc-500">{item.url.slice(0, 50)}</span>
									</li>
								</a>
							{/each}
						</ul>
					{/if}
					{#if query.startsWith('ch ')}
						<ul class="overflow-y-auto max-h-[calc(100vh-150px)]">
							<li class="mt-2 p-3 bg-black bg-opacity-40 rounded-md list-item items-center">
								<i class="fa-solid fa-robot icon"></i>
								<span class="pl-2">Redirect to ChatGPT Prompt</span>
							</li>
						</ul>
					{/if}
					{#if query.startsWith('g ') || (query.length > 0 && result.length === 0)}
						<ul class="overflow-y-auto max-h-[calc(100vh-150px)]">
							<li class="mt-2 p-3 bg-black bg-opacity-40 rounded-md list-item items-center">
								<i class="fa-brands fa-google icon"></i>
								<span class="pl-2">Redirect to Google</span>
							</li>
						</ul>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<SvelteFuse list={urls} options={fuseOptions} bind:query bind:result />

<style>
	.icon {
		width: 24px;
		text-align: center;
	}
	.list-item {
		box-sizing: border-box;
	}
</style>
