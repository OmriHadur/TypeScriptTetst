export default class Stopwatch {
	private startTime: Date | null;

	constructor() {
		this.startTime = new Date();
	}

	restart() {
		this.startTime = new Date();
	}

	stop() {
		if (!this.startTime) {
			throw new Error('Stopwatch has not been started');
		}

		const stopTime = new Date();
		const elapsedTime = stopTime.getTime() - this.startTime.getTime();

		this.startTime = null;

		return elapsedTime;
	}
}