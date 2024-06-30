<script lang="ts">
	import { dev } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	import ItemEditModal from '../components/ItemEditModal.svelte';
	import ColumnEditModal from '../components/ColumnEditModal.svelte';
	import SettingsModal from '../components/SettingsModal.svelte';
	import StartupModal from '../components/StartupModal.svelte';
	import SearchModal from '../components/SearchModal.svelte';
	import {
		showStartupModal,
		showSettingsModal,
		showItemEditModal,
		showColumnEditModal,
		showSearchModal,
		dragDisabled,
		openItemModal,
		openColumnModal,
		toggleSettings,
		toggleSearch,
		toggleStartup,
		handleCancel,
		anyModalVisible,
		isReady
	} from '$lib/modal';
	import {
		currentItem,
		currentColumn,
		columns,
		loadColumnsFromStorage,
		saveColumnsToStorage,
		reloadColumnsFromStorage,
		addNewItem,
		addNewColumn
	} from '$lib/items_columns';
	import {
		handleItemSave,
		handleItemDelete,
		handleColumnSave,
		handleColumnDelete
	} from '$lib/handlers';

	const flipDurationMs = 150;

	let layoutClass = '';
	$: {
		const colArray = $columns;
		if (Array.isArray(colArray)) {
			if (colArray.length <= 3) {
				layoutClass = `gap-x-10 grid grid-cols-${colArray.length}`;
			} else {
				const cols = Math.min(Math.ceil(colArray.length / 2), 6);
				layoutClass = `gap-x-28 gap-y-10 grid grid-cols-${cols}`;
			}
		}
	}

	let centerItems = true;
	$: {
		const colArray = $columns;
		if (Array.isArray(colArray) && colArray.length > 0) {
			centerItems = colArray.length <= 18;
		}
	}

	function toggleDragAbility() {
		if ($showItemEditModal) {
			showItemEditModal.set(false);
		}
		dragDisabled.update((value) => !value);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
		}
	}

	function handleColumnConsider(e: CustomEvent<DndEvent<(typeof $columns)[0]>>) {
		const newColumns = e.detail.items;
		columns.set(newColumns);
	}

	function handleColumnFinalize(e: CustomEvent<DndEvent<(typeof $columns)[0]>>) {
		const newColumns = e.detail.items;
		columns.set(newColumns);
		saveColumnsToStorage(newColumns);
	}

	function handleItemConsider(
		e: CustomEvent<DndEvent<{ id: string; text: string; icon: string; url: string }>>,
		i: number
	) {
		const colArray = $columns;
		colArray[i].items = e.detail.items;
		columns.set(colArray);
	}

	function handleItemFinalize(
		e: CustomEvent<DndEvent<{ id: string; text: string; icon: string; url: string }>>,
		i: number
	) {
		const colArray = $columns;
		colArray[i].items = e.detail.items;
		columns.set(colArray);
		saveColumnsToStorage(colArray);
	}

	if (typeof window !== 'undefined') {
		const handleGlobalKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && $anyModalVisible) {
				event.preventDefault();
				event.stopPropagation();
			} else if (event.key === 'Escape') {
				dragDisabled.set(true);
			}

			if (event.key === 's' || event.key === 'S') {
				const activeElement = document.activeElement;
				const typingInInput =
					activeElement &&
					(activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
				if (!typingInInput) {
					event.preventDefault();
					toggleSearch();
				}
			}
		};

		onMount(() => {
			window.addEventListener('keydown', handleGlobalKeydown);
		});

		onDestroy(() => {
			window.removeEventListener('keydown', handleGlobalKeydown);
		});
	}

	onMount(() => {
		setTimeout(() => {
			columns.set(loadColumnsFromStorage());
			if (!$showStartupModal) {
				isReady.set(true);
			}
		}, 0);
	});
</script>

<body class="bg-newtab overflow-y-auto overflow-x-clip">
	{#if $showStartupModal}
		<StartupModal
			on:close={toggleStartup}
			on:reload={reloadColumnsFromStorage}
			on:ready={() => isReady.set(true)}
		/>
	{/if}

	{#if $showItemEditModal}
		<ItemEditModal
			item={$currentItem}
			on:save={handleItemSave}
			on:cancel={handleCancel}
			on:delete={handleItemDelete}
		/>
	{/if}

	{#if $showColumnEditModal}
		<ColumnEditModal
			item={$currentColumn}
			on:save={handleColumnSave}
			on:cancel={handleCancel}
			on:delete={handleColumnDelete}
		/>
	{/if}

	{#if $showSettingsModal}
		<SettingsModal on:close={toggleSettings} on:reload={reloadColumnsFromStorage} />
	{/if}

	{#if $showSearchModal}
		<SearchModal on:close={toggleSearch} />
	{/if}

	<div class="fixed bottom-0 right-0 items-center space-x-2 p-8">
		{#if !$dragDisabled && !$showSettingsModal}
			<button
				class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${$dragDisabled ? 'text-transparent' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
				on:click={addNewColumn}
				><i class="fa-solid fa-plus p-5" />
			</button>
		{/if}
		{#if !$showSettingsModal}
			<button
				class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${$dragDisabled ? 'text-transparent' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
				on:click={toggleDragAbility}
				on:keydown={handleKeydown}
				><i class="fa-solid fa-pencil p-5"></i>
			</button>
		{/if}
	</div>

	{#if dev}
		<div
			class="fixed bottom-0 w-full pointer-events-none text-center p-12 text-[#fdf6e31a] select-none font-Bitter font-bold z-10"
		>
			Dev <i class="fa-solid fa-flask pl-2 text-sm"></i>
		</div>
	{/if}

	<div class="fixed bottom-0 left-0 items-center space-x-2 p-8 z-10">
		<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${!$showSettingsModal ? 'text-transparent' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
			on:click={toggleSettings}
			on:keydown={handleKeydown}
		>
			<i class="fa-solid fa-gear p-5"></i>
		</button>
	</div>

	<div class={`flex p-10 justify-center  ${centerItems ? 'h-screen items-center' : ''}`}>
		{#if $isReady}
			<div
				transition:fade={{ duration: 300 }}
				class={`${layoutClass}`}
				on:consider={(e) => handleColumnConsider(e)}
				on:finalize={(e) => handleColumnFinalize(e)}
				use:dndzone={{
					items: $columns,
					type: 'columns',
					flipDurationMs,
					dragDisabled: $dragDisabled,
					dropTargetStyle: {
						outline: 'rgba(255, 255, 255, 0.3) solid 1px',
						borderRadius: '10px',
						outlineStyle: 'dashed'
					}
				}}
			>
				{#each $columns as column, i (column.id)}
					<div class="p-0.5" animate:flip={{ duration: flipDurationMs, easing: quintOut }}>
						<div
							class="text-2xl font-Bitter font-bold mb-3 flex items-center gap-3 pl-3"
							style="color: {column.color}"
						>
							<i class={column.icon} />
							{column.text}
							{#if !$dragDisabled}
								<button
									transition:fade={{ duration: 100 }}
									class="ml-auto rounded-full bg-transparent"
									on:click|stopPropagation={(event) => {
										addNewItem(column.id);
										event.stopPropagation();
									}}
								>
									<i
										class="fa-solid fa-plus text-[20px] p-2 hover:text-light-blue transition-colors duration-200"
									></i>
								</button>

								<button
									transition:fade={{ duration: 100 }}
									class="rounded-full bg-transparent mr-[17px]"
									on:click|stopPropagation={(event) => {
										openColumnModal(column);
										event.stopPropagation();
									}}
								>
									<i
										class="fa-solid fa-gear text-[20px] hover:text-light-blue transition-colors duration-200"
									></i>
								</button>
							{/if}
						</div>
						<div
							on:consider={(e) => handleItemConsider(e, i)}
							on:finalize={(e) => handleItemFinalize(e, i)}
							use:dndzone={{
								items: column.items,
								type: 'column.items',
								flipDurationMs,
								dragDisabled: $dragDisabled,
								dropTargetStyle: {
									outline: 'rgba(255, 255, 255, 0.3) solid 1px',
									borderRadius: '10px',
									outlineStyle: 'dashed'
								}
							}}
							class="flex flex-col space-y-2 p-2 min-h-[22vh]"
						>
							{#each column.items as item (item.id)}
								<a
									href={$dragDisabled ? item.url : undefined}
									class="bg-newtab p-2 px-2 select-none rounded-[10px] border border-[#545454] text-[#fdf6e3]
						hover:bg-[#2c2c2c] hover:border-[#c1f4ff] hover:text-[#c1f4ff]
						font-Bitter text-[18px] flex items-center transition-colors duration-75 min-h-[45px]"
									animate:flip={{ duration: flipDurationMs, easing: quintOut }}
								>
									<div class="w-[30px] flex justify-center ml-[-4px] mr-1">
										<i class={`${item.icon} `} />
									</div>
									<div class="text-clip">
										{item.text}
									</div>
									{#if !$dragDisabled}
										<button
											transition:fade={{ duration: 100 }}
											class="ml-auto rounded-full bg-transparent"
											on:click|stopPropagation={(event) => {
												openItemModal(item);
												event.stopPropagation();
											}}
										>
											<i
												class="fa-solid fa-gear text-[#fdf6e3] hover:text-[#c1f4ff] px-[2px] transition-colors duration-200"
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
	</div>
</body>
