import { QuestionType, type Category, type Question } from './types';

export function isDoublePoints(categories: Category[], treshold: number = 5): boolean {
	let allQuestions: Question[] = [];
	categories.forEach((category) => allQuestions.push(...category.questions));
	let notAnsweredCount = 0;
	allQuestions.forEach((question) => !question.answered && notAnsweredCount++);
	return notAnsweredCount <= treshold;
}

export function translateQuestionType(type: QuestionType): string {
	switch (type) {
		case QuestionType.Choice:
			return 'Multiple Choice';
		case QuestionType.Enum:
			return 'Aufzählung';
		case QuestionType.Estimate:
			return 'Schätzen';
		case QuestionType.Img:
			return 'Bild';
		case QuestionType.Normal:
			return 'Buzzer';
		default:
			return (type as string).toUpperCase();
	}
}

export function extractEnumItems(question: Question): string[] {
	const enumItems = question.question.split('|');
	return enumItems;
}

export function getQuestionCategory(
	categories: Category[],
	question: Question
): Category | undefined {
	// search for the category that contains the question
	return categories.find((category) => {
		return category.questions.find((q) => q.question === question.question);
	});
}

export function indexToLetter(index: number): string {
	return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(index);
}
