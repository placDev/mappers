import { RuleStore } from "../rule/rule-store";
import { ConstructorType, MapperValidatorType } from "../utility-types";
import { ProfileMapperInterface } from "./interfaces/profile-mapper.interface";
import { MapRule } from "../rule/map-rule";
import { plainToInstance } from "class-transformer";
import { PropertyRule } from "../rule/properties/property-rule";
import { ComplexRule } from "../rule/complexity/complex-rule";
import { Cloner } from "../utils/cloner";
import { ProxyRule } from "../rule/proxy-rule";
import { FillRule } from "../rule/fill/fill-rule";
import { MapperInterface } from "./interfaces/mapper.interface";
import { NotPrototypeObjectError } from "../errors/not-prototype-object.error";

export class Mapper implements MapperInterface, ProfileMapperInterface {
  private store = new RuleStore();

  addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
    return this.store.addRule(from, to);
  }

  withRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
    return new ProxyRule(from, to);
  }

  getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
    return this.store.getRule(from, to);
  }

  map<V extends F, F, T>(
    values: V[],
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): Promise<T[]>;
  map<V extends F, F, T>(
    values: V,
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): Promise<T>;
  map<V extends F, F, T>(
    values: V | V[],
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): Promise<T> | Promise<T[]> {
    const rule = this.getRule(from, to);

    const validatorInstance = this.getValidatorInstance(rule);
    return !Array.isArray(values)
      ? this.mapSingle(rule, values, validatorInstance)
      : Promise.all(
          values.map((value) => this.mapSingle(rule, value, validatorInstance)),
        );
  }

  autoMap<V extends object, T>(
    values: V[],
    to: ConstructorType<T>,
  ): Promise<T[]>;
  autoMap<V extends object, T>(values: V, to: ConstructorType<T>): Promise<T>;
  autoMap<V extends object, T>(
    values: V | V[],
    to: ConstructorType<T>,
  ): Promise<T> | Promise<T[]> {
    if (Array.isArray(values) && !values.length) {
      return new Promise<T[]>((resolve, _reject) => resolve([]));
    }

    this.checkObjectsIsNotAnonymous(values);

    // @ts-ignore
    const constructor = Array.isArray(values)
      ? values[0].constructor
      : values.constructor;
    // @ts-ignore
    return this.map(values, constructor, to);
  }

  private async mapSingle<F, T, V extends F>(
    rule: MapRule<F, T>,
    value: V,
    validatorInstance?: MapperValidatorType<any, any>,
  ) {
    const raw = await this.createInstance(rule, value);

    if (!rule.propertiesStore.isEmpty()) {
      await this.fillProperties(
        raw,
        rule.propertiesStore.getPropertyRules(),
        value,
      );
    }

    if (!rule.complexityStore.isEmpty()) {
      await this.fillComplexity(
        raw,
        rule.complexityStore.getComplexRules(),
        value,
      );
    }

    if (!rule.fillStore.isEmpty()) {
      await this.invokeFill(raw, rule.fillStore.getFillRules(), value);
    }

    if (validatorInstance) {
      await validatorInstance.validate(raw);
    }

    return raw as T;
  }

  private checkObjectsIsNotAnonymous<V extends object>(values: V | V[]) {
    if (
      Array.isArray(values)
        ? values.some((x) => x.constructor === Object)
        : values.constructor === Object
    ) {
      throw new NotPrototypeObjectError();
    }
  }

  private async createInstance<F, T, V extends F>(
    rule: MapRule<F, T>,
    value: V,
  ) {
    //plainToInstance(Person, plainPerson, { excludeExtraneousValues: true })
    if (rule.constructorRule.isEnabled()) {
      return await rule.constructorRule.invokeCreateFunction(value);
    }

    return plainToInstance(rule.toConstructor, {});
  }

  private async fillProperties(
    raw: any,
    propertyRules: PropertyRule[],
    value: any,
  ) {
    for (const propertyRule of propertyRules) {
      if (propertyRule.isExistTransform) {
        // @ts-ignore
        raw[propertyRule.propertyTo] = await propertyRule.transform(
          value[propertyRule.propertyFrom],
          value,
          raw,
        );
        continue;
      }

      // @ts-ignore
      raw[propertyRule.propertyTo] = value[propertyRule.propertyFrom];
    }
  }

  private async fillComplexity(
    raw: any,
    complexRules: ComplexRule[],
    value: any,
  ) {
    for (const complexRule of complexRules) {
      if (complexRule.isExistTransform) {
        raw[complexRule.propertyTo] = await complexRule.transform!(
          value[complexRule.propertyFrom],
          value,
          raw,
        );
        continue;
      }

      if (complexRule.isExistRule) {
        const rule = this.store.getRule(
          complexRule.rule!.getFrom(),
          complexRule.rule!.getTo(),
        );
        raw[complexRule.propertyTo] = await this.mapSingle(
          rule,
          value[complexRule.propertyFrom],
          this.getValidatorInstance(rule),
        );
        continue;
      }

      // @ts-ignore
      raw[complexRule.propertyTo] = Cloner.deep(
        value[complexRule.propertyFrom],
      );
    }
  }

  private async invokeFill(raw: any, fillRules: FillRule[], value: any) {
    for (const fillRule of fillRules) {
      // @ts-ignore
      raw[fillRule.propertyTo] = await fillRule.transform(value, raw);
    }
  }

  private getValidatorInstance(rule: MapRule<any, any>) {
    const validatorRule = rule.validatorRule;
    return validatorRule.getEnabled()
      ? validatorRule.getValidator()
      : undefined;
  }
}
