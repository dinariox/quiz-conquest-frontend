import { QuestionType, type Category, type Question, type Participant } from './types';

const TEAM_ID_TO_COLOR = {
	0: 'red',
	1: 'blue',
	2: 'green',
	3: 'yellow',
	4: 'purple',
	5: 'orange'
};

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

export function getTeamColor(teamId: number): string {
	return TEAM_ID_TO_COLOR[teamId as keyof typeof TEAM_ID_TO_COLOR];
}

export function sortParticipantsByTeamId(participants: Participant[]): Participant[] {
	// the teamId field is optional. the players should be sorted by teamId if it is present and by name otherwise
	return participants.sort((a, b) => {
		if (a.teamId === b.teamId) {
			return a.name.localeCompare(b.name);
		}
		if (a.teamId === undefined) {
			return 1;
		}
		if (b.teamId === undefined) {
			return -1;
		}
		return a.teamId - b.teamId;
	});
}
