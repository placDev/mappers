export class FillRule {
  propertyTo: string;
  filler: (from: any, to: any) => any;

  public constructor(propertyTo: string, filler: (from: any, to: any) => any) {
    this.propertyTo = propertyTo;
    this.filler = filler;
  }
}
