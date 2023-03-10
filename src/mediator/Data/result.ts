export default class Result<TValue> {
	error?: Error;
	value?: TValue;

	constructor(value: (Error | TValue)) {
		if (value instanceof Error)
			this.error = value;
		else
			this.value = value;
	}

	isFailed = () => this.error

	isSuccess = () => this.error == null && this.value != null;
}