import { BaseMapperProfile } from "./base-mapper-profile";
import { ConstructorType } from "../utility-types";

export class ProfileStore {
    instances: BaseMapperProfile[] = [];
    private profiles: ConstructorType<BaseMapperProfile>[] = [];

    get instancesIsExists() {
        return !!this.instances.length;
    }

    addProfile(constructor: ConstructorType<BaseMapperProfile>) {
        this.profiles.push(constructor);
    }

    createInstances() {
        this.instances = this.profiles.map(constructor => new constructor());
    }
}