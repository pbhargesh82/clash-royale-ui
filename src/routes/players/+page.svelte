<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchPlayersData } from '../api';
	// import { fetchPlayersData } from '../api';

	let playerData: any = {};

	onMount(async () => {
		try {
			playerData = await fetchPlayersData('UQJQYQR');
		} catch (error) {
			console.error(error);
		}
	});
</script>

<h1>Player</h1>

<pre>{JSON.stringify(playerData, null, 2)}</pre>
