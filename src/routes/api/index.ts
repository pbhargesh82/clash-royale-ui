// src/routes/api/index.ts

export interface Player {
	tag: string;
	name: string;
}

export interface Clan {
	tag: string;
	name: string;
}

export async function fetchCardsData(): Promise<App.Card> {
	const response = await fetch('/api/cards');
	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}
	return await response.json() as App.Card;
}

export async function fetchPlayersData(playerTag: string): Promise<Player> {
	const response = await fetch(`/api/players/%23${playerTag}`);
	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}
	return await response.json() as Player;
}

export async function fetchClansData(clanTag: string): Promise<Clan> {
	const response = await fetch(`/api/clans/%23${clanTag}`);
	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}
	return await response.json() as Clan;
}