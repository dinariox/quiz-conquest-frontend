<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketInstance } from '../../lib/socket';

	let name = '';

	onMount(() => {
		socketInstance.socket.on('uniqueId', (uniqueId) => {
			localStorage.setItem('uniqueId', uniqueId);
			goto('/game');
		});
	});

	function join() {
		if (!name) {
			return;
		}

		socketInstance.socket.emit('join', { name });
	}
</script>

<svelte:head>
	<title>Quiz Conquest - Beitreten</title>
</svelte:head>
<main>
	<h1>Quiz Spielshow</h1>
	<p>Bitte geben Sie Ihren Namen ein, um dem Spiel beizutreten:</p>
	<input type="text" bind:value={name} placeholder="Name" />
	<button on:click={join}>Beitreten</button>
</main>
