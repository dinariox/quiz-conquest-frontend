<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let disabled = false;
	const dispatch = createEventDispatcher();

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (
				(e.key == ' ' || e.code == 'Space' || e.keyCode == 32) &&
				!disabled &&
				!(e.target instanceof HTMLInputElement)
			) {
				e.preventDefault();
				handleBuzzer();
			}
		});
	});

	function handleBuzzer() {
		dispatch('buzzer');
	}
</script>

<button id="buzzer-button" on:click={() => handleBuzzer()} {disabled}>BUZZER</button>

<style>
	#buzzer-button {
		background-color: #67f2d1;
		color: black;
		font-family: inherit;
		font-size: 2rem;
		padding: 1rem 2rem;
		border: 2px solid #4ed1b5;
		border-radius: 0.5rem;
		margin-top: 2rem;
		cursor: pointer;
	}

	#buzzer-button:hover {
		background-color: #4ed1b5;
	}

	#buzzer-button:disabled {
		background-color: #d1d1d1;
		cursor: not-allowed;
	}
</style>
