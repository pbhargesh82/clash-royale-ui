<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchCardsData } from '../api';
	import MdiTriangleSmallUp from '~icons/mdi/triangle-small-up';

	let cards: App.Card;
	let troopCards: App.TroopCard[] = [];
	let towerCards: App.TowerCard[] = [];
	let allTroopCards: App.TroopCard[] = [];

	let costs: number[] = Array.from({ length: 9 }, (_, i) => i + 1);
	let selectedCost: number | null = null;
	let rarities: string[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Champion'];
	let selectedRarity: string | null = null;
	let cardSortingOptions: App.SortingOptions[] = [
		// { name: 'Default', key: 'default' },
		{ name: 'Name', key: 'name' },
		{ name: 'Elixir Cost', key: 'elixirCost' },
		{ name: 'Rarity', key: 'rarity' }
	];
	let currentSortingIndex = 0;
	let ascending = true;

	onMount(async () => {
		try {
			cards = await fetchCardsData();
			// console.log(cards);
			troopCards = await cards?.items;
			// console.log(troopCards);
			allTroopCards = troopCards;
			// console.log(allTroopCards);
			towerCards = await cards?.supportItems;
			// console.log(towerCards);
			sortCards('default');
		} catch (error) {
			console.error(error);
		}
	});

	function filterCards() {
		troopCards = allTroopCards.filter((card) => {
			return (
				(selectedCost === null || card?.elixirCost === selectedCost) &&
				(selectedRarity === null || card?.rarity === selectedRarity.toLowerCase())
			);
		});
	}

	function filterCardsByElixirCost(event: Event) {
		const cost: number = Number((event.target as HTMLSelectElement).value);
		selectedCost = cost;
		filterCards();
	}

	function filterCardsByRarity(event: Event) {
		const rarity: string = (event.target as HTMLSelectElement).value;
		selectedRarity = rarity;
		filterCards();
	}

	function resetFilters() {
		selectedCost = null;
		selectedRarity = null;
		troopCards = allTroopCards;
	}

	function handleImageLoadingError(event: Event, card: App.TroopCard | App.TowerCard) {
		const img = event.target as HTMLImageElement;
		if (img.src !== card?.iconUrls?.medium) {
			img.src = card?.iconUrls?.medium;
		}
	}

	function handleSortingClick() {
		currentSortingIndex = (currentSortingIndex + 1) % cardSortingOptions.length;
		sortCards(cardSortingOptions[currentSortingIndex].key);
	}

	function handleSortingTypeClick() {
		ascending = !ascending;
		sortCards(cardSortingOptions[currentSortingIndex].key);
	}

	function sortCards(key: string) {
		console.log(`Sorting by ${key} ${ascending ? 'ascending' : 'descending'}`);
		let sortedCards = [...troopCards];
		switch (key) {
			case 'name':
				sortedCards.sort((a, b) => (ascending ? 1 : -1) * a.name.localeCompare(b.name));
				break;
			case 'elixirCost':
				sortedCards.sort((a, b) => (ascending ? 1 : -1) * (a.elixirCost - b.elixirCost));
				break;
			case 'rarity':
				sortedCards.sort((a, b) => (ascending ? 1 : -1) * a.rarity.localeCompare(b.rarity));
				break;
			default:
				sortedCards = [...allTroopCards];
				break;
		}
		troopCards = sortedCards;
	}
</script>

<div class="container p-2 flex flex-col gap-4 mx-auto my-0">
	<div class="flex gap-2 items-center flex-wrap">
		<span>Cost</span>
		<select
			bind:value={selectedCost}
			class="select w-1/3"
			on:change={(event) => {
				filterCardsByElixirCost(event);
			}}
		>
			{#each costs as cost}
				<option value={cost}>{cost}</option>
			{/each}
		</select>
		<span>Rarity</span>
		<select
			bind:value={selectedRarity}
			class="select w-1/3"
			on:change={(event) => {
				filterCardsByRarity(event);
			}}
		>
			{#each rarities as rarity}
				<option value={rarity}>{rarity}</option>
			{/each}
		</select>

		<button
			on:click={() => resetFilters()}
			type="button"
			class="btn btn-sm variant-ringed self-end ml-auto"
		>
			Reset Filters
		</button>
	</div>

	<div class="flex gap-2 items-center flex-wrap">
		<span>Showing {troopCards.length} cards</span>

		<div class="self-end ml-auto flex gap-2">
			<button on:click={handleSortingTypeClick} type="button" class="btn btn-sm variant-ringed p-0">
				{#if ascending}
					<MdiTriangleSmallUp class="h-8 w-8 ease-in-out" />
				{:else}
					<MdiTriangleSmallUp class="rotate-180 h-8 w-8 ease-in-out" />
				{/if}
			</button>
			<button on:click={handleSortingClick} type="button" class="btn btn-sm variant-ringed">
				{cardSortingOptions[currentSortingIndex].name}
			</button>
		</div>
	</div>

	<div class="grid custom-grid-columns gap-1 justify-items-center">
		{#if troopCards.length > 0}
			{#each troopCards as card}
				<div class="card p-2 variant-ghost relative hover:brightness-125">
					<p class="text-xl font-bold absolute top-9 left-3 z-[1]">
						{card?.elixirCost ? card?.elixirCost : '?'}
					</p>
					<img class="h-8 absolute top-8 left-1" src="/elixir-drop.png" alt="elixir cost" />
					<img
						class="h-40 object-contain"
						src={card?.iconUrls?.evolutionMedium
							? card?.iconUrls?.evolutionMedium
							: card?.iconUrls?.medium}
						alt={card?.name}
						on:error={(event) => handleImageLoadingError(event, card)}
					/>
					<p class="text-center">{card?.name}</p>
				</div>
			{/each}
		{:else}
			{#each costs as cost}
				<div class="placeholder animate-pulse min-h-40"></div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.custom-grid-columns {
		grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
	}
</style>
