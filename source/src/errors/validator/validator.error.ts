import { BaseError } from "../base.error";

export class ValidatorError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "ValidatorError";
  }
}
