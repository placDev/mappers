import { MapperValidator, MapperValidatorType } from "../utility-types";
import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";
import { Settings } from "./settings";
import { ValidatorError } from "../errors/validator/validator.error";
import { ValidatorErrorHelper } from "../errors/validator/validator.error.helper";

export class SettingsValidatorStore {
  private defaultValidatorInstance?: MapperValidatorType<any, any>;

  private instances: Map<MapperValidator<any, any>, any>;

  constructor(private settings: Settings) {
    this.instances = new Map<
      MapperValidator<any, any>,
      MapperValidatorType<any, any>
    >();
  }

  addValidatorInstance(instance: BaseMapperValidator) {
    this.validateCustomValidatorInstance(instance);

    this.instances.set(
      instance.constructor as MapperValidator<any, any>,
      instance,
    );
  }

  getCustomValidator<T extends BaseMapperValidator>(
    validator: MapperValidator<T, any>,
  ): MapperValidatorType<any, any> {
    if (this.instances.has(validator)) {
      return this.instances.get(validator);
    }

    if (this.settings.isCollectDI) {
      throw new ValidatorError(ValidatorErrorHelper.notFound(validator.name));
    }

    return this.fillCustomValidatorInstance(validator);
  }

  getDefaultValidator() {
    if (this.isDefaultValidatorEmpty) {
      throw new ValidatorError(ValidatorErrorHelper.defaultAlredySet());
    }

    this.fillDefaultValidatorInstance();

    return this.defaultValidatorInstance;
  }

  get isDefaultValidatorEmpty() {
    return this.settings.defaultValidator === undefined;
  }

  private fillDefaultValidatorInstance() {
    if (!this.defaultValidatorInstance) {
      this.defaultValidatorInstance = new this.settings.defaultValidator!();
    }
  }

  private fillCustomValidatorInstance(validator: MapperValidator<any, any>) {
    this.instances.set(validator, new validator());
  }

  private validateCustomValidatorInstance(instance: BaseMapperValidator) {
    if (!(instance instanceof BaseMapperValidator)) {
      throw new ValidatorError(ValidatorErrorHelper.notExtendsValidator());
    }

    // @ts-ignore
    if (this.instances.has(instance.constructor)) {
      throw new ValidatorError(
        ValidatorErrorHelper.alredyCreated(instance.constructor.name),
      );
    }
  }
}
