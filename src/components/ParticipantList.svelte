<script lang="ts">
	import { QuestionType, type GameState, type Participant } from '../lib/types';
	import { socketInstance } from '../lib/socket';
	import { indexToLetter, isDoublePoints } from '$lib/util';
	export let gameState: GameState;
	export let isModerator: boolean = false;

	let pointInput = '';

	function removePlayer(playerId: string, playerName: string) {
		if (isModerator) {
			if (confirm(`Wirklich ${playerName} entfernen?`)) {
				socketInstance.socket.emit('removePlayer', playerId);
			}
		}
	}

	function updatePoints(playerId: string, playerName: string, points?: number) {
		if (isModerator) {
			let pointsToSet = null;
			if (points) {
				pointsToSet = points.toString();
			}
			while (!pointsToSet) {
				pointsToSet = prompt(`Wie viele Punkte sollen ${playerName} hinzugefügt werden?`);
			}
			const pointDelta = parseInt(pointsToSet);
			socketInstance.socket.emit('updatePoints', { playerId, pointDelta });
		}
	}
</script>

<h2>Teilnehmer</h2>
<div class="participant-list">
	{#each gameState.players as player}
		<div
			class="participant {gameState.buzzedPlayer?.id === player.id ? 'buzzed' : ''} {gameState
				.playersTurn?.id === player.id
				? 'turn'
				: ''}"
		>
			<img
				class="avatar"
				src="https://api.dicebear.com/7.x/micah/svg?seed={btoa(player.name)}"
				alt="Avatar"
			/>
			<span class="name">{player.name}</span>
			<span class="score">{player.score}</span>
			{#if (isModerator && gameState.activeQuestion?.type === QuestionType.Estimate) || gameState.revealTextInput}
				<div class="user-text">{player.textInput}</div>
			{/if}
			{#if (isModerator && gameState.activeQuestion?.type === QuestionType.Choice) || gameState.revealChoice}
				<div class="user-text">
					{player.choice > -1
						? gameState.activeQuestion?.choices &&
						  `${indexToLetter(player.choice)}: ${gameState.activeQuestion.choices[player.choice]}`
						: ''}
				</div>
			{/if}
			{#if isModerator}
				<div class="moderator-buttons">
					{#if gameState.activeQuestion && (gameState.activeQuestion.type === QuestionType.Estimate || gameState.activeQuestion.type === QuestionType.Choice)}
						<button
							class="moderator-button"
							title="Punkte-Wert der aktuellen Frage vergeben"
							on:click={() =>
								updatePoints(
									player.id,
									player.name,
									(gameState.activeQuestion?.value || 0) *
										(isDoublePoints(gameState.categories) ? 2 : 1)
								)}
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
									d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
								/>
							</svg>
						</button>
					{/if}
					<button
						class="moderator-button"
						title="Benutzerdefinierten Punktewert vergeben"
						on:click={() => updatePoints(player.id, player.name)}
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
								d="M9.493 2.853a.75.75 0 00-1.486-.205L7.545 6H4.198a.75.75 0 000 1.5h3.14l-.69 5H3.302a.75.75 0 000 1.5h3.14l-.435 3.148a.75.75 0 001.486.205L7.955 14h2.986l-.434 3.148a.75.75 0 001.486.205L12.456 14h3.346a.75.75 0 000-1.5h-3.14l.69-5h3.346a.75.75 0 000-1.5h-3.14l.435-3.147a.75.75 0 00-1.486-.205L12.045 6H9.059l.434-3.147zM8.852 7.5l-.69 5h2.986l.69-5H8.852z"
							/>
						</svg>
					</button>
					<button
						class="moderator-button"
						title="Spieler vom Spiel entfernen"
						on:click={() => removePlayer(player.id, player.name)}
						><svg
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 008 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 00-11.908 0zM12.75 7.75a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z"
							/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.participant-list {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 3rem;
	}

	.participant {
		width: 14rem;
		height: 4rem;
		padding-right: 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		background: #363435;
		border-radius: 0.5rem;
		position: relative;
	}

	.avatar {
		height: 100%;
		padding-top: 0.25rem;
		padding-left: 0.25rem;
		box-sizing: border-box;
	}

	.buzzed {
		background: linear-gradient(90deg, hsl(0, 91%, 62%) 0%, hsl(12, 91%, 62%));
		box-shadow: 0 0 0.65rem 0.25rem hsl(0, 91%, 62%);
	}

	.turn {
		box-shadow: 0 0 0.65rem 0.25rem #67f2d1;
	}

	.name {
		font-size: 1.75rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.score {
		font-size: 2.5rem;
	}

	.moderator-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(0.25rem);
		opacity: 0%;
		border-radius: 0.5rem;
	}

	.moderator-buttons:hover {
		opacity: 100%;
	}

	.moderator-button {
		background: none;
		border: none;
		cursor: pointer;
	}

	.moderator-button:hover {
		color: hsl(0, 91%, 62%);
	}

	.moderator-button svg {
		width: 2rem;
		height: 2rem;
	}

	.user-text {
		position: absolute;
		left: 0;
		bottom: -2.5rem;
		width: 90%;
		margin-left: 5%;
		height: 3rem;
		background-color: white;
		border-radius: 0.5rem;
		text-align: center;
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		word-break: break-all;
		line-height: 1.25rem;
	}
</style>
