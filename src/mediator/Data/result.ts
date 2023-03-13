export default class Result<TValue> {
	public error?: Error;
	public value?: TValue;

	isError = (): boolean => this.error != null;

	isSuccess = (): boolean => this.error == null && this.value != null;

	isResult = (): boolean => this.error != null || this.value != null;
}