import { BaseError } from "../base.error";

export class ProfileError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "ProfileError";
  }
}
