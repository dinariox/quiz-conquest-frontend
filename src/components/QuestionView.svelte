<script lang="ts">
	import type { Category, GameState, Question } from '../lib/types';
	import { QuestionType } from '../lib/types';
	import { environment } from '../lib/environment';
	import { socketInstance } from '$lib/socket';
	import {
		isDoublePoints,
		translateQuestionType,
		getQuestionCategory,
		extractEnumItems,
		indexToLetter
	} from '$lib/util';

	export let gameState: GameState;
	export let isModerator: boolean = false;

	let textInput: string = '';
	let currentSelection: number = -1;

	function sendTextInput() {
		socketInstance.socket.emit('updateTextInput', textInput);
	}

	function updateChoice(choice: number) {
		if (gameState.lockChoice) return;
		currentSelection = choice;
		socketInstance.socket.emit('updateChoice', choice);
	}
</script>

<div class="question-view">
	{#if gameState.activeQuestion}
		<p id="category">
			{getQuestionCategory(gameState.categories, gameState.activeQuestion)?.name} &bull;
			{#if isDoublePoints(gameState.categories)}
				<span class="double-points">{gameState.activeQuestion?.value * 2}</span>
			{:else}
				<span>{gameState.activeQuestion?.value}</span>
			{/if}
			&bull; {translateQuestionType(gameState.activeQuestion.type)}
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
		<input
			type="text"
			placeholder="Schätzung"
			maxlength="32"
			bind:value={textInput}
			on:input={() => sendTextInput()}
			disabled={isModerator || gameState.lockTextInput}
		/>
	{/if}

	{#if gameState.activeQuestion?.type === QuestionType.Enum}
		{#if gameState.exposeQuestion}
			{#each extractEnumItems(gameState.activeQuestion) as enumItem, i}
				<p class="enum-item">{i < gameState.enumRevealAmount ? enumItem : '?'}</p>
			{/each}
		{:else if isModerator}
			<p>(NOT EXPOSED)</p>
		{/if}
	{/if}

	{#if gameState.activeQuestion?.type === QuestionType.Img}
		<img
			id="question-image"
			class={gameState.exposeQuestion ? '' : 'hide'}
			src={environment.BACKEND_URL + gameState.activeQuestion?.question}
			alt="Bild zur Frage"
		/>
	{/if}

	{#if gameState.activeQuestion?.type === QuestionType.Choice && gameState.exposeQuestion}
		<div class="choices">
			{#each gameState.activeQuestion?.choices ?? [] as choice, index}
				<button
					class="choice-item {currentSelection === index && 'active'}"
					on:click={() => updateChoice(index)}
					disabled={isModerator || gameState.lockChoice}
				>
					<span class="index-letter">{indexToLetter(index)}</span>
					{choice}
				</button>
			{/each}
		</div>
	{/if}

	{#if (gameState.exposeAnswer || isModerator) && gameState.exposeQuestion}
		<p id="answer" class={isModerator && !gameState.exposeAnswer ? 'only-moderator' : ''}>
			{gameState.activeQuestion?.answer}{isModerator &&
			gameState.activeQuestion?.type === QuestionType.Estimate
				? ' (PUNKTE MANUELL VERGEBEN!)'
				: ''}
		</p>
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

	.hide {
		position: absolute;
		top: -100vh;
	}

	.only-moderator {
		color: #cc5555 !important;
	}

	.enum-item {
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
		width: 24rem;
		padding: 0.75rem 1.25rem;
		border: 2px solid #67f2d1;
		border-radius: 0.5rem;
		font-size: 1.25rem;
		outline: none;
		text-align: center;
		margin-top: 1rem;
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

	.double-points {
		color: #4ed1b5;
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.choice-item {
		font-size: 1.5rem;
		font-family: inherit;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		text-align: left;
	}

	.choice-item:hover:not(:disabled) {
		border-color: #4ed1b5;
		cursor: pointer;
	}

	.choice-item.active {
		background-color: #e6ff6e;
	}

	.index-letter {
		color: #4ed1b5;
		margin-right: 0.5rem;
		font-weight: bold;
	}
</style>
