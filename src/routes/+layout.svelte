<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';

	type Route = {
		name: string;
		path: string;
	};

	// Define routes
	const routes: Route[] = [
		{ name: 'Home', path: '/' },
		{ name: 'Cards', path: '/cards' },
		{ name: 'Players', path: '/players' },
		{ name: 'Clans', path: '/clans' }
	];

	// Function to navigate to a route
	function navigateTo(route: Route) {
		goto(route.path);
	}
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Clash</strong>
			</svelte:fragment>
			<svelte:fragment slot="default"></svelte:fragment>
			<svelte:fragment slot="trail"></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<!-- (sidebarRight) -->
	<svelte:fragment slot="pageHeader">
		<AppBar>
			<svelte:fragment slot="lead"></svelte:fragment>
			<svelte:fragment slot="default">
				<nav>
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
				</nav>
			</svelte:fragment>
			<svelte:fragment slot="trail"></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
