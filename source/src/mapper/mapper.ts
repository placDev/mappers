import { RuleStore } from "../rule/rule-store";
import {ConstructorType} from "../utility-types";
import {ProfileMapper} from "./interfaces/profile-mapper.interface";

export class Mapper implements ProfileMapper {
    private store = new RuleStore();

    addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        return this.store.addRule(from, to);
    }

    getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        return this.store.getRule(from, to);
    }

    map<V extends F, F, T>(values: V[], from: ConstructorType<F>, to: ConstructorType<T>): T[]
    map<V extends F, F, T>(values: V, from: ConstructorType<F>, to: ConstructorType<T>): T
    map<V extends F, F, T>(values: V | V[], from: ConstructorType<F>, to: ConstructorType<T>): T | T[] {
        const rule = this.getRule(from, to);

        throw new Error();
    }
}
