import { BaseError } from "../base.error";

export class SettingsError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "SettingsError";
  }
}
