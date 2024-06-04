<script lang="ts">
	import Boop from "./Boop.svelte"
	let links: { url: string; logo: string }[] = [
		/*
		{ url: '', logo: 'fa-brands fa-twitter' }
		{ url: '', logo: 'fa-brands fa-github' }
		*/
	];
</script>

<div class="flex flex-row w-full mt-[120px]">
	<div class="text-white text-md flex flex-col gap-4 selection:bg-[#39756d] w-60">
		<div class="flex flex-col gap-2">
			Ko-fi
			<Boop>
			</Boop>
		</div>
	</div>
	<div
		class="text-white text-md flex flex-col gap-1 mt-7 selection:bg-[#39756d] justify-center items-center flex-1 mb-10"
	>
		<span class="text-white flex text-3xl">new-tab</span>
		<span class="text-white flex text-lg">made by rm</span>
		<div class="flex flex-row gap-3 mt-3">
			{#each links as link}
				<a href={link.url} target="_blank"
					><i
						class={`hover:text-light-blue duration-100 border border-[#464646] hover:bg-[#ffffff28] rounded-lg p-4 text-base w-15 h-5 flex items-center justify-center ${link.logo}`}
					></i>
				</a>
			{/each}
		</div>
	</div>
</div>
