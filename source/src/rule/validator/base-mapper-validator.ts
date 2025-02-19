import { MapperSettings } from "../../settings/mapper-settings";

export abstract class BaseMapperValidator {
  constructor() {
    if (MapperSettings.settings.isCollectDI) {
      MapperSettings.addCustomValidatorInstance(this);
    }
  }
  abstract validate(item: any): Promise<void>;
}
