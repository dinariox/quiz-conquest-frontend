<script lang="ts">
	import { onMount } from 'svelte';
	import { socketInstance } from '../../lib/socket';
	import logger from '../../lib/logger';
	import { QuestionType, type Category, type GameState } from '../../lib/types';
	import Logo from '../../components/Logo.svelte';
	import QuestionBoard from '../../components/QuestionBoard.svelte';
	import ParticipantList from '../../components/ParticipantList.svelte';
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
		revealTextInput: false,
		lockChoice: false,
		revealChoice: false
	};

	onMount(() => {
		const buzzerAudio = new Audio('/buzzer.mp3');
		const wrongAnswerAudio = new Audio('/wrong2.mp3');
		const correctAnswerAudio = new Audio('/success2.mp3');

		socketInstance.socket.emit('requestGameState');

		buzzerAudio.volume = 0.25;
		wrongAnswerAudio.volume = 0.05;
		correctAnswerAudio.volume = 0.4;

		socketInstance.socket.on('updateGameState', (updatedGameState: GameState) => {
			gameState = updatedGameState;
			logger.log('Updated game state: ', gameState);
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

		return () => {
			socketInstance.socket.off('updateGameState');
		};
	});

	function selectRandomPlayersTurn() {
		socketInstance.socket.emit('selectRandomPlayersTurn');
	}

	function resetBuzzer() {
		socketInstance.socket.emit('resetBuzzer');
	}

	function correctAnswer() {
		socketInstance.socket.emit('correctAnswer');
	}

	function wrongAnswer() {
		socketInstance.socket.emit('wrongAnswer');
	}

	function abortQuestion() {
		socketInstance.socket.emit('abortQuestion');
	}

	function completeQuestion() {
		socketInstance.socket.emit('completeQuestion');
	}

	function exposeQuestion() {
		socketInstance.socket.emit('exposeQuestion');
	}

	function exposeAnswer() {
		socketInstance.socket.emit('exposeAnswer');
	}

	function showBoard() {
		socketInstance.socket.emit('showBoard');
	}

	function revealEnumItem() {
		socketInstance.socket.emit('revealEnumItem');
	}

	function lockTextInput() {
		socketInstance.socket.emit('lockTextInput');
	}

	function revealTextInput() {
		socketInstance.socket.emit('revealTextInput');
	}

	function lockChoice() {
		socketInstance.socket.emit('lockChoice');
	}

	function revealChoice() {
		socketInstance.socket.emit('revealChoice');
	}

	function revealWinner() {
		if (confirm('Wirklich Feuerwerk zünden?')) {
			socketInstance.socket.emit('launch-fireworks');
		}
	}
</script>

<svelte:head>
	<title>Quiz Conquest - MODERATOR</title>
</svelte:head>
<main class="center">
	<Logo isModerator={true} />

	{#if gameState.activeQuestion === null}
		<QuestionBoard
			categories={gameState.categories}
			showCategories={gameState.showBoard}
			isModerator={true}
		/>
	{:else}
		<QuestionView {gameState} isModerator={true} />
	{/if}
	<ParticipantList {gameState} isModerator={true} />

	<div class="moderator-buttons">
		<div class="group">
			<button on:click={() => showBoard()} disabled={gameState.showBoard}>Board einblenden</button>
			<button
				on:click={() => selectRandomPlayersTurn()}
				disabled={gameState.playersTurn !== null || gameState.players.length === 0}
				>Zufälligen Spieler auswählen</button
			>
			<button on:click={() => resetBuzzer()} disabled={gameState.buzzedPlayer === null}>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1.5V5.5a3 3 0 116 0v2.75a.75.75 0 001.5 0V5.5A4.5 4.5 0 0014.5 1z"
					/>
				</svg>
				<span>Buzzer freigeben</span>
			</button>
		</div>
		<div class="group">
			<button
				on:click={() => exposeAnswer()}
				disabled={gameState.activeQuestion === null || gameState.exposeAnswer}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					/>
				</svg>
				<span>Antwort aufdecken</span>
			</button>
			<button
				on:click={() => correctAnswer()}
				disabled={gameState.buzzedPlayer === null || gameState.activeQuestion === null}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z"
					/>
				</svg>
				<span>Richtige Antwort</span>
			</button>
			<button
				on:click={() => wrongAnswer()}
				disabled={gameState.buzzedPlayer === null || gameState.activeQuestion === null}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M18.905 12.75a1.25 1.25 0 01-2.5 0v-7.5a1.25 1.25 0 112.5 0v7.5zM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 015.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.242 0-2.26-1.01-2.146-2.247.193-2.08.652-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 011.342.317l2.733 1.366A3 3 0 0013.613 5h1.292v7h-.963c-.684 0-1.258.482-1.612 1.068a4.012 4.012 0 01-2.165 1.73c-.433.143-.854.386-1.012.814-.16.432-.248.9-.248 1.388z"
					/>
				</svg>
				<span>Falsche Antwort</span>
			</button>
		</div>
		<div class="group">
			<button
				on:click={() => exposeQuestion()}
				disabled={gameState.activeQuestion === null || gameState.exposeQuestion}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				<span>Frage aufdecken</span>
			</button>
			<button
				on:click={() => abortQuestion()}
				disabled={gameState.activeQuestion === null || gameState.buzzedPlayer !== null}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M7.22 3.22A.75.75 0 017.75 3h9A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17h-9a.75.75 0 01-.53-.22L.97 10.53a.75.75 0 010-1.06l6.25-6.25zm3.06 4a.75.75 0 10-1.06 1.06L10.94 10l-1.72 1.72a.75.75 0 101.06 1.06L12 11.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L12 8.94l-1.72-1.72z"
					/>
				</svg>
				Frage abbrechen
			</button>
			<button
				on:click={() => completeQuestion()}
				disabled={gameState.activeQuestion === null ||
					gameState.buzzedPlayer !== null ||
					!gameState.exposeAnswer}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					/>
				</svg>
				<span>Frage abschließen</span>
			</button>
		</div>
		<div class="group">
			<button
				on:click={() => revealEnumItem()}
				disabled={gameState.activeQuestion?.type !== QuestionType.Enum || !gameState.exposeQuestion}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 15.25a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 10a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1V10z"
					/>
				</svg>
				<span>Aufzählung weiter aufdecken</span>
			</button>
			<button
				on:click={() => lockTextInput()}
				disabled={gameState.activeQuestion?.type !== QuestionType.Estimate ||
					gameState.lockTextInput ||
					!gameState.exposeQuestion}
			>
				<svg
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
					/>
				</svg>
				<span>Schätzung sperren</span>
			</button>
			<button
				on:click={() => revealTextInput()}
				disabled={gameState.activeQuestion?.type !== QuestionType.Estimate ||
					gameState.revealTextInput ||
					!gameState.lockTextInput ||
					!gameState.exposeQuestion}
			>
				<svg
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
					/>
				</svg>
				<span>Schätzung aufdecken</span>
			</button>
		</div>
		<div class="group">
			<button
				on:click={() => lockChoice()}
				disabled={gameState.activeQuestion?.type !== QuestionType.Choice ||
					gameState.lockChoice ||
					!gameState.exposeQuestion}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
					/>
				</svg>
				<span>Choice sperren</span>
			</button>
			<button
				on:click={() => revealChoice()}
				disabled={gameState.activeQuestion?.type !== QuestionType.Choice ||
					gameState.revealChoice ||
					!gameState.lockChoice ||
					!gameState.exposeQuestion}
			>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
					/>
				</svg>
				<span>Choice aufdecken</span>
			</button>
			<button on:click={() => revealWinner()}>
				<svg
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M13.92 3.845a19.361 19.361 0 01-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 00-.504 7.969 15.974 15.974 0 001.271 3.341c.397.77 1.342 1 2.05.59l.867-.5c.726-.42.94-1.321.588-2.021-.166-.33-.315-.666-.448-1.004 1.8.358 3.511.964 5.096 1.78A17.964 17.964 0 0015 10c0-2.161-.381-4.234-1.08-6.155zM15.243 3.097A19.456 19.456 0 0116.5 10c0 2.431-.445 4.758-1.257 6.904l-.03.077a.75.75 0 001.401.537 20.902 20.902 0 001.312-5.745 1.999 1.999 0 000-3.545 20.902 20.902 0 00-1.312-5.745.75.75 0 00-1.4.537l.029.077z"
					/>
				</svg>
				<span>Gewinner verkünden</span>
			</button>
		</div>
	</div>
	<Fireworks />
</main>

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.moderator-buttons {
		display: flex;
		justify-content: center;
		align-items: start;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.group button {
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		background-color: #e6ff6e;
		border: 2px solid #cce160;
		border-radius: 0.5rem;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
	}

	.group button:disabled {
		cursor: unset;
	}

	.group button svg {
		width: 1rem;
	}
</style>
