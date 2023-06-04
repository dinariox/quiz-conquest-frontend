<script lang="ts">
	import { browser } from '$app/environment';
	import type { Category } from '$lib/types';
	import Logo from '../../components/Logo.svelte';
	import Preparation from '../../components/Preparation.svelte';
</script>

<svelte:head>
	<title>Quiz Conquest - MODERATOR</title>
</svelte:head>
<main class="center">
	<Logo isModerator={true} />

	<Preparation />
</main>

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
