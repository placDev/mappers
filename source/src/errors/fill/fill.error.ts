import { BaseError } from "../base.error";

export class FillError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "FillError";
  }
}
