import { ComplexRule } from "./complex-rule";
import { ProxyRule } from "../proxy-rule";
import { RuleError } from "../../errors/rule/rule.error";
import { RuleErrorHelper } from "../../errors/rule/rule.error.helper";

export class ComplexityRuleStore {
  private store = new Map<string, Map<string, ComplexRule>>();

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
    fromState.set(propertyTo, newRule);

    return newRule;
  }

  getComplexRules(): Array<ComplexRule> {
    return [...this.store.values()].flatMap((x) => [...x.values()]);
  }

  private initialFromState(propertyFrom: string) {
    if (!this.store.has(propertyFrom)) {
      this.store.set(propertyFrom, new Map<string, ComplexRule>());
    }
  }
}
