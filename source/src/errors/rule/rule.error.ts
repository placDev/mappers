import { BaseError } from "../base.error";

export class RuleError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "RuleError";
  }
}
