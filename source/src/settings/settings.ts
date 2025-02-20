import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";
import { MapperValidator } from "../utility-types";
import { CollectType } from "./enums/collect-type.enum";
import { SettingsInterface } from "./interfaces/settings.interface";

export class Settings implements SettingsInterface {
  collectType: CollectType = CollectType.Default;
  defaultValidator?: MapperValidator<BaseMapperValidator, any>;

  get isCollectDI() {
    return this.collectType === CollectType.DI;
  }

  accessOnlyType(type: CollectType) {
    if (this.collectType !== type) {
      throw new Error(
        `Функция доступна только при использовании ${type} типа сборки`,
      );
    }
  }

  update(value: Partial<SettingsInterface>) {
    if (value.collectType) {
      this.collectType = value.collectType;
    }

    this.defaultValidator = value.defaultValidator;
  }

  static createDefault() {
    return new Settings();
  }
}
