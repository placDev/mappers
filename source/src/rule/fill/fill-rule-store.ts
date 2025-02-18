import { FillRule } from "./fill-rule";

export class FillRuleStore {
  private propertiesToCache = new Set<string>();
  private store = new Map<string, FillRule>();

  isEmpty() {
    return this.store.size == 0;
  }

  addToCache(propertyTo: string) {
    this.propertiesToCache.add(propertyTo);
  }

  addRule(propertyTo: string, transform: (...arg: any[]) => any) {
    if (this.propertiesToCache.has(propertyTo)) {
      throw new Error(
        `Для свойства ${propertyTo} уже определено правило в properties или complexity`,
      );
    }

    if (this.store.has(propertyTo)) {
      throw new Error(
        `Правило для свойства ${propertyTo} уже добавленно в маппер`,
      );
    }

    const newRule = new FillRule(propertyTo, transform);
    this.store.set(propertyTo, newRule);

    return newRule;
  }

  getFillRules(): Array<FillRule> {
    return [...this.store.values()];
  }
}
