import { MapperValidator, MapperValidatorType } from "../utility-types";
import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";
import { Settings } from "./settings";

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
      throw new Error(`Запрошенный валидатор ${validator.name} не найден`);
    }

    return this.fillCustomValidatorInstance(validator);
  }

  getDefaultValidator() {
    if (this.isDefaultValidatorEmpty) {
      throw new Error("Дефолтный валидатор не установлен");
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
