<script lang="ts">
	import type { Participant } from '../lib/types';
	import { socketInstance } from '../lib/socket';
	export let players: Participant[] = [];
	export let isModerator: boolean = false;

	let pointInput = '';

	function removePlayer(playerId: string) {
		if (isModerator) {
			socketInstance.socket.emit('removePlayer', playerId);
		}
	}

	function updatePoints(playerId: string, points: string) {
		if (isModerator && points) {
			const pointDelta = parseInt(points);
			socketInstance.socket.emit('updatePoints', { playerId, pointDelta });
		}
	}
</script>

<h2>Teilnehmer</h2>
<ul class="participant-list">
	{#each players as player}
		<li>
			{player.name} ({player.score} Punkte)
			{#if isModerator}
				<form
					class="point-update-form"
					on:submit|preventDefault={() => updatePoints(player.id, pointInput)}
				>
					<input type="number" bind:value={pointInput} />
					<button type="submit">Punkte aktualisieren</button>
				</form>
				<button class="remove-player-button" on:click={() => removePlayer(player.id)}
					>Entfernen</button
				>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.remove-player-button {
		background-color: red;
		color: white;
		border: none;
		cursor: pointer;
		margin-left: 1rem;
	}

	.point-update-form {
		display: inline;
		margin-left: 1rem;
	}
</style>
