import { CollectType } from "./enums/collect-type.enum";
import { SettingsInterface } from "./interfaces/settings.interface";

export class Settings implements SettingsInterface {
  collectType: CollectType = CollectType.Default;

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
  }

  static createDefault() {
    return new Settings();
  }
}
