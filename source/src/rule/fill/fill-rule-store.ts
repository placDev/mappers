import { FillRule } from "./fill-rule";
import { FillError } from "../../errors/fill/fill.error";
import { FillErrorHelper } from "../../errors/fill/fill.error.helper";

export class FillRuleStore {
  private propertiesToCache = new Set<string>();
  private store = new Map<string, FillRule>();

  isEmpty() {
    return this.store.size == 0;
  }

  addToCache(propertyTo: string) {
    this.propertiesToCache.add(propertyTo);
  }

  addRule(propertyTo: string, filler: (...arg: any[]) => any) {
    if (this.propertiesToCache.has(propertyTo)) {
      throw new FillError(
        FillErrorHelper.alredyExistInPropertiesOrComplexity(propertyTo),
      );
    }

    if (this.store.has(propertyTo)) {
      throw new FillError(FillErrorHelper.alredyAdded(propertyTo));
    }

    const newRule = new FillRule(propertyTo, filler);
    this.store.set(propertyTo, newRule);

    return newRule;
  }

  getFillRules(): Array<FillRule> {
    return [...this.store.values()];
  }
}
