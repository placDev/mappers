import { Options } from "./options";
import {
    CallConstructorCallback,
    ClassFields,
    ConstructorType, IntersectionProperties, IntersectionProperty,
    NonPrimitive, Primitive
} from "../utility-types";
import {PropertiesRuleStore} from "./properties/properties-rule-store";
import {ComplexityRuleStore} from "./complexity/complexity-rule-store";
import {ProxyRule} from "./proxy-rule";
import {ConstructorRule} from "./constructor/constructor-rule";

export class MapRule<From, To> {
    propertiesStore = new PropertiesRuleStore();
    complexityStore = new ComplexityRuleStore();
    constructorRule: ConstructorRule<To>;

    private from: ConstructorType<From>;
    private to: ConstructorType<To>;

    get toConstructor() {
        return this.to;
    }

    constructor(from: ConstructorType<From>, to: ConstructorType<To>) {
        this.from = from;
        this.to = to;

        this.constructorRule = new ConstructorRule(this.to);
    }

    settings(value: Options) {
        return this;
    }

    callConstructor(): MapRule<From, To>;
    callConstructor<ToConstructor extends ConstructorType<To>>(toConstructor: ToConstructor, callConstructorCallback: CallConstructorCallback<ToConstructor, From>): MapRule<From, To>;
    callConstructor<ToConstructor extends ConstructorType<To>>(toConstructor?: ToConstructor, callConstructorCallback?: CallConstructorCallback<ToConstructor, From>) {
        this.constructorRule.setEnabled();

        if(!toConstructor && !callConstructorCallback) {
            return this;
        }

        this.constructorRule.setCreateFunction(callConstructorCallback!);

        return this;
    }

    properties(intersectionCallback: (intersection: IntersectionProperties<ClassFields<From>, ClassFields<To>>) => IntersectionProperty[]): MapRule<From, To> {
        const properties = this.getPropertyNames(intersectionCallback);
        for (const property of properties) {
            this.propertiesStore.addRule(property, property)
        }

        return this;
    }

    setToken(value: string | number | Symbol) {
        return this;
    }

    property<C>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => C): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => V, transform?: (property: C, from: From, to: To) => Promise<V>): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => V, transform?: (property: C, from: From, to: To) => V): MapRule<From, To>;
    property<C, V>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => V, transform?: (property: C, from: From, to: To) => Promise<V> | V) {
        this.propertiesStore.addRule(
            this.getPropertyName(propertyFrom),
            this.getPropertyName(propertyTo),
            transform
        );

        return this;
    }

    complex<C, V extends C>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V, transform: (property: C, from: From, to: To) => Promise<N>): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V, transform: (property: C, from: From, to: To) => N): MapRule<From, To>;
    complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V, transform?: (property: C, from: From, to: To) => Promise<N> | N) {
        this.complexityStore.addRule(
            this.getPropertyName(propertyFrom),
            this.getPropertyName(propertyTo),
            transform
        );

        return this;
    }

    byRule<Z, D>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => Z, propertyTo: (value: NonPrimitive<ClassFields<To>>) => D, rule: ProxyRule<Z, D>): MapRule<From, To> {
        this.complexityStore.addRule(
            this.getPropertyName(propertyFrom),
            this.getPropertyName(propertyTo),
            undefined,
            rule
        );

        return this;
    }

    validate() {
        return this;
    }

    private getPropertyNames(propertyFunction: (value: any) => any): string[] {
        return propertyFunction(this.getProxyObjectForPropertyNames()) as string[];
    }

    private getPropertyName(propertyFunction: (value: any) => any): string {
        return propertyFunction(this.getProxyObjectForPropertyNames()) as string;
    }

    private getProxyObjectForPropertyNames() {
        const handler = {
            get(target: any, prop: string | symbol) {
                return prop;
            }
        };

        return new Proxy({}, handler);
    }
}