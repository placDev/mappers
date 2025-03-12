import { Mapper } from "../mapper/mapper";
import { ProfileStore } from "../profile/profile-store";
import { ConstructorType } from "../utility-types";
import { BaseMapperProfile } from "../profile/base-mapper-profile";
import { SettingsValidatorStore } from "./settings-validator-store";
import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";
import { Settings } from "./settings";
import { CollectType } from "./enums/collect-type.enum";
import { SettingsInterface } from "./interfaces/settings.interface";
import { MapperInterface } from "../mapper/interfaces/mapper.interface";

export class MapperSettings {
  private constructor() {}
  static settings = Settings.createDefault();

  private static mapper = new Mapper();
  private static profiles = new ProfileStore();
  private static validators = new SettingsValidatorStore(this.settings);

  static setSettings(settings: Partial<SettingsInterface>) {
    this.settings.update(settings);
  }

  static addProfile(constructor: ConstructorType<BaseMapperProfile>) {
    this.settings.accessOnlyType(CollectType.Default);
    this.profiles.addProfile(constructor);
  }

  static collectProfiles() {
    this.settings.accessOnlyType(CollectType.Default);
    if (!this.profiles.instancesIsExists) {
      this.profiles.createInstances();
    }

    this.defineProfiles();
  }

  static collectProfileInstances() {
    this.settings.accessOnlyType(CollectType.DI);
    this.defineProfiles();
  }

  static addProfileInstance(instance: BaseMapperProfile) {
    this.settings.accessOnlyType(CollectType.DI);
    this.profiles.addProfileInstance(instance);
  }

  static addCustomValidatorInstance(instance: BaseMapperValidator) {
    this.settings.accessOnlyType(CollectType.DI);
    this.validators.addValidatorInstance(instance);
  }

  static getMapper(): MapperInterface {
    return this.mapper as MapperInterface;
  }

  static getValidatorStore() {
    return this.validators;
  }

  private static defineProfiles() {
    this.profiles.instances.forEach((instance) => instance.define(this.mapper));
  }
}
