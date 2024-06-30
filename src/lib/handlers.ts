import { get } from 'svelte/store';
import { columns, saveColumnsToStorage } from './columns';
import { showItemEditModal, showColumnEditModal } from './modal';
import { currentColumn } from './columns';

export function handleItemSave(
	event: CustomEvent<{ id: string; text: string; icon: string; url: string }>
): void {
	const updatedItem = event.detail;
	const colArray = get(columns);
	const columnIndex = colArray.findIndex((col) => col.items.some((i) => i.id === updatedItem.id));

	if (columnIndex === -1) {
		const currentColumnValue = get(currentColumn);
		const targetColumnIndex = colArray.findIndex(
			(col) => currentColumnValue && col.id === currentColumnValue.id
		);
		if (targetColumnIndex !== -1) {
			colArray[targetColumnIndex].items.push(updatedItem);
		} else {
			console.error('No valid column found to add new item');
			return;
		}
	} else {
		const itemIndex = colArray[columnIndex].items.findIndex((i) => i.id === updatedItem.id);
		if (itemIndex !== -1) {
			colArray[columnIndex].items[itemIndex] = updatedItem;
		} else {
			console.error('Item index not found, cannot update item');
			return;
		}
	}
	columns.set([...colArray]);
	saveColumnsToStorage(colArray);
	showItemEditModal.set(false);
}

export function handleItemDelete(event: CustomEvent<string>): void {
	const itemId = event.detail;
	const colArray = get(columns).map((column) => ({
		...column,
		items: column.items.filter((item) => item.id !== itemId)
	}));
	columns.set([...colArray]);
	saveColumnsToStorage(colArray);
	showItemEditModal.set(false);
}

export function handleColumnSave(
	event: CustomEvent<{
		id: any;
		text: string;
		icon: string;
		color: string;
		items: { id: string; text: string; icon: string; url: string }[];
	}>
): void {
	const updatedItem = event.detail;
	const colArray = get(columns);
	const index = colArray.findIndex((col) => col.id === updatedItem.id);
	colArray[index] = updatedItem;
	columns.set([...colArray]);
	saveColumnsToStorage(colArray);
	showColumnEditModal.set(false);
}

export function handleColumnDelete(event: CustomEvent<string>): void {
	const columnId = event.detail;
	const colArray = get(columns).filter((column) => column.id !== columnId);
	columns.set([...colArray]);
	saveColumnsToStorage(colArray);
	showColumnEditModal.set(false);
}
