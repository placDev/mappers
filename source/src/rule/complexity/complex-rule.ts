import {ProxyRule} from "../proxy-rule";

export class ComplexRule {
    propertyFrom: string;
    propertyTo: string;
    transform?: (property: any, from: any, to: any) => any;
    rule?: ProxyRule<any, any>

    public constructor(propertyFrom: string, propertyTo: string, transform?: (property: any, from: any, to: any) => any, rule?: ProxyRule<any, any>) {
        this.propertyFrom = propertyFrom;
        this.propertyTo = propertyTo;
        this.transform = transform;
        this.rule = rule;
    }

    public get isExistTransform() {
        return this.transform !== undefined;
    }

    public get isExistRule() {
        return this.rule !== undefined;
    }
}