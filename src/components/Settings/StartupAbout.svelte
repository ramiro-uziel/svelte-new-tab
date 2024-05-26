<script lang="ts">
	let links: { url: string; logo: string }[] = [
		{ url: 'https://x.com/ie_beep', logo: 'fa-brands fa-twitter' },
		{ url: 'https://another-example.com', logo: 'fa-brands fa-github' }
	];
</script>

<div class="flex flex-row w-full">
	<div class="text-white text-md flex flex-col gap-4 selection:bg-[#39756d] w-60">
		<div class="flex flex-col gap-4">
			<span class="font-bold">Welcome!</span>
			<p>This is a customizable app to store and access links.</p>
			<div class="flex flex-row gap-2">
				<i
					class="fa-solid fa-info-circle text-sm mt-0.5 border-r px-2 border-[#ffffff81] text-[#ffffff81]"
				/>
				<p>Hover the cursor over these buttons in the page to reveal them.</p>
			</div>
			<div class="flex justify-between p-3 border border-1 rounded h-32 w-full mt-4">
				<div class="flex flex-row gap-2 align-middle items-start absolute">
					<i class="text-xs not-italic text-[#ffffff44]">Window</i>
				</div>

				<div class="flex flex-row gap-2 align-middle items-end">
					<i class="fa-solid fa-gear" />
					<i class="text-xs not-italic">Settings</i>
				</div>
				<div class="flex flex-row gap-2 align-middle items-end">
					<i class="text-xs not-italic">Editing mode</i>
					<i class="fa-solid fa-pencil" />
				</div>
			</div>
		</div>
	</div>
	<div
		class="text-white text-md flex flex-col gap-1 mt-7 selection:bg-[#39756d] justify-center items-center flex-1 mb-10"
	>
		<span class="text-white flex text-3xl">new-tab</span>
		<span class="text-white flex text-lg">made by ico</span>
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
