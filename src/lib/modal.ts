/* Handling of menus/modals */

import { writable, derived, get } from 'svelte/store';
import { currentItem, currentColumn } from './items_columns';

export const showStartupModal = writable(false);
export const showSettingsModal = writable(false);
export const showItemEditModal = writable(false);
export const showColumnEditModal = writable(false);
export const showSearchModal = writable(false);
export const dragDisabled = writable(true);

export const anyModalVisible = derived(
	[showStartupModal, showSettingsModal, showItemEditModal, showColumnEditModal],
	([$startupModal, $settingsModal, $showItemEditModal, $showColumnEditModal]) =>
		$startupModal || $settingsModal || $showItemEditModal || $showColumnEditModal
);

export function toggleSettings() {
	showSettingsModal.update((value) => !value);
}

export function toggleSearch() {
	if (!get(anyModalVisible) && get(dragDisabled)) {
		showSearchModal.update((value) => !value);
	}
}
export function toggleStartup() {
	showStartupModal.update((value) => !value);
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
