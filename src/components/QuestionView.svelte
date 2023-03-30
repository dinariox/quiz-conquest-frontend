<script lang="ts">
	import type { Category, GameState, Question } from '../lib/types';
	import { QuestionType } from '../lib/types';
	import { environment } from '../lib/environment';

	export let gameState: GameState;
	export let isModerator: boolean = false;

	function extractEnumItems(question: Question): string[] {
		const enumItems = question.question.split('|');
		return enumItems;
	}

	function getQuestionCategory(question: Question): Category | undefined {
		// search for the category that contains the question
		return gameState.categories.find((category) => {
			return category.questions.find((q) => q.question === question.question);
		});
	}
</script>

<div class="question-view">
	{#if gameState.activeQuestion}
		<p id="category">
			{getQuestionCategory(gameState.activeQuestion)?.name} ({gameState.activeQuestion?.value})
		</p>
	{/if}

	{#if gameState.activeQuestion?.type !== QuestionType.Img && gameState.activeQuestion?.type !== QuestionType.Enum}
		{#if gameState.exposeQuestion}
			<p id="question">{gameState.activeQuestion?.question}</p>
		{:else if isModerator}
			<p id="question" class="only-moderator">{gameState.activeQuestion?.question}</p>
			<p>(NOT EXPOSED)</p>
		{/if}
	{/if}

	{#if gameState.activeQuestion?.type === QuestionType.Estimate && gameState.exposeQuestion}
		<input type="text" placeholder="Schätzung" />
	{/if}

	{#if gameState.activeQuestion?.type === QuestionType.Enum}
		{#if gameState.exposeQuestion}
			{#each extractEnumItems(gameState.activeQuestion) as enumItem, i}
				<p id="enum-item">{i < gameState.enumRevealAmount ? enumItem : '?'}</p>
			{/each}
		{:else if isModerator}
			<p>(NOT EXPOSED)</p>
		{/if}
	{/if}

	{#if gameState.activeQuestion?.type === QuestionType.Img && gameState.exposeQuestion}
		<img
			id="question-image"
			src={environment.BACKEND_URL + gameState.activeQuestion?.question}
			alt="Bild zur Frage"
		/>
	{/if}

	{#if gameState.exposeAnswer && gameState.exposeQuestion}
		<p id="answer">{gameState.activeQuestion?.answer}</p>
	{/if}
</div>

<style>
	.question-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: min(70vw, 1200px);
		height: min(50vh, 800px);
		background-color: #dadfe1;
		padding: 2rem 4rem;
		border-radius: 0.5rem;
		box-sizing: border-box;
		position: relative;
	}

	#question {
		font-size: 2rem;
		font-weight: 300;
		text-align: center;
		color: black;
		line-height: 2.5rem;
		margin: 0;
	}

	#question.only-moderator {
		color: #cc5555;
	}

	#enum-item {
		font-size: 2rem;
		font-weight: 300;
		text-align: center;
		color: black;
		margin: 0.5rem 0;
	}

	#question-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	#category {
		font-size: 1.5rem;
		font-weight: 500;
		text-align: center;
		color: black;
		margin: 0;
		margin-bottom: 0.5rem;
	}

	input[type='text'] {
		width: 20rem;
		padding: 0.75rem 1.25rem;
		border: 2px solid #67f2d1;
		border-radius: 0.5rem;
		font-size: 1.25rem;
		outline: none;
		text-align: center;
	}

	input[type='text']:hover,
	input[type='text']:active,
	input[type='text']:focus {
		border-color: #4ed1b5;
	}

	#answer {
		padding: 1rem 2rem;
		border: 3px solid #e6ff6e;
		border-radius: 0.5rem;
		font-size: 1.5rem;
		background-color: white;
		color: black;
		position: absolute;
		bottom: 0;
		box-shadow: 0.25rem 0.25rem 0.75rem #555555aa;
	}
</style>