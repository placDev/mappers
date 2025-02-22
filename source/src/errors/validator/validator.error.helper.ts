export class ValidatorErrorHelper {
  static notExtendsValidator() {
    return `Объект не является наследником BaseMapperValidator`;
  }

  static alredyCreated(validatorName: string) {
    return `Экземпляр валидатора ${validatorName} уже создан`;
  }

  static notFound(validatorName: string) {
    return `Валидатор ${validatorName} не найден`;
  }

  static defaultAlredySet() {
    return `Дефолтный валидатор не установлен`;
  }

  static defaultOrCustomValidatorNotFound() {
    return `Дефолтный или кастомный валидатор не определен`;
  }

  static disabled() {
    return `Валидатор отключен для данного правила`;
  }

  static notFoundDefaultOrCustomByRule(fromName: string, toName: string) {
    return ``;
  }
}
