import { BaseError } from "./base.error";

export class NotPrototypeObjectError extends BaseError {
  constructor() {
    super("Объект не является экзкмпляром какого либо классом");

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotPrototypeObjectError);
    }
  }
}
