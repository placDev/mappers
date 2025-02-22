import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";
import { MapperValidator } from "../utility-types";
import { CollectType } from "./enums/collect-type.enum";
import { SettingsInterface } from "./interfaces/settings.interface";
import { SettingsError } from "../errors/settings/settings.error";
import { SettingsErrorHelper } from "../errors/settings/settings.error.helper";

export class Settings implements SettingsInterface {
  collectType: CollectType = CollectType.Default;
  defaultValidator?: MapperValidator<BaseMapperValidator, any>;

  get isCollectDI() {
    return this.collectType === CollectType.DI;
  }

  accessOnlyType(type: CollectType) {
    if (this.collectType !== type) {
      throw new SettingsError(SettingsErrorHelper.accessOnlyType(type));
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
