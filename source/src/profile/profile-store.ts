import { BaseMapperProfile } from "./base-mapper-profile";
import { ConstructorType } from "../utility-types";
import { ProfileError } from "../errors/profile/profile.error";
import { ProfileErrorHelper } from "../errors/profile/profile.error.helper";

export class ProfileStore {
  instances = new Map<ConstructorType<BaseMapperProfile>, BaseMapperProfile>();
  private profiles: ConstructorType<BaseMapperProfile>[] = [];

  get instancesIsExists() {
    return this.instances.size == this.profiles.length;
  }

  addProfile(constructor: ConstructorType<BaseMapperProfile>) {
    this.profiles.push(constructor);
  }

  addProfileInstance(instance: BaseMapperProfile) {
    this.validateProfileInstance(instance);

    this.instances.set(
      instance.constructor as ConstructorType<BaseMapperProfile>,
      instance,
    );
  }

  createInstances() {
    this.instances.clear();
    this.profiles.forEach((constructor) =>
      this.instances.set(constructor, new constructor()),
    );
  }

  private validateProfileInstance(instance: BaseMapperProfile) {
    if (!(instance instanceof BaseMapperProfile)) {
      throw new ProfileError(ProfileErrorHelper.notExtendsProfile());
    }

    // @ts-ignore
    if (this.instances.has(instance.constructor)) {
      throw new ProfileError(
        ProfileErrorHelper.alredyCreated(instance.constructor.name),
      );
    }
  }
}
