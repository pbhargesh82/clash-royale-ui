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
	<div class="container mx-auto px-4 py-8 max-w-4xl text-center">
		<!-- Welcome Section -->
		<h1 class="text-4xl md:text-5xl font-bold mb-6">Welcome to Clash Spy!</h1>
		<p class="text-lg md:text-xl mb-8">
			Your go-to app for viewing Clash Royale player profiles, clans, cards, and more. Just enter
			your player code to get started!
		</p>

		<!-- Features Section -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Feature 1 -->
			<div class="p-6 bg-white rounded-lg shadow-md">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">Player Profiles</h2>
				<p class="text-gray-600">
					View detailed profiles of any Clash Royale player using their unique code.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="p-6 bg-white rounded-lg shadow-md">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">Clan Information</h2>
				<p class="text-gray-600">
					Explore clans, find your clan's details, and view other members.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="p-6 bg-white rounded-lg shadow-md">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">Card Search</h2>
				<p class="text-gray-600">
					Search for cards, check their stats, and discover the best card combinations.
				</p>
			</div>

			<!-- Feature 4 -->
			<div class="p-6 bg-white rounded-lg shadow-md">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">More Updates</h2>
				<p class="text-gray-600">
					Stay tuned for more updates, features, and guides to improve your game!
				</p>
			</div>
		</div>

		<!-- Call to Action -->
		<!-- <div class="mt-10">
			<a
				href="/profile"
				class="inline-block bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
			>
				Enter Player Code
			</a>
		</div> -->
	</div>
</div>
