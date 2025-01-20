export class NotImplementedException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotImplementedException";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotImplementedException);
        }
    }
}