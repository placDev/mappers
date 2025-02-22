export class FillErrorHelper {
  static alredyAdded(toName: string) {
    return `Правило для свойства ${toName} уже добавленно в маппер`;
  }

  static alredyExistInPropertiesOrComplexity(toName: string) {
    return `Для свойства ${toName} уже определено правило в properties или complexity`;
  }
}
