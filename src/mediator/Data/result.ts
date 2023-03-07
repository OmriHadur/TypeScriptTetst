export default class Result<TValue> {
    errors: Error[];
    value?: TValue;

    constructor() {
        this.errors = [];
    }

    isFailed = () => this.errors.length > 0;

    isSuccess = () => this.errors.length == 0 && this.value != null;
}