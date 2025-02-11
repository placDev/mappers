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

    private async mapSingle<F, T, V extends F>(rule: MapRule<F, T>, value: V) {
        const raw = plainToInstance(rule.toConstructor, {})

        for(let propertyRule of rule.propertiesStore.getPropertyRules()) {
            if(propertyRule.isExistTransform) {
                // @ts-ignore
                const propertyValue = value[propertyRule.propertyFrom];
                const fromValue = value;
                const toValue = raw;
                // @ts-ignore
                raw[propertyRule.propertyTo] = await propertyRule.transform(propertyValue, fromValue, toValue);
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
