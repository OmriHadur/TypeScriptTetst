export default class Result<TValue> {
    error?: Error;
    value?: TValue;

    isFailed = () => this.error

    isSuccess = () => this.error == null && this.value != null;
}