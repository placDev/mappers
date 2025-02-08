import {Options} from "./options";
import {ClassFields, ConstructorType, NonPrimitive} from "../utility-types";

export class MapRule<From, To> {
    constructor(from: ConstructorType<From>, to: ConstructorType<To>) {
    }

    settings(value: Options) {
        return this;
    }

    autoMapPrimitive(value: boolean = true): MapRule<From, To> {
        return this;
    }

    setToken(value: string | number | Symbol) {
        return this;
    }

    property<C>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => C): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<V>): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => V): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<V> | V) {
        return this;
    }

    complex<C, V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => C): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<N>): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => N): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<N> | N) {
        return this;
    }

    complexWithRule<Z, D>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => Z, propertyTo: (value: NonPrimitive<ClassFields<To>>) => D, rule: MapRule<Z, D>): MapRule<From, To> {
        return this;
    }
}