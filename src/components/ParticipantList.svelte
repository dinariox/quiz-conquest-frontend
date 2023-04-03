<script lang="ts">
	import { QuestionType, type GameState, type Participant } from '../lib/types';
	import { socketInstance } from '../lib/socket';
	import { indexToLetter } from '$lib/util';
	export let gameState: GameState;
	export let isModerator: boolean = false;

	let pointInput = '';

	function removePlayer(playerId: string) {
		if (isModerator) {
			if (confirm('Wirklich entfernen?')) {
				socketInstance.socket.emit('removePlayer', playerId);
			}
		}
	}

	function updatePoints(playerId: string) {
		if (isModerator) {
			let points = null;
			while (!points) {
				points = prompt('Wie viele Punkte sollen hinzugefügt werden?');
			}
			const pointDelta = parseInt(points);
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
					<button class="moderator-button" on:click={() => updatePoints(player.id)}>
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
					<button class="moderator-button" on:click={() => removePlayer(player.id)}
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
		width: 14.5rem;
		height: 4.5rem;
		padding: 0 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		background: #948b8f;
		border: 5px solid #857d80;
		border-radius: 0.5rem;
		position: relative;
	}

	.buzzed {
		background: linear-gradient(90deg, hsl(0, 91%, 62%) 0%, hsl(12, 91%, 62%));
	}

	.turn {
		border-color: #67f2d1;
	}

	.name {
		font-size: 2rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.score {
		font-size: 3rem;
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
