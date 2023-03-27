<script lang="ts">
	import { socketInstance } from '$lib/socket';
	import type { Category, Question } from '../lib/types';
	export let categories: Category[] = [];
	export let isModerator: boolean = false;

	function openQuestion(categoryName: string, question: Question) {
		if (isModerator) {
			socketInstance.socket.emit('openQuestion', { categoryName, question });
		}
	}
</script>

<div class="question-board">
	{#each categories as category}
		<div class="category">
			<div class="category-title">{category.name}</div>
			{#each category.questions as question}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="question {question.answered ? 'answered' : ''} {isModerator ? 'pointer' : ''}"
					on:click={() => openQuestion(category.name, question)}
				>
					{question.value}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.question-board {
		display: flex;
		gap: 0.75rem;
	}

	.category {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.category-title {
		width: 10rem;
		height: 4.5rem;
		color: white;
		font-weight: bold;
		font-size: 1.5rem;
		text-align: center;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1.75rem;
		border-radius: 0.5rem;

		border: 5px solid #be5683;
		background-color: transparent;
	}

	.question {
		width: 10rem;
		color: white;
		text-align: center;
		font-size: 2.5rem;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 5px solid transparent;

		background-color: #be5683;
		background-image: linear-gradient(
				30deg,
				#ab4d75 12%,
				transparent 12.5%,
				transparent 87%,
				#ab4d75 87.5%,
				#ab4d75
			),
			linear-gradient(
				150deg,
				#ab4d75 12%,
				transparent 12.5%,
				transparent 87%,
				#ab4d75 87.5%,
				#ab4d75
			),
			linear-gradient(
				30deg,
				#ab4d75 12%,
				transparent 12.5%,
				transparent 87%,
				#ab4d75 87.5%,
				#ab4d75
			),
			linear-gradient(
				150deg,
				#ab4d75 12%,
				transparent 12.5%,
				transparent 87%,
				#ab4d75 87.5%,
				#ab4d75
			),
			linear-gradient(
				60deg,
				#ab4d7577 25%,
				transparent 25.5%,
				transparent 75%,
				#ab4d7577 75%,
				#ab4d7577
			),
			linear-gradient(
				60deg,
				#ab4d7577 25%,
				transparent 25.5%,
				transparent 75%,
				#ab4d7577 75%,
				#ab4d7577
			);
		background-size: 20px 35px;
		background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
	}

	.question.answered {
		background-color: #948b8f;
		background-image: linear-gradient(
				30deg,
				#857d80 12%,
				transparent 12.5%,
				transparent 87%,
				#857d80 87.5%,
				#857d80
			),
			linear-gradient(
				150deg,
				#857d80 12%,
				transparent 12.5%,
				transparent 87%,
				#857d80 87.5%,
				#857d80
			),
			linear-gradient(
				30deg,
				#857d80 12%,
				transparent 12.5%,
				transparent 87%,
				#857d80 87.5%,
				#857d80
			),
			linear-gradient(
				150deg,
				#857d80 12%,
				transparent 12.5%,
				transparent 87%,
				#857d80 87.5%,
				#857d80
			),
			linear-gradient(
				60deg,
				#857d8077 25%,
				transparent 25.5%,
				transparent 75%,
				#857d8077 75%,
				#857d8077
			),
			linear-gradient(
				60deg,
				#857d8077 25%,
				transparent 25.5%,
				transparent 75%,
				#857d8077 75%,
				#857d8077
			);
		background-size: 20px 35px;
		background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
	}

	.pointer {
		cursor: pointer;
	}
</style>
