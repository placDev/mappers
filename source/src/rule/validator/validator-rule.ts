import { MapperValidator, MapperValidatorType } from "../../utility-types";
import { MapperSettings } from "../../settings/mapper-settings";

export class ValidatorRule {
  private isEnabled: boolean = false;
  private validatorConstructor?: MapperValidator<any, any>;
  private validatorInstance?: MapperValidatorType<any, any>;

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
      throw new Error("Валидатор отключен для данного правила");
    }

    if (this.isExistCustomValidator) {
      this.fillValidatorInstance();
      return this.validatorInstance;
    }

    if (!MapperSettings.getValidatorStore().isEmpty) {
      return MapperSettings.getValidatorStore().getDefaultValidator();
    }

    throw new Error("Дефолтный или кастомный валидатор не определен");
  }

  private get isExistCustomValidator() {
    return this.validatorConstructor !== undefined;
  }

  private fillValidatorInstance() {
    if (!this.validatorInstance) {
      this.validatorInstance = new this.validatorConstructor!();
    }
  }
}
