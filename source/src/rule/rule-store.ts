import { ConstructorType } from "../utility-types";
import { MapRule } from "./map-rule";
import { RuleError } from "../errors/rule/rule.error";
import { RuleErrorHelper } from "../errors/rule/rule.error.helper";

export class RuleStore {
  private store = new Map<
    ConstructorType,
    Map<ConstructorType, MapRule<any, any>>
  >();

  addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
    this.initialFromState(from);

    const fromState = this.store.get(from) as Map<
      ConstructorType,
      MapRule<any, any>
    >;
    if (fromState.has(to)) {
      throw new RuleError(RuleErrorHelper.alredyAdded(from.name, to.name));
    }

    const newRule = new MapRule(from, to);
    fromState.set(to, newRule);

    return newRule;
  }

  getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
    const fromState = this.store.get(from);
    if (!fromState) {
      throw new RuleError(RuleErrorHelper.fromNotFound(from.name));
    }

    if (!fromState.has(to)) {
      throw new RuleError(RuleErrorHelper.toInFromNotFound(from.name, to.name));
    }

    return fromState.get(to) as MapRule<F, T>;
  }

  private initialFromState(from: ConstructorType) {
    if (!this.store.has(from)) {
      this.store.set(from, new Map<ConstructorType, MapRule<any, any>>());
    }
  }
}
