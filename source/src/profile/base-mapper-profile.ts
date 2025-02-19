import { ProfileMapper } from "../mapper/interfaces/profile-mapper.interface";
import { MapperSettings } from "../settings/mapper-settings";

export abstract class BaseMapperProfile {
  constructor() {
    if (MapperSettings.settings.isCollectDI) {
      MapperSettings.addProfileInstance(this);
    }
  }

  abstract define(mapper: ProfileMapper): Promise<void>;
}
