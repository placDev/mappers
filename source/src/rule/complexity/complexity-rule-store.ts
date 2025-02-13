import {ComplexRule} from "./complex-rule";
import {MapRule} from "../map-rule";

export class ComplexityRuleStore {
    private store = new Map<string, Map<string, ComplexRule>>();

    addRule(propertyFrom: string, propertyTo: string, transform?: (...arg: any[]) => any, rule?: MapRule<any, any>) {
        this.initialFromState(propertyFrom);

        let fromState = this.store.get(propertyFrom) as Map<string, ComplexRule>;
        if(fromState.has(propertyTo)) {
            throw new Error("Данное правило для свойства уже добавленно в маппер")
        }

        const newRule = new ComplexRule(propertyFrom, propertyTo, transform, rule);
        fromState.set(propertyTo, newRule);

        return newRule;
    }

    getComplexRules(): Array<ComplexRule> {
        return [...this.store.values()].flatMap(x => [...x.values()])
    }

    //TODO Не нужен
    getRule(propertyFrom: string, propertyTo: string) {
        const fromState = this.store.get(propertyFrom);
        if(!fromState) {
            throw new Error(`Правила для ${propertyFrom} не найдены`)
        }

        if(!fromState.has(propertyTo)) {
            throw new Error(`Правило для ${propertyFrom} и ${propertyTo} не найдено`)
        }

        return fromState.get(propertyTo) as ComplexRule;
    }

    private initialFromState(propertyFrom: string) {
        if(!this.store.has(propertyFrom)) {
            this.store.set(propertyFrom, new Map<string, ComplexRule>());
        }
    }
}