<script lang="ts">
	import type { Category } from '../lib/types';
	export let categories: Category[] = [];
</script>

<div class="question-board">
	{#each categories as category}
		<div class="category">
			<div class="category-title">{category.name}</div>
			{#each category.questions as question}
				<div class="question">{question.value} Punkte</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.question-board {
		display: flex;
		gap: 1rem;
	}

	.category {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.category-title {
		width: 150px;
		background-color: #094b96;
		color: white;
		font-weight: bold;
		text-align: center;
		padding: 1rem;
		border-radius: 5px;
	}

	.question {
		width: 150px;
		background-color: #0077ff;
		color: white;
		text-align: center;
		padding: 1rem;
		border-radius: 5px;
	}
</style>
