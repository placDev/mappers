import {PropertyRule} from "./property-rule";

export class PropertiesRuleStore {
    private store = new Map<string, Map<string, PropertyRule>>();

    addRule(propertyFrom: string, propertyTo: string, transform?: (...arg: any[]) => any) {
        this.initialFromState(propertyFrom);

        let fromState = this.store.get(propertyFrom) as Map<string, PropertyRule>;
        if(fromState.has(propertyTo)) {
            throw new Error("Данное правило для свойства уже добавленно в маппер")
        }

        const newRule = new PropertyRule(propertyFrom, propertyTo, transform);
        fromState.set(propertyTo, newRule);

        return newRule;
    }

    getRule(propertyFrom: string, propertyTo: string) {
        const fromState = this.store.get(propertyFrom);
        if(!fromState) {
            throw new Error(`Правила для ${propertyFrom} не найдены`)
        }

        if(!fromState.has(propertyTo)) {
            throw new Error(`Правило для ${propertyFrom} и ${propertyTo} не найдено`)
        }

        return fromState.get(propertyTo) as PropertyRule;
    }

    private initialFromState(propertyFrom: string) {
        if(!this.store.has(propertyFrom)) {
            this.store.set(propertyFrom, new Map<string, PropertyRule>());
        }
    }
}