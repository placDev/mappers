export class RuleErrorHelper {
  static fromNotFound(fromName: string) {
    return `Правила для ${fromName} не найдены`;
  }

  static toInFromNotFound(fromName: string, toName: string) {
    return `Правило для ${fromName} и ${toName} не найдено`;
  }

  static alredyAdded(fromName: string, toName: string) {
    return `Правило для ${fromName} и ${toName} уже добавлено в маппер`;
  }
}
