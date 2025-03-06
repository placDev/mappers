import { SimpleValidateDto } from '../validate.spec';
import { BaseMapperValidator } from '../../../../../source/src/rule/validator/base-mapper-validator';

export class DefaultMapperValidator extends BaseMapperValidator {
  async validate(item: SimpleValidateDto) {
    console.log('Default');
  }
}