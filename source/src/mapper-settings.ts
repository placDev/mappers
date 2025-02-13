import { Mapper } from "./mapper/mapper";
import {ProfileStore} from "./profile/profile-store";
import {ConstructorType} from "./utility-types";
import {BaseMapperProfile} from "./profile/base-mapper-profile";

export class MapperSettings {
    private constructor() {}

    private static mapper = new Mapper();
    private static profiles = new ProfileStore();

    static addProfile(constructor: ConstructorType<BaseMapperProfile>) {
        this.profiles.addProfile(constructor);
    }

    static collectRules() {
        if(!this.profiles.instancesIsExists) {
            this.profiles.createInstances();
        }

        this.profiles.instances.forEach(instance => instance.define(this.mapper));
    }

    static getMapper() {
        return this.mapper;
    }
}