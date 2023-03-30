<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketInstance } from '../../lib/socket';
	import Logo from '../../components/Logo.svelte';

	let name = '';

	onMount(() => {
		const nameInput = document.getElementById('name-input') as HTMLInputElement;
		if (nameInput) {
			nameInput.focus();
		}

		socketInstance.socket.on('uniqueId', (uniqueId) => {
			localStorage.setItem('uniqueId', uniqueId);
			goto('/game');
		});
	});

	function join() {
		if (!name) {
			alert('Bitte gib deinen Namen ein!');
			return;
		}

		socketInstance.socket.emit('join', { name });
	}
</script>

<svelte:head>
	<title>Quiz Conquest - Beitreten</title>
</svelte:head>
<main>
	<Logo size="lg" />
	<div class="lower">
		<p>Bitte gib deinen Namen ein, um dem Spiel beizutreten:</p>
		<input
			id="name-input"
			type="text"
			bind:value={name}
			on:keydown={(e) => {
				e.key === 'Enter' && join();
			}}
			placeholder="Name"
		/>
		<button on:click={join}>
			<span>Beitreten</span>
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
					d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
				/>
			</svg>
		</button>
	</div>
</main>

<style>
	.lower {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;
	}

	main {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 4rem;
		min-height: 100vh;
	}

	p {
		font-size: 1.5rem;
		margin: 0;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		text-decoration: none;
		color: black;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		border: 2px solid #4ed1b5;
		background-color: #67f2d1;
		font-family: inherit;
		cursor: pointer;
	}

	button:hover {
		background-color: #4ed1b5;
	}

	span {
		font-size: 1.75rem;
	}

	svg {
		width: 2.5rem;
		height: 2.5rem;
	}

	input[type='text'] {
		width: 15rem;
		padding: 0.5rem 1rem;
		border: 2px solid #67f2d1;
		border-radius: 0.5rem;
		font-size: 1.5rem;
		font-family: inherit;
		outline: none;
		text-align: center;
	}

	input[type='text']:hover,
	input[type='text']:active,
	input[type='text']:focus {
		border-color: #4ed1b5;
	}
</style>
