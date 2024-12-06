<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fetchPlayersBattleLog, fetchPlayersData, fetchPlayersUpcomingChests } from '../api';
	import { get } from 'svelte/store';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import MdiSearch from '~icons/mdi/search';
	import MdiHomeOutline from '~icons/mdi/home-outline';
	import MdiContentCopy from '~icons/mdi/content-copy';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import MdiShareAll from '~icons/mdi/share-all';
	import { goto } from '$app/navigation';

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};

	let playerData: any = null;
	let playerChestsData: any = null;
	let playerBattleLogData: any = null;
	let searchQuery: string | null = null;
	let tabSet: number = 0;

	let draws: number = 0;
	let winPercentage: number = 0;
	let lossPercentage: number = 0;
	let drawPercentage: number = 0;
	let threeCrownWinPercentage: number = 0;

	$: searchQuery = get(page).url.searchParams.get('search'); // YJ9CVC9UJ // UQJQYQR

	onMount(async () => {
		if (searchQuery) {
			try {
				await fetchPlayerData();
			} catch (error) {
				console.error(error);
			}
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
		await fetchPlayerData();
	}

	async function fetchPlayerData() {
		if (searchQuery) {
			playerData = await fetchPlayersData(searchQuery.toUpperCase());
			playerBattleLogData = await fetchPlayersBattleLog(searchQuery.toUpperCase());
			playerChestsData = await fetchPlayersUpcomingChests(searchQuery.toUpperCase());
			playerData && (await calculateStats(playerData));
		}
	}

	function calculateAverageDeckCosts(deck: any) {
		const elixirCosts = deck
			.filter((card: any) => card.id !== 28000006)
			.map((card: any) => card.elixirCost);

		const nonMirrorAvgCost =
			elixirCosts.reduce((acc: number, card: number) => acc + card, 0) / elixirCosts.length;

		if (deck.some((card: any) => card.id === 28000006)) {
			elixirCosts.push(nonMirrorAvgCost - 1);
		}

		const avgCost =
			elixirCosts.reduce((acc: number, card: number) => acc + card, 0) / elixirCosts.length;
		return Number(avgCost.toFixed(1));
	}

	function calculateFourCardCycle(deck: any) {
		const elixirCosts = deck.map((card: App.TroopCard) => card.elixirCost);
		elixirCosts.sort((a: number, b: number) => a - b);
		return elixirCosts.slice(0, 4).reduce((acc: number, cost: number) => acc + cost, 0);
	}

	function calculateStats(playerData: any) {
		const { battleCount, wins, losses, threeCrownWins } = playerData;

		draws = battleCount - wins - losses;
		const totalMatches = wins + losses;

		winPercentage = Number(((wins / totalMatches) * 100).toFixed(2));
		lossPercentage = Number(((losses / totalMatches) * 100).toFixed(2));
		drawPercentage = Number(((draws / battleCount) * 100).toFixed(2));
		threeCrownWinPercentage = Number(((threeCrownWins / totalMatches) * 100).toFixed(2));
	}

	function shareDeck(deck: any) {
		if (deck.length === 8) {
			const cardIds = deck.map((card: App.TroopCard) => card.id);
			const link = `https://link.clashroyale.com/deck/en/?deck=${cardIds.join(';')}`;
			window.open(link, '_blank');
		}
	}

	function copyToClipboard() {
		const textToCopy = playerData?.tag;
		if (textToCopy) {
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					console.log('Text copied to clipboard');
					// Optionally, you can add feedback for the user here
				})
				.catch((err) => {
					console.error('Failed to copy text: ', err);
				});
		}
	}

	function goToClan(tag: string) {
		tag = tag.slice(1);
		console.log(tag);
		goto(`/clans?search=${encodeURIComponent(tag)}`);
	}
</script>

<div class="container mx-auto my-0">
	<form on:submit={handleSubmit} class="mb-2">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><MdiSearch /></div>
			<input type="search" placeholder="Player tag, e.g. UQJQYQR" bind:value={searchQuery} />
			<button class="variant-filled-secondary" type="submit">Submit</button>
		</div>
	</form>

	{#if playerData}
		<TabGroup>
			<Tab bind:group={tabSet} name="playerHome" value={0}>
				<MdiHomeOutline />
			</Tab>
			<Tab bind:group={tabSet} name="battleLog" value={1}>Battle</Tab>
			<Tab bind:group={tabSet} name="cards" value={2}>Cards</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					{#if playerData}
						<div
							class="card container p-2 mb-2 flex flex-col gap-2 lg:flex-row lg:gap-4 lg:items-center"
						>
							<div class="relative flex items-center gap-2">
								<img class="h-14" src="/level.png" alt="player level" />
								<p class="text-2xl font-bold absolute left-[14px] top-[15px]">
									{playerData?.expLevel}
								</p>
								<div class="flex flex-col gap-2">
									<p class="text-3xl">{playerData?.name}</p>
									<button class="text-md flex items-center gap-2" on:click={copyToClipboard}>
										{playerData?.tag}
										<MdiContentCopy class="inline	" />
									</button>
								</div>
							</div>
							<div class="flex gap-2 items-center flex-wrap lg:flex-col lg:items-start">
								<div class="flex gap-2 items-center">
									<img class="h-6" src="/trophy.png" alt="trophy" />
									<p>{playerData?.trophies} / {playerData?.bestTrophies}</p>
									<!-- <img class="h-4" src="/arena.png" alt="arena" /> -->
									<p>{playerData?.arena?.name}</p>
								</div>
								<div class="flex gap-2 items-center">
									<img class="h-6" src="/goblin-trophy.png" alt="goblin-trophy" />
									<p>
										{playerData?.progress?.['goblin-road']?.trophies} / {playerData?.progress?.[
											'goblin-road'
										]?.bestTrophies}
									</p>
									<!-- <img class="h-4" src="/arena.png" alt="arena" /> -->
									<p>{playerData?.progress?.['goblin-road']?.arena?.name}</p>
								</div>
							</div>
							{#if playerData.clan}
								<button
									class="flex gap-2 items-center"
									on:click={() => goToClan(playerData?.clan?.tag)}
								>
									<img class="h-8" src="/social.png" alt="social" />
									<p>{playerData?.clan?.name} | {playerData?.role}</p>
								</button>
							{/if}
						</div>

						<!-- <p>Achievement Badges</p>
					{#if playerData?.achievements}
						<div class="container p-2 flex flex-wrap gap-2 border-2 rounded">
							{#each playerData?.achievements as achievement}
								<p>{achievement?.name}</p>
							{/each}
						</div>
					{/if} -->

						<div class="flex flex-wrap gap-2 variant-glass-primary rounded">
							{#if playerData?.currentDeck}
								<div class="p-2 flex flex-wrap flex-col gap-2">
									<p class="text-center text-xl">Current Battle Deck</p>
									<div class="flex flex-wrap gap-2 justify-between">
										{#each playerData?.currentDeck as card}
											<img
												class="h-28 object-contain"
												src={card?.iconUrls?.evolutionMedium
													? card?.iconUrls?.evolutionMedium
													: card?.iconUrls?.medium}
												alt={card?.name}
												on:error={(event) => handleImageLoadingError(event, card)}
											/>
										{/each}
									</div>
									<div class="flex gap-4">
										<div class="flex items-center gap-2" title="Average Deck Cost">
											<img class="h-4" src="/elixir-drop.png" alt="elixir cost" />
											<p>{calculateAverageDeckCosts(playerData?.currentDeck)}</p>
										</div>
										<div class="flex items-center gap-2" title="4-Card Cycle	">
											<img class="h-4" src="/elixir-cycle.png" alt="elixir cost cycle" />
											<p>{calculateFourCardCycle(playerData?.currentDeck)}</p>
										</div>
									</div>
								</div>
							{/if}

							<div class="p-2 flex flex-col gap-2">
								<p>Tower Card</p>
								{#if playerData?.currentDeckSupportCards}
									{#each playerData?.currentDeckSupportCards as card}
										<img
											class="h-28 object-contain"
											src={card?.iconUrls?.evolutionMedium
												? card?.iconUrls?.evolutionMedium
												: card?.iconUrls?.medium}
											alt={card?.name}
											on:error={(event) => handleImageLoadingError(event, card)}
										/>
									{/each}
								{/if}
							</div>
							<div class="p-2 flex flex-col gap-2">
								<p>Favourite Card</p>
								<img
									class="h-28 object-contain"
									src={playerData?.currentFavouriteCard?.iconUrls?.evolutionMedium
										? playerData?.currentFavouriteCard?.iconUrls?.evolutionMedium
										: playerData?.currentFavouriteCard?.iconUrls?.medium}
									alt={playerData?.currentFavouriteCard?.name}
									on:error={(event) =>
										handleImageLoadingError(event, playerData?.currentFavouriteCard)}
								/>
							</div>
						</div>

						{#if playerChestsData}
							<div class="py-4">
								<p>Upcoming Chests</p>
								<div
									class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-2"
								>
									{#each playerChestsData?.items as chest}
										<div class="flex flex-col w-14 items-center relative" title={chest?.name}>
											<img
												class="h-12 min-w-12 object-cover"
												src="/chests/{chest?.name}.png"
												alt={chest?.name}
											/>
											{#if chest?.index > 0}
												<p
													class="badge-icon variant-glass-primary absolute top-0 right-0 rounded-full"
												>
													{chest?.index}
												</p>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<div class="p-2 flex flex-col gap-2 lg:flex-row">
							<div class="p-2 flex flex-col gap-2 lg:flex-1">
								<div class="flex gap-2 justify-between">
									<p class="text-2xl font-medium">Battle Stats</p>
									<img class="h-8" src="/battle.png" alt="battle" />
								</div>
								<div class="flex gap-2 justify-between">
									<p>Trophies</p>
									<p>{playerData?.trophies} / {playerData?.bestTrophies}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Total games</p>
									<p>{playerData?.battleCount}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Wins</p>
									<p class="text-green-500">{playerData?.wins} ({winPercentage}%)</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Three crown wins</p>
									<p class="text-cyan-500">
										{playerData?.threeCrownWins} ({threeCrownWinPercentage}%)
									</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Losses</p>
									<p class="text-red-500">{playerData?.losses} ({lossPercentage}%)</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>1v1 Draws</p>
									<p>{draws} ({drawPercentage}%)</p>
								</div>
							</div>
							<div class="p-2 flex flex-col gap-2 lg:flex-1">
								<div class="flex gap-2 justify-between">
									<p class="text-2xl font-medium">Path Of Legend Stats</p>
									<img class="h-8" src="/rank.png" alt="rank" />
								</div>
								<div class="flex gap-2 justify-between">
									<p>Current seaosn rank</p>
									<p>League {playerData?.currentPathOfLegendSeasonResult?.leagueNumber}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Best seaosn rank</p>
									<p>League {playerData?.bestPathOfLegendSeasonResult?.leagueNumber}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Last seaosn rank</p>
									<p>League {playerData?.lastPathOfLegendSeasonResult?.leagueNumber}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Best legacy trophy score</p>
									<p>{playerData?.legacyTrophyRoadHighScore}</p>
								</div>
							</div>
							<div class="p-2 flex flex-col gap-2 lg:flex-1">
								<div class="flex gap-2 justify-between">
									<p class="text-2xl font-medium">Misc Stats</p>
									<img class="h-8" src="/cards.png" alt="cards" />
								</div>
								<div class="flex gap-2 justify-between">
									<p>Experience</p>
									<p>Level {playerData?.expLevel}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Arena</p>
									<p>{playerData?.arena?.name}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Cards found</p>
									<p>{playerData?.cards.length} / 114</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Donations</p>
									<p class="text-green-500">{playerData?.donations}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Donations received</p>
									<p class="text-cyan-500">{playerData?.donationsReceived}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Total donations</p>
									<p class="text-green-500">{playerData?.totalDonations}</p>
								</div>
								<hr />
								<div class="flex gap-2 justify-between">
									<p>Star points</p>
									<p>{playerData?.starPoints}</p>
								</div>
							</div>
						</div>
					{/if}
				{:else if tabSet === 1}
					{#if playerBattleLogData?.length > 0}
						<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
							{#each playerBattleLogData as battleData}
								{#if battleData.type !== 'boatBattle'}
									<div
										class="p-2 border-2 rounded"
										class:border-cyan-600={battleData.team[0]?.crowns >
											battleData.opponent[0]?.crowns}
										class:border-red-600={battleData.team[0]?.crowns <
											battleData.opponent[0]?.crowns}
									>
										<!-- <div class="flex gap- 2">
											<p>{battleData?.type}</p>
											<p>{battleData?.gameMode?.name}</p>
											<p>{battleData?.battleTime}</p>
										</div> -->
										<div class="h-12 relative flex gap-2 items-center justify-center font-medium">
											{#if battleData.team[0]?.crowns > battleData.opponent[0]?.crowns}
												<p class="bg-cyan-600 py-1 px-2 absolute left-0 rounded">Victory</p>
											{:else}
												<p class="bg-red-600 py-1 px-2 absolute left-0 rounded">Defeat</p>
											{/if}
											<img class="h-4" src="/crown-blue.png" alt="victory" />
											<p class="text-xl font-semibold">
												{battleData?.team[0]?.crowns} - {battleData?.opponent[0]?.crowns}
											</p>
											<img class="h-4" src="/crown-red.png" alt="defeat" />
										</div>
										<div class="flex gap-2">
											<div class="text-center flex flex-col gap-1 flex-1">
												{#each battleData?.team as team}
													<!-- <div class="team-info text-center"> -->
													<p class="font-bold">{team?.name}</p>
													<p class="text-cyan-600">{team?.clan?.name || 'No clan'}</p>
													<div class="flex items-center gap-2 justify-center">
														<img class="h-4" src="/trophy.png" alt="trophy" />
														<p>{team?.startingTrophies || 0}</p>
													</div>
													<div
														class="grid grid-cols-4 grid-rows-2 justify-items-center items-center"
													>
														{#each team?.cards as card}
															<img
																class="h-14 object-contain"
																src={card?.iconUrls?.evolutionMedium
																	? card?.iconUrls?.evolutionMedium
																	: card?.iconUrls?.medium}
																alt={card?.name}
																on:error={(event) => handleImageLoadingError(event, card)}
															/>
														{/each}
													</div>
													<div class="flex gap-2 items-center">
														{#if battleData?.type !== 'riverRacePvP'}
															{#each team?.supportCards as card}
																<img
																	class="h-10 object-contain"
																	src={card?.iconUrls?.medium}
																	alt={card?.name}
																	on:error={(event) => handleImageLoadingError(event, card)}
																/>
															{/each}
														{:else}
															<img class="h-10 object-contain" src="/princess.png" alt="princess" />
														{/if}
														<div class="flex items-center gap-1" title="4-Card Cycle">
															<img class="h-4" src="/elixir-leaked.png" alt="elixir leaked" />
															<p>{team?.elixirLeaked}</p>
														</div>
														<div class="flex items-center gap-1" title="Average Deck Cost">
															<img class="h-4" src="/elixir-drop.png" alt="elixir drop" />
															<p>{calculateAverageDeckCosts(team?.cards)}</p>
														</div>
														<button
															class="ml-auto flex gap-2 items-center px-2"
															title="Copy Deck"
															on:click={() => shareDeck(team?.cards)}
														>
															<MdiShareAll />
														</button>
													</div>
												{/each}
											</div>
											<!-- <span class="divider-vertical h-auto" /> -->
											<div class="text-center flex flex-col gap-1 flex-1">
												{#each battleData?.opponent as opponent}
													<!-- <div class="team-info text-center"> -->
													<p class="font-bold">{opponent?.name}</p>
													<p class="text-red-600">{opponent?.clan?.name || 'No clan'}</p>
													<div class="flex items-center gap-2 justify-center">
														<img class="h-4" src="/trophy.png" alt="trophy" />
														<p>{opponent?.startingTrophies || 0}</p>
													</div>
													<div
														class="grid grid-cols-4 grid-rows-2 justify-items-center items-center"
													>
														{#each opponent?.cards as card}
															<img
																class="h-14 object-contain"
																src={card?.iconUrls?.evolutionMedium
																	? card?.iconUrls?.evolutionMedium
																	: card?.iconUrls?.medium}
																alt={card?.name}
																on:error={(event) => handleImageLoadingError(event, card)}
															/>
														{/each}
														<!-- <div class="flex items-center gap-1">
														<img class="h-4" src="/elixir-cycle.png" alt="elixir cycle" />
														<p>{calculateFourCardCycle(opponent?.cards)}</p>
													</div> -->
													</div>
													<div class="flex gap-2 items-center">
														{#if battleData?.type !== 'riverRacePvP'}
															{#each opponent?.supportCards as card}
																<img
																	class="h-10 object-contain"
																	src={card?.iconUrls?.medium}
																	alt={card?.name}
																	on:error={(event) => handleImageLoadingError(event, card)}
																/>
															{/each}
														{:else}
															<img class="h-10 object-contain" src="/princess.png" alt="princess" />
														{/if}
														<div class="flex items-center gap-1" title="4-Card Cycle">
															<img class="h-4" src="/elixir-leaked.png" alt="elixir leaked" />
															<p>{opponent?.elixirLeaked}</p>
														</div>
														<div class="flex items-center gap-1" title="Average Deck Cost">
															<img class="h-4" src="/elixir-drop.png" alt="elixir drop" />
															<p>{calculateAverageDeckCosts(opponent?.cards)}</p>
														</div>
														<button
															class="ml-auto flex gap-2 items-center px-2"
															title="Copy Deck"
															on:click={() => shareDeck(opponent?.cards)}
														>
															<MdiShareAll />
														</button>
													</div>
												{/each}
											</div>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					{:else}
						<h1 class="grid place-items-center">No battles found recently.</h1>
					{/if}
				{:else if tabSet === 2}
					{#if playerData?.cards}
						<div class="grid custom-grid-columns gap-1">
							{#each playerData?.cards as card}
								<div class="card p-2 text-center variant-ghost relative hover:brightness-125">
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
									<!-- <p>{card?.name}</p>
								<p>{card?.rarity}</p>
								<p>{card?.count}</p>
								<p>{card?.level}</p>
								<p>{card?.maxLevel}</p> -->
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</svelte:fragment>
		</TabGroup>
	{/if}
</div>

<!-- {#if searchQuery}
	<p>Searching for player: {searchQuery.toUpperCase()}</p>
{/if} -->

<!-- <pre>{JSON.stringify(playerChestsData, null, 2)}</pre> -->
<style>
	.custom-grid-columns {
		grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
	}
</style>
