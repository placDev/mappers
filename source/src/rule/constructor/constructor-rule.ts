import { CallConstructorCallback, ConstructorType} from "../../utility-types";

export class ConstructorRule<To> {
    private enabled: boolean = false;
    private createFunction?: CallConstructorCallback<any, any>;

    constructor(private to: ConstructorType<To>) {}

    setEnabled() {
        this.enabled = true;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    async invokeCreateFunction(from: any) {
        if(this.isExistCreateFunction) {
            // @ts-ignore
            let args = [];
            await this.createFunction!((...arg: any[]) => args = [...arg], from);

            // @ts-ignore
            return new this.to(...args);
        }

        return new this.to();
    }

    setCreateFunction(createFunction: CallConstructorCallback<any, any>) {
        this.createFunction = createFunction;
    }

    get isExistCreateFunction() {
        return this.createFunction !== undefined;
    }
}