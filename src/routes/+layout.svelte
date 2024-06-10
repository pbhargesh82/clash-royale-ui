<script lang="ts">
	import '../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	const routes: App.Route[] = [
		{ name: 'Home', path: '/' },
		{ name: 'Cards', path: '/cards' },
		{ name: 'Players', path: '/players' },
		{ name: 'Clans', path: '/clans' }
	];

	function navigateTo(route: App.Route) {
		goto(route.path);
	}
</script>

<div class="flex flex-col h-[100dvh]">
	<header class="flex flex-col">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Clash</strong>
			</svelte:fragment>
			<svelte:fragment slot="default"></svelte:fragment>
			<svelte:fragment slot="trail"></svelte:fragment>
			<svelte:fragment slot="headline"
				><nav class="flex space-x-4">
					{#each routes as route}
						<a
							href={route.path}
							on:click={() => navigateTo(route)}
							class="btn btn-sm variant-ghost-surface"
							rel="noreferrer"
						>
							{route.name}
						</a>
					{/each}
				</nav></svelte:fragment
			>
		</AppBar>
	</header>

	<main class="flex-1 overflow-y-auto p-2">
		<slot />
	</main>

	<footer class="p-4 text-center">
		<p>Made with ❤️ by Bhargesh Patel</p>
	</footer>
</div>
