<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketInstance } from '../../lib/socket';
	import logger from '../../lib/logger';
	import type { Participant, GameState } from '../../lib/types';
	import { QuestionType } from '../../lib/types';
	import Logo from '../../components/Logo.svelte';
	import QuestionBoard from '../../components/QuestionBoard.svelte';
	import ParticipantList from '../../components/ParticipantList.svelte';
	import Buzzer from '../../components/Buzzer.svelte';
	import QuestionView from '../../components/QuestionView.svelte';
	import Fireworks from '../../components/Fireworks.svelte';

	let gameState: GameState = {
		players: [],
		categories: [],
		activeQuestion: null,
		buzzedPlayer: null,
		playersTurn: null,
		exposeQuestion: false,
		exposeAnswer: false,
		showBoard: false,
		enumRevealAmount: 0,
		lockTextInput: false,
		revealTextInput: false
	};

	onMount(() => {
		const uniqueId = localStorage.getItem('uniqueId');
		const buzzerAudio = new Audio('/buzzer.mp3');
		const wrongAnswerAudio = new Audio('/wrong2.mp3');
		const correctAnswerAudio = new Audio('/success2.mp3');

		buzzerAudio.volume = 0.25;
		wrongAnswerAudio.volume = 0.05;
		correctAnswerAudio.volume = 0.4;

		if (!uniqueId) {
			// Weiterleiten zur Join-Seite, wenn keine uniqueId im Local Storage vorhanden ist
			return goto('/join');
		}

		socketInstance.socket.on('uniqueIdUnknown', () => {
			logger.log(
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

		socketInstance.socket.on('playBuzzerSound', () => {
			buzzerAudio.play();
		});

		socketInstance.socket.on('playWrongAnswerSound', () => {
			wrongAnswerAudio.play();
		});

		socketInstance.socket.on('playCorrectAnswerSound', () => {
			correctAnswerAudio.play();
		});

		socketInstance.socket.emit('rejoin', { uniqueId });

		return () => {
			socketInstance.socket.off('updateGameState');
			socketInstance.socket.off('removedFromGame');
		};
	});

	function handleBuzzer() {
		socketInstance.socket.emit('buzz');
	}
</script>

<svelte:head>
	<title>Quiz Conquest - Teilnehmer</title>
</svelte:head>
<main class="center">
	<Logo />

	{#if gameState.activeQuestion === null}
		<QuestionBoard categories={gameState.categories} showCategories={gameState.showBoard} />
	{:else}
		<QuestionView {gameState} />
	{/if}
	{#if gameState.activeQuestion?.type !== QuestionType.Estimate}
		<Buzzer on:buzzer={() => handleBuzzer()} disabled={gameState.buzzedPlayer !== null} />
	{/if}
	<ParticipantList {gameState} />
	<Fireworks />
</main>

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
