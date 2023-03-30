export default class Logger {
	constructor() {}

	private static formattedDate(): string {
		// Format Date to YYYY-MM-DD HH:MM:SS with leading zeros
		const date = new Date();
		const year = date.getFullYear();
		const month = `0${date.getMonth() + 1}`.slice(-2);
		const day = `0${date.getDate()}`.slice(-2);
		const hours = `0${date.getHours()}`.slice(-2);
		const minutes = `0${date.getMinutes()}`.slice(-2);
		const seconds = `0${date.getSeconds()}`.slice(-2);
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	public static log(...message: any[]) {
		console.log(`%c[${this.formattedDate()}]`, 'color: #00FF00', ...message);
	}
}
