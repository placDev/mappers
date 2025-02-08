import {ConstructorType} from "../../utility-types";
import {MapRule} from "../../rule/map-rule";

export interface ProfileMapper {
    addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>): MapRule<F, T>;
    getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>): MapRule<F, T>;
}