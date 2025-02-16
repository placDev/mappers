export class FillRule {
    propertyTo: string;
    transform: (from: any, to: any) => any;

    public constructor(propertyTo: string, transform: (from: any, to: any) => any) {
        this.propertyTo = propertyTo;
        this.transform = transform;
    }
}