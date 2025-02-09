import { RuleStore } from "../rule/rule-store";
import {ConstructorType} from "../utility-types";
import {ProfileMapper} from "./interfaces/profile-mapper.interface";
import {MapRule} from "../rule/map-rule";

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
        return !Array.isArray(values) ? this.mapSingle(rule, values) : values.map(value => this.mapSingle(rule, value));
    }

    private mapSingle<F, T, V extends F>(rule: MapRule<F, T>, value: V) {
        //plainToInstance(Person, plainPerson, { excludeExtraneousValues: true })
        // TODO Реализовать маппинг по правилу
        return {} as T;
    }
}
