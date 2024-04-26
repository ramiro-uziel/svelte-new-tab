<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	import { getDefaultColumns } from '$lib/columns';
	import ItemEditModal from '../components/ItemEditModal.svelte';
	import ColumnEditModal from '../components/ColumnEditModal.svelte';
	import InfoModal from '../components/InfoModal.svelte';

	const flipDurationMs = 150;
	let isReady = false;
	let dragDisabled = true;
	let morphDisabled = false;
	let infoModalVisible = false;
	let showItemEditModal = false;
	let showColumnEditModal = false;

	$: anyModalVisible = infoModalVisible || showItemEditModal || showColumnEditModal;

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

	// --------------- CONDITIONAL STYLE CLASSES  ---------------

	let layoutClass = '';
	$: {
		if (Array.isArray(columns)) {
			if (columns.length <= 3) {
				layoutClass = `gap-x-10 grid grid-cols-${columns.length}`;
			} else {
				const cols = Math.min(Math.ceil(columns.length / 2), 6);
				layoutClass = `gap-x-28 gap-y-10 grid grid-cols-${cols}`;
			}
		}
	}

	let centerItems = true;
	$: if (Array.isArray(columns) && columns.length > 0) {
		centerItems = columns.length <= 18;
	}

	// --------------- PAGE BUTTONS ---------------

	function toggleDragAbility() {
		if (showItemEditModal) {
			showItemEditModal = false;
		}
		dragDisabled = !dragDisabled;
	}

	function toggleInfo() {
		infoModalVisible = !infoModalVisible;
	}

	// --------------- MODALS ---------------

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

	// --------------- ADDING ELEMENTS ---------------

	function addNewItem(columnId: number) {
		const column = columns.find((col) => col.id === columnId);
		if (!column) {
			console.error(
				'[!] Error adding item. The column where the item is being added was not found.'
			);
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

	function addNewColumn() {
		const newColumn = {
			id: `col_${Date.now()}`,
			text: 'Column',
			icon: 'fa-solid fa-columns',
			color: '#cccccc',
			items: []
		};
		columns = [...columns, newColumn];
		saveColumnsToStorage();
	}

	// --------------- LOADING AND SAVING  ---------------

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

	// --------------- ACTION HANDLERS  ---------------

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

	function handleItemDelete(event: CustomEvent<string>): void {
		const itemId = event.detail;
		columns = columns.map((column) => ({
			...column,
			items: column.items.filter((item) => item.id !== itemId)
		}));
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

	function handleColumnDelete(event: CustomEvent<string>): void {
		const columnId = event.detail;
		columns = columns.filter((column) => column.id !== columnId);
		columns = [...columns];
		saveColumnsToStorage();
		showColumnEditModal = false;
	}

	function handleCancel(): void {
		showItemEditModal = false;
		showColumnEditModal = false;
	}

	function handleItemConsider(
		e: CustomEvent<DndEvent<{ id: string; text: string; icon: string; url: string }>>,
		i: number
	) {
		columns[i].items = e.detail.items;
	}

	function handleItemFinalize(
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

	// --------------- KEYDOWN HANDLERS  ---------------

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
		}
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

	// --------------- PAGE MOUNT  ---------------

	onMount(() => {
		setTimeout(() => {
			columns = loadColumnsFromStorage();
			isReady = true;
		}, 0);
	});
</script>

<body class="bg-newtab overflow-y-auto overflow-x-clip">
	{#if showItemEditModal}
		<ItemEditModal
			item={currentItem}
			on:save={handleItemSave}
			on:cancel={handleCancel}
			on:delete={handleItemDelete}
		/>
	{/if}

	{#if showColumnEditModal}
		<ColumnEditModal
			item={currentColumn}
			on:save={handleColumnSave}
			on:cancel={handleCancel}
			on:delete={handleColumnDelete}
		/>
	{/if}

	{#if infoModalVisible}
		<InfoModal on:close={toggleInfo} />
	{/if}

	<div class="fixed bottom-0 right-0 items-center space-x-2 p-8">
		{#if !dragDisabled}
			<button
				class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${dragDisabled ? 'text-transparent' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
				on:click={addNewColumn}
				><i class="fa-solid fa-plus p-5" />
			</button>{/if}<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${dragDisabled ? 'text-transparent' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
			on:click={toggleDragAbility}
			on:keydown={handleKeydown}
			><i class="fa-solid fa-pencil p-5"></i>
		</button>
	</div>
	<div class="fixed bottom-0 left-0 items-center space-x-2 p-8">
		<button
			class={`hover:text-[#666666] active:scale-90 text-xl duration-100 ${!infoModalVisible ? 'text-transparent hover:text-[#fdf6e3]' : 'text-[#fdf6e3] hover:text-[#fdf6e3]'}`}
			on:click={toggleInfo}
			on:keydown={handleKeydown}
		>
			<i class="fa-solid fa-info p-5"></i>
		</button>
	</div>
	<div class={`flex p-10 justify-center  ${centerItems ? 'h-screen items-center' : ''}`}>
		{#if isReady}
			<div
				transition:fade={{ duration: 300 }}
				class={`${layoutClass}`}
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
										addNewItem(column.id);
										event.stopPropagation();
									}}
								>
									<i class="fa-solid fa-plus text-[20px] p-2 hover:text-light-blue duration-200"
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
									<i class="fa-solid fa-gear text-[20px] hover:text-light-blue duration-200"></i>
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
						font-Bitter text-[18px] flex items-center duration-75 min-h-[45px]"
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
	</div>
</body>
