<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketInstance } from '../../lib/socket';
	import type { Participant, GameState } from '../../lib/types';
	import QuestionBoard from '../../components/QuestionBoard.svelte';
	import ParticipantList from '../../components/ParticipantList.svelte';

	let gameState: GameState = {
		players: [],
		categories: [],
		activeQuestion: null,
		buzzedPlayer: null
	};

	onMount(() => {
		const uniqueId = localStorage.getItem('uniqueId');

		if (!uniqueId) {
			// Weiterleiten zur Join-Seite, wenn keine uniqueId im Local Storage vorhanden ist
			return goto('/join');
		}

		socketInstance.socket.on('uniqueIdUnknown', () => {
			console.log(
				'You tried to rejoin with uniqueId ' + uniqueId + " but the server doesn't recognize it."
			);
			goto('/join');
		});

		socketInstance.socket.on('updateGameState', (updatedGameState: GameState) => {
			gameState = updatedGameState;
		});

		socketInstance.socket.on('removedFromGame', () => {
			localStorage.removeItem('uniqueId');
			goto('/');
		});

		socketInstance.socket.emit('rejoin', { uniqueId });

		return () => {
			socketInstance.socket.off('updateGameState');
			socketInstance.socket.off('removedFromGame');
		};
	});
</script>

<svelte:head>
	<title>Quiz Conquest - Teilnehmer</title>
</svelte:head>
<h1>Quiz Conquest</h1>

<QuestionBoard categories={gameState.categories} />
<ParticipantList players={gameState.players} />

<style>
</style>
