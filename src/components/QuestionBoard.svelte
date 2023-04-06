<script lang="ts">
	import { socketInstance } from '../lib/socket';
	import type { Category, Question } from '../lib/types';
	import { isDoublePoints } from '../lib/util';

	let doublePoints = false;

	export let isModerator: boolean = false;
	export let showCategories: boolean = false;
	export let categories: Category[];
	$: doublePoints = isDoublePoints(categories);

	function openQuestion(categoryName: string, question: Question) {
		if (isModerator) {
			socketInstance.socket.emit('openQuestion', { categoryName, question });
		}
	}
</script>

<div class="question-board">
	{#each categories as category, cIdx}
		<div class="category">
			<div class="category-title">{showCategories ? category.name : '???'}</div>
			{#each category.questions as question, qIdx}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="question {question.answered && 'answered'} {isModerator &&
						'pointer'} {doublePoints && !question.answered && 'double-points'}"
					style="animation-delay: {qIdx * 100 + cIdx * 100}ms"
					on:click={() => openQuestion(category.name, question)}
				>
					{doublePoints && !question.answered ? question.value * 2 : question.value}
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

		--lighter-color: hsl(325, 44%, 54%);
		--darker-color: hsl(325, 38%, 49%);
		--darker-color-transparency: hsla(325, 38%, 49%, 0.467);
	}

	.category:nth-of-type(2) {
		--lighter-color: hsl(310, 44%, 54%);
		--darker-color: hsl(310, 38%, 49%);
		--darker-color-transparency: hsla(310, 38%, 49%, 0.467);
	}
	.category:nth-of-type(3) {
		--lighter-color: hsl(295, 44%, 54%);
		--darker-color: hsl(295, 38%, 49%);
		--darker-color-transparency: hsla(295, 38%, 49%, 0.467);
	}
	.category:nth-of-type(4) {
		--lighter-color: hsl(280, 44%, 54%);
		--darker-color: hsl(280, 38%, 49%);
		--darker-color-transparency: hsla(280, 38%, 49%, 0.467);
	}
	.category:nth-of-type(5) {
		--lighter-color: hsl(265, 44%, 54%);
		--darker-color: hsl(265, 38%, 49%);
		--darker-color-transparency: hsla(265, 38%, 49%, 0.467);
	}
	.category:nth-of-type(6) {
		--lighter-color: hsl(250, 44%, 54%);
		--darker-color: hsl(250, 38%, 49%);
		--darker-color-transparency: hsla(250, 38%, 49%, 0.467);
	}

	.category-title {
		width: 10rem;
		height: 4.25rem;
		color: white;
		font-weight: bold;
		font-size: 1.5rem;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1.75rem;
		border-radius: 0.5rem;

		border: 5px solid var(--lighter-color);
		background-color: #0c0c0d;
	}

	.question {
		width: 10rem;
		height: 4.25rem;
		color: white;
		text-align: center;
		line-height: 1.75rem;
		font-size: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		border: 5px solid transparent;

		animation: ease-in-out shimmer 2.5s infinite;

		background-color: var(--lighter-color);
		background-image: linear-gradient(
				30deg,
				var(--darker-color) 12%,
				transparent 12.5%,
				transparent 87%,
				var(--darker-color) 87.5%,
				var(--darker-color)
			),
			linear-gradient(
				150deg,
				var(--darker-color) 12%,
				transparent 12.5%,
				transparent 87%,
				var(--darker-color) 87.5%,
				var(--darker-color)
			),
			linear-gradient(
				30deg,
				var(--darker-color) 12%,
				transparent 12.5%,
				transparent 87%,
				var(--darker-color) 87.5%,
				var(--darker-color)
			),
			linear-gradient(
				150deg,
				var(--darker-color) 12%,
				transparent 12.5%,
				transparent 87%,
				var(--darker-color) 87.5%,
				var(--darker-color)
			),
			linear-gradient(
				60deg,
				var(--darker-color-transparency) 25%,
				transparent 25.5%,
				transparent 75%,
				var(--darker-color-transparency) 75%,
				var(--darker-color-transparency)
			),
			linear-gradient(
				60deg,
				var(--darker-color-transparency) 25%,
				transparent 25.5%,
				transparent 75%,
				var(--darker-color-transparency) 75%,
				var(--darker-color-transparency)
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

	.question.double-points {
		color: #67f2d1;
	}

	.pointer {
		cursor: pointer;
	}

	@keyframes shimmer {
		0%,
		100% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.25);
		}
	}
</style>
