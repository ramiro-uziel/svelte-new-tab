import { writable, derived, get } from 'svelte/store';
import { currentItem, currentColumn } from './columns';

export const startupModal = writable(false);
export const settingsModal = writable(false);
export const showItemEditModal = writable(false);
export const showColumnEditModal = writable(false);
export const searchModal = writable(false);
export const dragDisabled = writable(true);

export const anyModalVisible = derived(
	[startupModal, settingsModal, showItemEditModal, showColumnEditModal],
	([$startupModal, $settingsModal, $showItemEditModal, $showColumnEditModal]) =>
		$startupModal || $settingsModal || $showItemEditModal || $showColumnEditModal
);

export function toggleSettings() {
	settingsModal.update((value) => !value);
}

export function toggleSearch() {
	if (!get(anyModalVisible) && get(dragDisabled)) {
		searchModal.update((value) => !value);
	}
}
export function toggleStartup() {
	startupModal.update((value) => !value);
	isReady.set(true);
}

export function openItemModal(item: { id: string; text: string; icon: string; url: string }): void {
	currentItem.set(item);
	showItemEditModal.set(true);
}

export function openColumnModal(column: {
	id: any;
	text: string;
	icon: string;
	color: string;
	items: { id: string; text: string; icon: string; url: string }[];
}): void {
	currentColumn.set(column);
	showColumnEditModal.set(true);
}

export function handleCancel(): void {
	showItemEditModal.set(false);
	showColumnEditModal.set(false);
}

export const isReady = writable(false);
