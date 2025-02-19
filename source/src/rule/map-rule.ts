import { Options } from "./options";
import {
  CallConstructorCallback,
  ClassFields,
  ConstructorType,
  IntersectionProperties,
  IntersectionProperty,
  NonPrimitive,
  Primitive,
  MapperValidator,
  NotVoid,
} from "../utility-types";
import { PropertiesRuleStore } from "./properties/properties-rule-store";
import { ComplexityRuleStore } from "./complexity/complexity-rule-store";
import { ProxyRule } from "./proxy-rule";
import { ConstructorRule } from "./constructor/constructor-rule";
import { FillRuleStore } from "./fill/fill-rule-store";
import { BaseMapperValidator } from "./validator/base-mapper-validator";
import { ValidatorRule } from "./validator/validator-rule";
import { MapperSettings } from "../settings/mapper-settings";

export class MapRule<From, To> {
  propertiesStore = new PropertiesRuleStore();
  complexityStore = new ComplexityRuleStore();
  fillStore = new FillRuleStore();

  constructorRule: ConstructorRule<To>;
  validatorRule = new ValidatorRule();

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

  callConstructor(): MapRule<From, To>;
  callConstructor<ToConstructor extends ConstructorType<To>>(
    toConstructor: ToConstructor,
    callConstructorCallback: CallConstructorCallback<ToConstructor, From>,
  ): MapRule<From, To>;
  callConstructor<ToConstructor extends ConstructorType<To>>(
    toConstructor?: ToConstructor,
    callConstructorCallback?: CallConstructorCallback<ToConstructor, From>,
  ) {
    this.constructorRule.setEnabled();

    if (!toConstructor && !callConstructorCallback) {
      return this;
    }

    this.constructorRule.setCreateFunction(callConstructorCallback!);

    return this;
  }

  properties(
    intersectionCallback: (
      intersection: IntersectionProperties<ClassFields<From>, ClassFields<To>>,
    ) => IntersectionProperty[],
  ): MapRule<From, To> {
    const propertyNames = this.getPropertyNames(intersectionCallback);
    for (const name of propertyNames) {
      this.propertiesStore.addRule(name, name);
      this.addCacheToFillSore(name);
    }

    return this;
  }

  setToken(value: string | number | symbol) {
    return this;
  }

  property<C>(
    propertyFrom: (value: Primitive<ClassFields<From>>) => C,
    propertyTo: (value: Primitive<ClassFields<To>>) => C,
  ): MapRule<From, To>;
  property<C, V>(
    propertyFrom: (value: Primitive<ClassFields<From>>) => C,
    propertyTo: (value: Primitive<ClassFields<To>>) => V,
    transform?: (property: C, from: From, to: To) => Promise<NotVoid<V>>,
  ): MapRule<From, To>;
  property<C, V>(
    propertyFrom: (value: Primitive<ClassFields<From>>) => C,
    propertyTo: (value: Primitive<ClassFields<To>>) => V,
    transform?: (property: C, from: From, to: To) => NotVoid<V>,
  ): MapRule<From, To>;
  property<C, V>(
    propertyFrom: (value: Primitive<ClassFields<From>>) => C,
    propertyTo: (value: Primitive<ClassFields<To>>) => V,
    transform?: (
      property: C,
      from: From,
      to: To,
    ) => Promise<NotVoid<V>> | NotVoid<V>,
  ) {
    const propertyToName = this.getPropertyName(propertyTo);
    this.propertiesStore.addRule(
      this.getPropertyName(propertyFrom),
      propertyToName,
      transform,
    );

    this.addCacheToFillSore(propertyToName);

    return this;
  }

  complex<C, V extends C>(
    propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C,
    propertyTo: (value: NonPrimitive<ClassFields<To>>) => V,
  ): MapRule<From, To>;
  complex<C, V, N extends V>(
    propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C,
    propertyTo: (value: NonPrimitive<ClassFields<To>>) => V,
    transform: (property: C, from: From, to: To) => Promise<NotVoid<N>>,
  ): MapRule<From, To>;
  complex<C, V, N extends V>(
    propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C,
    propertyTo: (value: NonPrimitive<ClassFields<To>>) => V,
    transform: (property: C, from: From, to: To) => NotVoid<N>,
  ): MapRule<From, To>;
  complex<C, V, N extends V>(
    propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C,
    propertyTo: (value: NonPrimitive<ClassFields<To>>) => V,
    transform?: (
      property: C,
      from: From,
      to: To,
    ) => Promise<NotVoid<N>> | NotVoid<N>,
  ) {
    const propertyToName = this.getPropertyName(propertyTo);
    this.complexityStore.addRule(
      this.getPropertyName(propertyFrom),
      propertyToName,
      transform,
    );

    this.addCacheToFillSore(propertyToName);

    return this;
  }

  byRule<Z, D>(
    propertyFrom: (value: NonPrimitive<ClassFields<From>>) => Z,
    propertyTo: (value: NonPrimitive<ClassFields<To>>) => D,
    rule: ProxyRule<Z, D>,
  ): MapRule<From, To> {
    const propertyToName = this.getPropertyName(propertyTo);
    this.complexityStore.addRule(
      this.getPropertyName(propertyFrom),
      propertyToName,
      undefined,
      rule,
    );

    this.addCacheToFillSore(propertyToName);

    return this;
  }

  fill<Z>(
    propertyTo: (value: ClassFields<To>) => Z,
    transform: (from: From, to: To) => Promise<NotVoid<Z>> | NotVoid<Z>,
  ) {
    this.fillStore.addRule(this.getPropertyName(propertyTo), transform);

    return this;
  }

  validate<T extends BaseMapperValidator>(validator?: MapperValidator<T, To>) {
    if (
      validator === undefined &&
      MapperSettings.getValidatorStore().isDefaultValidatorEmpty
    ) {
      throw new Error(
        `Не определен дефолтный валидатор или валидатор для правила ${this.from.name} и ${this.from.name}`,
      );
    }

    this.validatorRule.setEnabled();
    if (validator) {
      this.validatorRule.setValidatorConstructor(validator);
    }

    return this;
  }

  private addCacheToFillSore(propertyTo: string) {
    this.fillStore.addToCache(propertyTo);
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
      },
    };

    return new Proxy({}, handler);
  }
}
