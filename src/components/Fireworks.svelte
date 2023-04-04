<script lang="ts">
	import { socketInstance } from '$lib/socket';
	import type { Participant } from '$lib/types';
	import confetti from 'canvas-confetti';
	import { onMount } from 'svelte';

	let winner: Participant | null = null;
	let interval: number;

	function randomInRange(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	function launch() {
		let duration = 15 * 1000;
		let animationEnd = Date.now() + duration;
		let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

		setTimeout(() => {
			winner = null;
		}, duration);

		interval = setInterval(() => {
			let timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			let particleCount = 50 * (timeLeft / duration);
			// since particles fall down, start a bit higher than random
			confetti(
				Object.assign({}, defaults, {
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
				})
			);
			confetti(
				Object.assign({}, defaults, {
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
				})
			);
		}, 250);
	}

	onMount(() => {
		let audio = new Audio('/minecraft-advancement-challenge-complete.mp3');
		audio.volume = 0.15;

		socketInstance.socket.on('launch-fireworks', (player: Participant) => {
			winner = player;
			audio.play();
			launch();
		});
	});
</script>

{#if winner}
	<div class="winner-container">
		<p class="crown">👑</p>
		<p class="text">Herzlichen Glückwunsch an</p>
		<p class="name">{winner?.name}</p>
	</div>
{/if}

<style>
	.winner-container {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 3rem 4rem;
		background-color: rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(0.5rem);
		border: 0.5rem solid rgba(0, 0, 0, 0.65);
		box-shadow: 0.5rem 0.5rem 1.5rem rgba(0, 0, 0, 0.35);
		border-radius: 3rem;
		text-align: center;
	}

	p {
		margin: 0;
	}

	.crown {
		font-size: 6rem;
		margin-bottom: 3rem;
	}

	.text {
		font-size: 2.5rem;
	}

	.name {
		font-size: 4.5rem;

		animation: rainbow 2.5s linear;
		animation-iteration-count: infinite;
	}

	@keyframes rainbow {
		100%,
		0% {
			color: rgb(255, 0, 0);
		}
		8% {
			color: rgb(255, 127, 0);
		}
		16% {
			color: rgb(255, 255, 0);
		}
		25% {
			color: rgb(127, 255, 0);
		}
		33% {
			color: rgb(0, 255, 0);
		}
		41% {
			color: rgb(0, 255, 127);
		}
		50% {
			color: rgb(0, 255, 255);
		}
		58% {
			color: rgb(0, 127, 255);
		}
		66% {
			color: rgb(0, 0, 255);
		}
		75% {
			color: rgb(127, 0, 255);
		}
		83% {
			color: rgb(255, 0, 255);
		}
		91% {
			color: rgb(255, 0, 127);
		}
	}
</style>
