import { ProfileMapper } from "../mapper/interfaces/profile-mapper.interface";

export abstract class BaseMapperProfile {
  abstract define(mapper: ProfileMapper): Promise<void>;
}
