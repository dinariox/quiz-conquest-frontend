<script lang="ts">
	import { onMount } from 'svelte';
	import { socketInstance } from '../../lib/socket';
	import type { Category, GameState } from '../../lib/types';
	import QuestionBoard from '../../components/QuestionBoard.svelte';
	import ParticipantList from '../../components/ParticipantList.svelte';

	let gameState: GameState = {
		players: [],
		categories: [],
		activeQuestion: null,
		buzzedPlayer: null
	};

	onMount(() => {
		socketInstance.socket.emit('requestGameState');

		socketInstance.socket.on('updateGameState', (updatedGameState: GameState) => {
			gameState = updatedGameState;
		});

		return () => {
			socketInstance.socket.off('updateGameState');
		};
	});
</script>

<svelte:head>
	<title>Quiz Conquest - MODERATOR</title>
</svelte:head>
<h1>Quiz Conquest (Moderator)</h1>

<QuestionBoard categories={gameState.categories} isModerator={true} />
<ParticipantList players={gameState.players} isModerator={true} />
