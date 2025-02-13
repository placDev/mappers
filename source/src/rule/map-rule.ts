import { Options } from "./options";
import {
    CallConstructorCallback,
    CallConstructorCallbackAsync,
    ClassFields,
    ConstructorType,
    NonPrimitive
} from "../utility-types";
import {PropertiesRuleStore} from "./properties/properties-rule-store";
import {ComplexityRuleStore} from "./complexity/complexity-rule-store";

export class MapRule<From, To> {
    propertiesStore = new PropertiesRuleStore();
    complexityStore = new ComplexityRuleStore();


    private from: ConstructorType<From>;
    private to: ConstructorType<To>;

    constructor(from: ConstructorType<From>, to: ConstructorType<To>) {
        this.from = from;
        this.to = to;
    }

    settings(value: Options) {
        return this;
    }
    
    callConstructor<ToConstructor extends ConstructorType<To>>(toConstructor: ToConstructor, callConstructorCallback: CallConstructorCallback<ToConstructor>): MapRule<From, To>;
    callConstructor<ToConstructor extends ConstructorType<To>>(toConstructor: ToConstructor, callConstructorCallback: CallConstructorCallbackAsync<ToConstructor>): MapRule<From, To>;
    callConstructor<ToConstructor extends ConstructorType<To>>(toConstructor: ToConstructor, callConstructorCallback: CallConstructorCallback<ToConstructor> | CallConstructorCallbackAsync<ToConstructor>) {
        return this;
    }

    autoMapPrimitive(value: boolean = true): MapRule<From, To> {
        return this;
    }

    setToken(value: string | number | Symbol) {
        return this;
    }

    property<C>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => C): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (property: C, from: From, to: To) => Promise<V>): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (property: C, from: From, to: To) => V): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (property: C, from: From, to: To) => Promise<V> | V) {
        this.propertiesStore.addRule(
            this.getPropertyName(propertyFrom),
            this.getPropertyName(propertyTo),
            transform
        );

        return this;
    }

    complex<C, V extends C>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform: (property: C, from: From, to: To) => Promise<N>): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform: (property: C, from: From, to: To) => N): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (property: C, from: From, to: To) => Promise<N> | N) {
        this.complexityStore.addRule(
            this.getPropertyName(propertyFrom),
            this.getPropertyName(propertyTo),
            transform
        );

        return this;
    }

    withRule<Z, D>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => Z, propertyTo: (value: NonPrimitive<ClassFields<To>>) => D, rule: MapRule<Z, D>): MapRule<From, To> {
        this.complexityStore.addRule(
            this.getPropertyName(propertyFrom),
            this.getPropertyName(propertyTo),
            undefined,
            rule
        );

        return this;
    }

    get toConstructor() {
        return this.to;
    }

    private getPropertyName(propertyFunction: (value: any) => any): string {
        const handler = {
            get(target: any, prop: string | symbol) {
                return prop;
            }
        };

        const proxy = new Proxy({}, handler);
        return propertyFunction(proxy);
    }
}