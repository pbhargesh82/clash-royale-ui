<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchClansData } from '../api/index';

	let clanData: any = {};

	onMount(async () => {
		try {
			clanData = await fetchClansData('Q0LYGRYC');
		} catch (error) {
			console.error(error);
		}
	});
</script>

<h1>Clan</h1>

<pre>{JSON.stringify(clanData, null, 2)}</pre>
