import { MapperValidator, MapperValidatorType } from "../utility-types";
import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";
import { MapperSettings } from "./mapper-settings";

export class SettingsValidatorStore {
  private defaultValidator?: MapperValidator<any, any>;
  private validatorInstance?: MapperValidatorType<any, any>;

  private instances = new Map<
    MapperValidator<any, any>,
    MapperValidatorType<any, any>
  >();

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

    if (MapperSettings.settings.isCollectDI) {
      throw new Error(`Запрошенный валидатор ${validator.name} не найден`);
    }

    return this.fillCustomValidatorInstance(validator);
  }

  //TODO Унести в настройки
  setDefaultValidator<T extends BaseMapperValidator>(
    validator: MapperValidator<T, any>,
  ) {
    this.defaultValidator = validator;
  }

  getDefaultValidator() {
    if (this.isDefaultValidatorEmpty) {
      throw new Error("Дефолтный валидатор не установлен");
    }

    this.fillDefaultValidatorInstance();

    return this.validatorInstance;
  }

  get isDefaultValidatorEmpty() {
    return this.defaultValidator === undefined;
  }

  private fillDefaultValidatorInstance() {
    if (!this.validatorInstance) {
      this.validatorInstance = new this.defaultValidator!();
    }
  }

  private fillCustomValidatorInstance(validator: MapperValidator<any, any>) {
    this.instances.set(validator, new validator());
  }

  private validateCustomValidatorInstance(instance: BaseMapperValidator) {
    if (!(instance instanceof BaseMapperValidator)) {
      throw new Error(`Объект не является наследником BaseMapperValidator`);
    }

    // @ts-ignore
    if (this.instances.has(instance.constructor)) {
      throw new Error(
        `Экземпляр валидатора ${instance.constructor.name} уже создан`,
      );
    }
  }
}
