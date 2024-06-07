<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchCardsData } from '../api';

	let cards: App.Card;
	let troopCards: App.TroopCard[] = [];
	let towerCards: App.TowerCard[] = [];
	let allTroopCards: App.TroopCard[] = [];

	let costs: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
	let selectedCost: number | null = null;
	let rarities: string[] = ['common', 'rare', 'epic', 'legendary', 'champion'];
	let selectedRarity: string | null = null;
	let cardSortingOptions: App.SortingOptions[] = [
		{ name: 'Default', key: 'default' },
		{ name: 'Name', key: 'name' },
		{ name: 'Elixir Cost', key: 'elixirCost' },
		{ name: 'Rarity', key: 'rarity' }
	];
	let currentSortingIndex = 0;
	let ascending = true;

	onMount(async () => {
		try {
			cards = await fetchCardsData();
			console.log(cards);
			troopCards = await cards?.items;
			console.log(troopCards);
			allTroopCards = troopCards;
			console.log(allTroopCards);
			towerCards = await cards?.supportItems;
			console.log(towerCards);
			sortCards('default');
		} catch (error) {
			console.error(error);
		}
	});

	function filterCards() {
		troopCards = allTroopCards.filter((card) => {
			return (
				(selectedCost === null || card?.elixirCost === selectedCost) &&
				(selectedRarity === null || card?.rarity === selectedRarity)
			);
		});
	}

	function filterCardsByElixirCost(cost: number) {
		selectedCost = cost;
		filterCards();
	}

	function filterCardsByRarity(rarity: string) {
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

<div class="container p-4">
	<h1>Cards</h1>

	<!-- <pre>{JSON.stringify(cards, null, 2)}</pre> -->
	<div>
		{#each costs as cost}
			<button
				on:click={() => filterCardsByElixirCost(cost)}
				class:variant-ringed-primary={cost === selectedCost}
				type="button"
				class="btn btn-sm variant-ringed"
			>
				{cost}
			</button>
		{/each}
	</div>

	<div>
		{#each rarities as rarity}
			<button
				on:click={() => filterCardsByRarity(rarity)}
				class:variant-ringed-primary={rarity === selectedRarity}
				type="button"
				class="btn btn-sm variant-ringed"
			>
				{rarity}
			</button>
		{/each}
	</div>

	<button on:click={handleSortingClick} type="button" class="btn btn-sm variant-ringed">
		{cardSortingOptions[currentSortingIndex].name}
	</button>

	<button on:click={handleSortingTypeClick} type="button" class="btn btn-sm variant-ringed">
		{ascending ? 'Ascending' : 'Descending'} Order
	</button>

	<button on:click={() => resetFilters()} type="button" class="btn btn-sm variant-ringed">
		Reset Filters
	</button>

	<div>Showing cards: {troopCards.length}</div>
	<div class="grid grid-cols-3 gap-1">
		{#each troopCards as card}
			<div class="card p-2 w-32 variant-ghost relative hover:brightness-125">
				<p class="text-xl font-bold absolute top-9 left-3 z-[1]">
					{card?.elixirCost ? card?.elixirCost : '?'}
				</p>
				<img class="h-8 absolute top-8 left-1" src="/elixirdrop.png" alt="elixir cost" />
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
	</div>
</div>

<!-- <style>
	.selected {
		background-color: blue;
		color: white;
	}

	.cardsContianer {
		max-width: 100dvw;
		padding: 1rem;

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		justify-items: center;
		gap: 1rem;
	}

	.cardInfo {
		position: relative;
		max-width: 10rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.elixirCost {
		position: absolute;
		left: 1px;
		top: 17px;
		z-index: 1;
		color: white;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.elixirCostIcon {
		height: 2.5rem;
		position: absolute;
		left: -0.5rem;
		top: 1.5rem;
	}

	.cardImage {
		height: 10rem;
	}
</style> -->
