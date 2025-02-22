import { PropertyRule } from "./property-rule";
import { RuleError } from "../../errors/rule/rule.error";
import { RuleErrorHelper } from "../../errors/rule/rule.error.helper";

export class PropertiesRuleStore {
  private store = new Map<string, Map<string, PropertyRule>>();
  private flatStoreCache: Array<PropertyRule> = [];

  isEmpty() {
    return this.store.size == 0;
  }

  addRule(
    propertyFrom: string,
    propertyTo: string,
    transform?: (...arg: any[]) => any,
  ) {
    this.initialFromState(propertyFrom);

    const fromState = this.store.get(propertyFrom) as Map<string, PropertyRule>;
    if (fromState.has(propertyTo)) {
      throw new RuleError(
        RuleErrorHelper.alredyAdded(propertyFrom, propertyTo),
      );
    }

    const newRule = new PropertyRule(propertyFrom, propertyTo, transform);
    this.updateStore(fromState, newRule);

    return newRule;
  }

  getPropertyRules(): Array<PropertyRule> {
    return this.flatStoreCache;
  }

  private initialFromState(propertyFrom: string) {
    if (!this.store.has(propertyFrom)) {
      this.store.set(propertyFrom, new Map<string, PropertyRule>());
    }
  }

  private updateStore(
    fromState: Map<string, PropertyRule>,
    newRule: PropertyRule,
  ) {
    fromState.set(newRule.propertyTo, newRule);
    this.flatStoreCache.push(newRule);
  }
}
