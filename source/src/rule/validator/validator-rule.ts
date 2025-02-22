import { MapperValidator, MapperValidatorType } from "../../utility-types";
import { MapperSettings } from "../../settings/mapper-settings";
import { ValidatorError } from "../../errors/validator/validator.error";
import { ValidatorErrorHelper } from "../../errors/validator/validator.error.helper";

export class ValidatorRule {
  private isEnabled: boolean = false;
  private validatorConstructor?: MapperValidator<any, any>;

  setEnabled() {
    this.isEnabled = true;
  }

  getEnabled(): boolean {
    return this.isEnabled;
  }

  setValidatorConstructor(validatorConstructor: MapperValidator<any, any>) {
    this.validatorConstructor = validatorConstructor;
  }

  getValidator(): MapperValidatorType<any, any> {
    if (!this.isEnabled) {
      throw new ValidatorError(ValidatorErrorHelper.disabled());
    }

    const validatorStore = MapperSettings.getValidatorStore();

    if (this.isExistCustomValidator) {
      return validatorStore.getCustomValidator(this.validatorConstructor!);
    }

    if (!validatorStore.isDefaultValidatorEmpty) {
      return validatorStore.getDefaultValidator();
    }

    throw new ValidatorError(
      ValidatorErrorHelper.defaultOrCustomValidatorNotFound(),
    );
  }

  private get isExistCustomValidator() {
    return this.validatorConstructor !== undefined;
  }
}
