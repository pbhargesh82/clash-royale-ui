<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { fetchClansData } from '../api/index';
	import MdiSearch from '~icons/mdi/search';

	let clanData: any = {};
	let searchQuery: string | null = null;

	$: searchQuery = get(page).url.searchParams.get('search') || 'Q0LYGRYC'; // Q0LYGRYC

	onMount(async () => {
		if (searchQuery) {
			await fetchClanData();
		}
	});

	function handleImageLoadingError(event: Event, card: App.TroopCard | App.TowerCard) {
		const img = event.target as HTMLImageElement;
		if (img.src !== card?.iconUrls?.medium) {
			img.src = card?.iconUrls?.medium;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		await fetchClanData();
	}

	async function fetchClanData() {
		if (searchQuery) {
			clanData = await fetchClansData(searchQuery);
			console.log(clanData);
		}
	}

	// async function fetchPlayerData() {
	// 	if (searchQuery) {
	// 		playerData = await fetchPlayersData(searchQuery.toUpperCase());
	// 		playerBattleLogData = await fetchPlayersBattleLog(searchQuery.toUpperCase());
	// 		playerChestsData = await fetchPlayersUpcomingChests(searchQuery.toUpperCase());
	// 		playerData && (await calculateStats(playerData));
	// 	}
	// }
</script>

<div class="container mx-auto my-0">
	<form on:submit={handleSubmit} class="mb-2">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><MdiSearch /></div>
			<input type="search" placeholder="Player tag, e.g. Q0LYGRYC" bind:value={searchQuery} />
			<button class="variant-filled-secondary" type="submit">Submit</button>
		</div>
	</form>

	{#if clanData}
		{clanData?.name}
	{/if}
</div>
