export class ValidatorErrorHelper {
  static notExtendsValidator() {
    return `The object is not an inheritor of the BaseMapperValidator`;
  }

  static alredyCreated(validatorName: string) {
    return `An instance of the validator '${validatorName}' has already been created`;
  }

  static notFound(validatorName: string) {
    return `The validator '${validatorName}' was not found`;
  }

  static defaultAlredySet() {
    return `The default validator is not installed`;
  }

  static defaultOrCustomValidatorNotFound() {
    return `The default or custom validator is not defined`;
  }

  static disabled() {
    return `The validator is disabled for this rule`;
  }

  static notFoundDefaultOrCustomByRule(fromName: string, toName: string) {
    return `There is no custom validator defined for the rule '${fromName} and '${toName}' and there is no default validator`;
  }
}
