import { Mapper } from "../mapper/mapper";
import { ProfileStore } from "../profile/profile-store";
import { ConstructorType, MapperValidator } from "../utility-types";
import { BaseMapperProfile } from "../profile/base-mapper-profile";
import { SettingsValidatorStore } from "./settings-validator-store";
import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";

export class MapperSettings {
  private constructor() {}

  private static mapper = new Mapper();
  private static profiles = new ProfileStore();
  private static validatorStore = new SettingsValidatorStore();

  static addProfile(constructor: ConstructorType<BaseMapperProfile>) {
    this.profiles.addProfile(constructor);
  }

  static collectRules() {
    if (!this.profiles.instancesIsExists) {
      this.profiles.createInstances();
    }

    this.profiles.instances.forEach((instance) => instance.define(this.mapper));
  }

  static collectCreatedInstances(instances: BaseMapperProfile[]) {
    instances.forEach((instance) => instance.define(this.mapper));
  }

  static getMapper() {
    return this.mapper;
  }

  static setDefaultValidator<T extends BaseMapperValidator>(
    validator: MapperValidator<T, any>,
  ) {
    return this.validatorStore.setDefaultValidator(validator);
  }

  static getValidatorStore() {
    return this.validatorStore;
  }
}
