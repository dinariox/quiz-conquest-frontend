<script lang="ts">
	import {
		Icon,
		PencilSquare,
		Plus,
		ArrowsRightLeft,
		Minus,
		Trash,
		CloudArrowDown,
		CloudArrowUp
	} from 'svelte-hero-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { QuestionType, type Category, type Question } from '$lib/types';
	import { translateQuestionType } from '$lib/util';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let categories: Category[] = [];
	$: console.log(categories);

	function addCategory(): void {
		let categoryName: string | null = '';
		while (categoryName.trim() === '') {
			categoryName = prompt('Wie soll die neue Kategorie heißen?\n(Kann später geändert werden)');
			if (categoryName === null) return;
		}
		categories.push({
			name: categoryName.trim(),
			questions: []
		});
		categories = categories; // trigger refresh of #each
	}

	function changeCategoryName(category: Category): void {
		let categoryName: string | null = '';
		while (categoryName.trim() === '') {
			categoryName = prompt('Neuer Name:');
			if (categoryName === null) return;
		}
		category.name = categoryName;
		categories = categories; // trigger refresh of #each
	}

	function deleteCategory(index: number): void {
		if (!confirm('Kategorie wirklich löschen?')) return;

		categories.splice(index, 1);
		categories = categories; // trigger refresh of #each
	}

	function addQuestion(category: Category): void {
		category.questions.push({
			type: QuestionType.Normal,
			question: '',
			answer: '',
			answered: false,
			value: 100
		});
		categories = categories; // trigger refresh of #each
	}

	function deleteQuestion(categoryIndex: number, questionIndex: number): void {
		if (!confirm('Frage wirklich löschen?')) return;

		categories[categoryIndex].questions.splice(questionIndex, 1);
		categories = categories; // trigger refresh of #each
	}

	function changeType(question: Question, type: QuestionType): void {
		if (
			question.type === QuestionType.Choice &&
			!confirm('Wenn du den Typ änderst, verlierst du die Antwortmöglichkeiten!')
		)
			return;
		question.type = type;
		if (type === QuestionType.Choice) {
			question.choices = ['', ''];
		} else if (type === QuestionType.Img) {
			question.question = '';
		}
		categories = categories; // trigger refresh of #each
	}

	function addChoice(question: Question): void {
		question.choices?.push('');
		categories = categories; // trigger refresh of #each
	}

	function removeChoice(question: Question): void {
		question.choices?.pop();
		categories = categories; // trigger refresh of #each
	}

	async function handleImageChange(question: Question, event: Event): Promise<void> {
		const fileInput = event.target as HTMLInputElement;
		question.question = '';
		if (fileInput.files && fileInput.files.length > 0) {
			question.question = `/${fileInput.files[0].name} (Uploading...)`;
			categories = categories; // trigger refresh of #each
			const success = await uploadImage(fileInput.files[0]);
			if (success) {
				question.question = `/${fileInput.files[0].name}`;
			}
		}
		categories = categories; // trigger refresh of #each
	}

	function uploadImage(file: File): Promise<boolean> {
		console.log(`TODO: ${file.name} will be uploaded.`);
		let formData = new FormData();
		formData.set('file', file);

		return fetch(`${PUBLIC_BACKEND_URL}/upload-image`, {
			method: 'POST',
			body: formData
		}).then((res) => {
			if (res.status === 200) {
				toast.push(`✅ ${file.name} wurde erfolgreich hochgeladen`);
				return true;
			} else {
				toast.push(`⚠️ Beim Hochladen von ${file.name} ist ein Fehler aufgetreten`);
				return false;
			}
		});
	}

	function clearImage(question: Question): void {
		question.question = '';
		categories = categories; // trigger refresh of #each
	}

	function saveCategories(): void {
		const data = JSON.stringify({ categories });
		fetch(`${PUBLIC_BACKEND_URL}/save-questions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		}).then((res) => {
			if (res.status === 200) {
				toast.push(`💾 Die Fragen wurde erfolgreich gespeichert`);
				return true;
			} else {
				toast.push(`⚠️ Beim Speichern der Fragen ist ein Fehler aufgetreten`);
				return false;
			}
		});
	}

	function loadCategories(): void {
		if (!confirm('Das Laden der Fragen vom Server überschreibt deine lokalen Fragen. Fortfahren?'))
			return;

		fetch(`${PUBLIC_BACKEND_URL}/load-questions`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					console.log('json', data);
					categories = data.categories;
					toast.push(`✅ Die Fragen wurden erfolgreich geladen`);
				});
			} else {
				toast.push(`⚠️ Beim Laden der Fragen ist ein Fehler aufgetreten`);
			}
		});
	}
</script>

<div>
	<button on:click={loadCategories}>
		<Icon src={CloudArrowDown} size="1rem" />
		Fragen laden
	</button>
	<button on:click={saveCategories}>
		<Icon src={CloudArrowUp} size="1rem" />
		Fragen speichern
	</button>
	<button on:click={addCategory}>
		<Icon src={Plus} size="1rem" />
		Kategorie hinzufügen
	</button>

	<div class="categories">
		{#each categories as category, categoryIndex}
			<div class="category">
				<h2>Kategorie "{category.name}"</h2>

				<button on:click={() => changeCategoryName(category)}>
					<Icon src={PencilSquare} size="1rem" />
					Kategorie umbenennen
				</button>
				<button on:click={() => deleteCategory(categoryIndex)}>
					<Icon src={Trash} size="1rem" />
					Kategorie löschen
				</button>

				<button on:click={() => addQuestion(category)}>
					<Icon src={Plus} size="1rem" />
					Frage hinzufügen
				</button>

				{#each category.questions as question, questionIndex}
					<div class="question">
						<div class="question-title">
							<h3>{questionIndex + 1}. Frage</h3>
							<button on:click={() => deleteQuestion(categoryIndex, questionIndex)} class="active">
								<Icon src={Trash} size="1rem" />
								Frage löschen
							</button>
						</div>

						<div class="property">
							<p><u>Punkte:</u></p>
							<input
								type="number"
								class="textbox"
								bind:value={question.value}
								min="0"
								step="100"
								required
							/>
						</div>
						<div class="property">
							<p><u>Typ:</u></p>
							{#each Object.values(QuestionType) as type}
								<button
									on:click={() => changeType(question, type)}
									class:active={question.type === type}
								>
									<Icon src={ArrowsRightLeft} size="1rem" />
									{translateQuestionType(type)}
								</button>
							{/each}
						</div>
						{#if question.type === QuestionType.Img}
							<div class="property">
								<p><u>Bild:</u></p>
								{#if question.question}
									<p>{question.question}</p>
									<button on:click={() => clearImage(question)} class="active">
										<Icon src={Trash} size="1rem" />
										Bild entfernen
									</button>
								{:else}
									<input
										type="file"
										class="textbox"
										on:change={(event) => handleImageChange(question, event)}
										required
									/>
								{/if}
							</div>
						{:else}
							<div class="property">
								<p><u>Frage:</u></p>
								<input
									type="text"
									class="textbox"
									bind:value={question.question}
									placeholder={question.type === QuestionType.Enum
										? 'Einträge|mit|senkrechtem Strich|trennen'
										: ''}
									required
								/>
								{#if question.type === QuestionType.Enum}
									<p>
										Einträge erkannt: {question.question ? question.question.split('|').length : 0}
									</p>
								{/if}
							</div>
						{/if}
						{#if question.type === QuestionType.Choice}
							<div class="property">
								<p><u>Antwortmöglichkeiten:</u></p>
								<div>
									{#each question.choices || [] as choice, index}
										<div class="choice">
											<p>{(index + 10).toString(36).toUpperCase()}:</p>
											<input type="text" class="textbox" bind:value={choice} required />

											{#if index + 1 === question.choices?.length}
												<button class="active" on:click={() => removeChoice(question)}>
													<Icon src={Minus} size="1rem" />
												</button>
												<button class="active" on:click={() => addChoice(question)}>
													<Icon src={Plus} size="1rem" />
												</button>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
						<div class="property">
							<p><u>Antwort:</u></p>
							<input type="text" class="textbox" bind:value={question.answer} required />
						</div>
						<div class="property">
							<p><u>Notizen (optional):</u></p>
							<input type="text" class="textbox" bind:value={question.notes} />
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	button {
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		background-color: #e6ff6e;
		border: 2px solid #cce160;
		border-radius: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
	}

	button:disabled {
		cursor: unset;
	}

	.categories {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.category {
		width: 800px;
		border: white 2px solid;
		border-radius: 1rem;
		padding: 1rem;
	}

	.category h2 {
		font-size: 1.5rem;
		margin: 0;
	}

	.question {
		border: white 2px solid;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-top: 1rem;
	}

	.question h3 {
		font-size: 1.25rem;
		margin: 0;
	}

	.question .property {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.question .property p {
		margin: 0;
	}

	.question .property button:not(.active) {
		background-color: lightgray;
		border-color: grey;
	}

	.question .property .textbox {
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		width: 100%;
		border: black 1px solid;
	}

	.question .property .textbox[type='number'] {
		width: 4rem;
	}

	.question .property .textbox:required {
		border: red 1px solid;
	}

	.question .property .textbox:valid {
		border: black 1px solid;
	}

	.question .property .choice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.question .property .choice .textbox {
		width: 300px;
	}

	.question .question-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
</style>
