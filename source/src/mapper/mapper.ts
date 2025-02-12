import { RuleStore } from "../rule/rule-store";
import {ConstructorType} from "../utility-types";
import {ProfileMapper} from "./interfaces/profile-mapper.interface";
import {MapRule} from "../rule/map-rule";
import {plainToInstance} from "class-transformer";

export class Mapper implements ProfileMapper {
    private store = new RuleStore();

    addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        return this.store.addRule(from, to);
    }

    getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        return this.store.getRule(from, to);
    }

    map<V extends F, F, T>(values: V[], from: ConstructorType<F>, to: ConstructorType<T>): Promise<T[]>
    map<V extends F, F, T>(values: V, from: ConstructorType<F>, to: ConstructorType<T>): Promise<T>
    map<V extends F, F, T>(values: V | V[], from: ConstructorType<F>, to: ConstructorType<T>): Promise<T> | Promise<T[]> {
        const rule = this.getRule(from, to);
        return !Array.isArray(values) ? this.mapSingle(rule, values) : Promise.all(values.map(value => this.mapSingle(rule, value)));
    }

    defineMap<V extends Object, T>(values: V[], to: ConstructorType<T>): Promise<T[]>
    defineMap<V extends Object, T>(values: V, to: ConstructorType<T>): Promise<T>
    defineMap<V extends Object, T>(values: V | V[], to: ConstructorType<T>): Promise<T> | Promise<T[]> {
        const isArray = Array.isArray(values);

        if(isArray && !values.length) {
            return new Promise<T[]>((resolve, reject) => resolve([]));
        }

        const constructor = isArray ? values[0].constructor : values.constructor;
        if(constructor === Object) {
            throw Error("Объект не является классом");
        }

        // @ts-ignore
        return this.map(values, constructor, to);
    }

    private async mapSingle<F, T, V extends F>(rule: MapRule<F, T>, value: V) {
        const raw = plainToInstance(rule.toConstructor, {})

        for(let propertyRule of rule.propertiesStore.getPropertyRules()) {
            if(propertyRule.isExistTransform) {
                // @ts-ignore
                raw[propertyRule.propertyTo] = await propertyRule.transform(value[propertyRule.propertyFrom], value, raw);
                continue;
            }

            // @ts-ignore
            raw[propertyRule.propertyTo] = value[propertyRule.propertyFrom];
        }


        //plainToInstance(Person, plainPerson, { excludeExtraneousValues: true })
        // TODO Реализовать маппинг по правилу
        return raw as T;
    }
}
