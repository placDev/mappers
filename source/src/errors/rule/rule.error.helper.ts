export class RuleErrorHelper {
  static fromNotFound(fromName: string) {
    return `No rules found for '${fromName}'`;
  }

  static toInFromNotFound(fromName: string, toName: string) {
    return `Rule for '${fromName}' and '${toName}' not found`;
  }

  static alredyAdded(fromName: string, toName: string) {
    return `The rule for '${fromName}' and '${toName}' has already been added to the mapper`;
  }
}
