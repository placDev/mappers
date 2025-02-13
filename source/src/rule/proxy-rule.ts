import {ConstructorType} from "../utility-types";

export class ProxyRule<From, To> {
    private from: ConstructorType<From>;
    private to: ConstructorType<To>;

    constructor(from: ConstructorType<From>, to: ConstructorType<To>) {
        this.from = from;
        this.to = to;
    }

    getFrom() {
        return this.from;
    }

    getTo() {
        return this.to;
    }
}