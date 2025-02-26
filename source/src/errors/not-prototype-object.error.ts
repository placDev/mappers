import { BaseError } from "./base.error";

export class NotPrototypeObjectError extends BaseError {
  constructor() {
    super("The object is not an instance of any class");

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotPrototypeObjectError);
    }
  }
}
