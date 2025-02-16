import { SimpleValidateDto } from "../tests/validate.spec";
import { BaseMapperValidator } from "../../../../source/src/validator/base-mapper-validator";

export class TestMapperValidator extends BaseMapperValidator {
    validate(item: SimpleValidateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}