// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}

	interface Card {
		items: TroopCard[];
		supportItems: TowerCard[];
	}

	interface SortingOptions {
		name: string;
		key: string;
	}

	interface TroopCard {
		name: string;
		id: number;
		maxLevel: number;
		maxEvolutionLevel: number;
		elixirCost: number;
		iconUrls: {
			medium: string;
			evolutionMedium: string;
		};
		rarity: string;
	}

	interface TowerCard {
		name: string;
		id: number;
		maxLevel: number;
		iconUrls: {
			medium: string;
		};
		rarity: string;
	}
}
