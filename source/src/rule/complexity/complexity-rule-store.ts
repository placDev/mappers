import { ComplexRule } from "./complex-rule";
import { ProxyRule } from "../proxy-rule";
import { RuleError } from "../../errors/rule/rule.error";
import { RuleErrorHelper } from "../../errors/rule/rule.error.helper";

export class ComplexityRuleStore {
  private store = new Map<string, Map<string, ComplexRule>>();
  private flatStoreCache: Array<ComplexRule> = [];

  isEmpty() {
    return this.store.size == 0;
  }

  addRule(
    propertyFrom: string,
    propertyTo: string,
    transform?: (...arg: any[]) => any,
    rule?: ProxyRule<any, any>,
  ) {
    this.initialFromState(propertyFrom);

    const fromState = this.store.get(propertyFrom) as Map<string, ComplexRule>;
    if (fromState.has(propertyTo)) {
      throw new RuleError(
        RuleErrorHelper.alredyAdded(propertyFrom, propertyTo),
      );
    }

    const newRule = new ComplexRule(propertyFrom, propertyTo, transform, rule);
    this.updateStore(fromState, newRule);

    return newRule;
  }

  getComplexRules(): Array<ComplexRule> {
    return this.flatStoreCache;
  }

  private initialFromState(propertyFrom: string) {
    if (!this.store.has(propertyFrom)) {
      this.store.set(propertyFrom, new Map<string, ComplexRule>());
    }
  }

  private updateStore(
    fromState: Map<string, ComplexRule>,
    newRule: ComplexRule,
  ) {
    fromState.set(newRule.propertyTo, newRule);
    this.flatStoreCache.push(newRule);
  }
}
