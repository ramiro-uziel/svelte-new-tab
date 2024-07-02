/* Adding, saving, loading for columns and items */

import { get, writable } from 'svelte/store';
import { getDefaultColumns } from '$lib/default_columns';
import { showStartupModal, showItemEditModal } from './modal';

export const currentItem = writable<
	| {
			id: string;
			text: string;
			icon: string;
			url: string;
	  }
	| undefined
>(undefined);

export const currentColumn = writable<
	| {
			id: any;
			text: string;
			icon: string;
			color: string;
			items: { id: string; text: string; icon: string; url: string }[];
	  }
	| undefined
>(undefined);

export const columns = writable<
	{
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	}[]
>([]);

export function loadColumnsFromStorage() {
	if (typeof window !== 'undefined') {
		const storedColumns = localStorage.getItem('columnsData');
		if (storedColumns) {
			return JSON.parse(storedColumns);
		} else {
			const defaultColumns = getDefaultColumns();
			saveColumnsToStorage(defaultColumns);
			showStartupModal.set(true);
			return defaultColumns;
		}
	}
	return getDefaultColumns();
}

export function saveColumnsToStorage(
	columns: {
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	}[]
) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('columnsData', JSON.stringify(columns));
	}
}

export function reloadColumnsFromStorage() {
	columns.set(loadColumnsFromStorage());
}

export function addNewItem(columnId: number) {
	const colArray = get(columns);
	const column = colArray.find((col) => col.id === columnId);
	if (!column) {
		console.error('[!] Error adding item. The column where the item is being added was not found.');
		return;
	}
	currentColumn.set(column);
	currentItem.set({
		id: Date.now().toString(),
		text: '',
		icon: '',
		url: ''
	});
	showItemEditModal.set(true);
}

export function addNewColumn() {
	const newColumn = {
		id: `col_${Date.now()}`,
		text: 'Column',
		icon: 'fa-solid fa-columns',
		color: '#cccccc',
		items: []
	};
	columns.update((cols) => [...cols, newColumn]);
	saveColumnsToStorage(get(columns));
}
