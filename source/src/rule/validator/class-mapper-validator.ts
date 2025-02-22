import { BaseMapperValidator } from "./base-mapper-validator";

//TODO
export class ClassMapperValidator extends BaseMapperValidator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate<T extends object>(item: T): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
