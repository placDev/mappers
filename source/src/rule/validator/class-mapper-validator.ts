import {BaseMapperValidator} from "./base-mapper-validator";

export class ClassMapperValidator extends BaseMapperValidator {
    validate<T extends Object>(item: T): Promise<void> {
        throw new Error("Method not implemented.");
    }
}