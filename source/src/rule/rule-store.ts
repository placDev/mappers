import { ConstructorType } from "../utility-types";
import { MapRule } from "./map-rule";

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
      throw new Error("Данное правило уже добавленно в маппер");
    }

    const newRule = new MapRule(from, to);
    fromState.set(to, newRule);

    return newRule;
  }

  getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
    const fromState = this.store.get(from);
    if (!fromState) {
      throw new Error(`Правила для ${from.name} не найдены`);
    }

    if (!fromState.has(to)) {
      throw new Error(`Правило для ${from.name} и ${to.name} не найдено`);
    }

    return fromState.get(to) as MapRule<F, T>;
  }

  private initialFromState(from: ConstructorType) {
    if (!this.store.has(from)) {
      this.store.set(from, new Map<ConstructorType, MapRule<any, any>>());
    }
  }
}
