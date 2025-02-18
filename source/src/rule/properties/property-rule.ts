export class PropertyRule {
  propertyFrom: string;
  propertyTo: string;
  transform?: (property: any, from: any, to: any) => any;

  public constructor(
    propertyFrom: string,
    propertyTo: string,
    transform?: (property: any, from: any, to: any) => any,
  ) {
    this.propertyFrom = propertyFrom;
    this.propertyTo = propertyTo;
    this.transform = transform;
  }

  public get isExistTransform() {
    return this.transform !== undefined;
  }
}
