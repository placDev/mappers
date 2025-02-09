export class PropertyRule {
    propertyFrom: string;
    propertyTo: string;
    transform?: (...arg: any[]) => any;

    public constructor(propertyFrom: string, propertyTo: string, transform?: (...arg: any[]) => any) {
        this.propertyFrom = propertyFrom;
        this.propertyTo = propertyTo;
        this.transform = transform;
    }

    public get isSimple() {
        return this.transform === undefined;
    }
}