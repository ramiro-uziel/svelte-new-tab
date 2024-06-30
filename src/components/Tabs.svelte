<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function reload() {
		dispatch('reload');
	}

	function ready() {
		dispatch('ready');
	}

	export let items: any[] = [];
	export let activeTabValue = 1;

	const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul
	class="flex flex-row justify-between items-center mb-7 p-2 gap-1 border rounded-xl border-[#444444] border-dashed text-white"
>
	{#each items as item}
		<li class="mb-[-1px]">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span
				class={`block p-2 px-3 w-auto cursor-pointer select-none border rounded-lg duration-75 active:scale-[97%]  ${activeTabValue === item.value ? 'text-[#fdf6e3] border-[#a7a7a7] bg-[#44444438] ' : 'border-transparent hover:text-light-blue hover:border-[#444444] '}`}
				on:click={handleClick(item.value)}
			>
				<i class={`mr-1 text-sm ${item.icon}`} />
				{item.label}
			</span>
		</li>
	{/each}
	<li class="mb-[-1px]">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span
			class={`block p-2 px-4 w-auto cursor-pointer select-none border border-transparent rounded-lg duration-100 active:translate-y-[1px] hover:text-light-blue`}
			on:click={close}
		>
			<slot name="close"></slot>
		</span>
	</li>
</ul>
{#each items as item}
	{#if activeTabValue == item.value}
		<div class="mb-2 border-gray-300 rounded-b">
			<svelte:component this={item.component} on:reload={reload} on:ready={ready} />
		</div>
	{/if}
{/each}
