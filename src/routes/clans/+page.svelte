<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { fetchClansData } from '../api/index';
	import { parseISO, format } from 'date-fns';
	import MdiSearch from '~icons/mdi/search';
	import MdiTriangleSmallUp from '~icons/mdi/triangle-small-up';
	import MdiEqual from '~icons/mdi/equal';
	import { goto } from '$app/navigation';

	let clanData: any = null;
	let searchQuery: string | null = null;

	$: searchQuery = get(page).url.searchParams.get('search'); // Q0LYGRYC

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
		console.log(searchQuery);
		if (searchQuery) {
			clanData = await fetchClansData(searchQuery.toUpperCase());
			console.log(clanData);
		}
	}

	function getRole(role: string) {
		switch (role) {
			case 'member':
				return 'Member';
			case 'coLeader':
				return 'Co-leader';
			case 'leader':
				return 'Leader';
			case 'elder':
				return 'Elder';
			default:
				return '';
		}
	}

	function getFormattedDate(dateString: string) {
		const date = parseISO(dateString);
		const date1 = format(date, 'do MMMM, yyyy');
		const date2 = format(date, 'h:mm:ss a');
		return `<p>${date1}</p><p>${date2}</p>`;
	}

	function goToPlayer(tag: string) {
		tag = tag.slice(1);
		console.log(tag);
		goto(`/players?search=${encodeURIComponent(tag)}`);
	}
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
		<div class="card container p-2 mb-2 flex flex-col">
			<div class="flex items-center justify-center gap-2">
				<div>
					<p class="text-2xl">{clanData?.name}</p>
					<p>{clanData?.tag}</p>
				</div>
			</div>
			<p class="p-2 text-center">{clanData?.description}</p>
			<div class="p-2 flex items-center justify-center gap-4">
				<div class="flex items-center gap-2" title="Members">
					<img class="h-10" src="/social.png" alt="social" />
					<p>{clanData?.members}</p>
				</div>
				<!-- <hr class="my-2" /> -->
				<div class="flex items-center gap-2" title="Clan Score">
					<img class="h-10" src="/trophy.png" alt="trophy" />
					<p>{clanData?.clanScore}</p>
				</div>
				<div class="flex items-center gap-2" title="Clan War Trophies">
					<img class="h-10" src="/cw-trophy.png" alt="cw-trophy" />
					<p>{clanData?.clanWarTrophies}</p>
				</div>
				<div class="flex items-center gap-2" title="Donations per week">
					<img class="h-10" src="/cards.png" alt="cards" />
					<p>{clanData?.donationsPerWeek}</p>
				</div>
			</div>
		</div>
		{#if clanData.memberList}
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th class="text-center">Rank</th>
							<th class="text-center">Name (Tag)</th>
							<!-- <th class="text-center">Tag</th> -->
							<th class="text-center">XP</th>
							<th class="text-center">Role</th>
							<th class="text-center">Trophies (Arena)</th>
							<!-- <th class="text-center">Arena</th> -->
							<th class="text-center">Donations</th>
							<th class="text-center">Donations Received</th>
							<th class="text-center">Last Seen</th>
						</tr>
					</thead>
					<tbody>
						{#each clanData?.memberList as member, i}
							<tr>
								<td class="flex items-center justify-evenly gap-2">
									<p>{member?.clanRank}</p>
									{#if member?.clanRank < member?.previousClanRank}
										<MdiTriangleSmallUp class="h-8 w-8 text-green-500" />
									{:else if member?.clanRank > member?.previousClanRank}
										<MdiTriangleSmallUp class="rotate-180 h-8 w-8 text-red-500" />
									{:else if member?.clanRank === member?.previousClanRank}
										<MdiEqual class="h-4 w-4" />
									{/if}
								</td>
								<td class="text-center">
									<button on:click={() => goToPlayer(member?.tag)}>
										<p class="text-md font-medium">{member?.name}</p>
										<p>{member?.tag}</p>
									</button>
								</td>
								<!-- <td>{member?.tag}</td> -->
								<td class="text-center">{member?.expLevel}</td>
								<td class="text-center">{getRole(member?.role)}</td>
								<td class="text-center">
									<p>{member?.trophies}</p>
									<p>{member?.arena?.name}</p>
								</td>
								<!-- <td class="text-center">{member?.arena?.name}</td> -->
								<td class="text-center text-green-500">{member?.donations}</td>
								<td class="text-center text-cyan-500">{member?.donationsReceived}</td>
								<!-- <td class="text-center">{getFormattedDate(member?.lastSeen)}</td> -->
								<td class="text-center">{@html getFormattedDate(member?.lastSeen)}</td>
							</tr>
						{/each}
					</tbody>
					<!-- <tfoot>
						<tr>
							<th colspan="3">Calculated Total Weight</th>
							<td>{totalWeight}</td>
						</tr>
					</tfoot> -->
				</table>
			</div>
		{/if}
	{/if}
</div>
