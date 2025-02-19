import { BaseMapperProfile } from "./base-mapper-profile";
import { ConstructorType } from "../utility-types";

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
      throw new Error(`Объект не является наследником BaseMapperProfile`);
    }

    // @ts-ignore
    if (this.instances.has(instance.constructor)) {
      throw new Error(
        `Экземпляр профиля ${instance.constructor.name} уже создан`,
      );
    }
  }
}
