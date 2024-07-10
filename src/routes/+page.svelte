<script lang="ts">
	import { goto } from '$app/navigation';
	import MdiSearch from '~icons/mdi/search';

	let searchQuery = '';

	function handleSubmit(event: Event) {
		event.preventDefault();
		goto(`/players?search=${encodeURIComponent(searchQuery)}`);
	}
</script>

<div class="container p-2 mx-auto my-0">
	<!-- <h1 class="text-xl text-center">Welcome</h1> -->

	<!-- <form on:submit={handleSubmit}>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><MdiSearch /></div>
			<input type="search" placeholder="Player tag, e.g. UQJQYQR" bind:value={searchQuery} />
			<button class="variant-filled-secondary" type="submit">Submit</button>
		</div>
	</form> -->
</div>
