export class FillErrorHelper {
  static alredyAdded(toName: string) {
    return `The rule for the '${toName}' property has already been added to the mapper`;
  }

  static alredyExistInPropertiesOrComplexity(toName: string) {
    return `A rule has already been defined for the '${toName}' property in 'properties' or 'complexity'`;
  }
}
