export class SettingsErrorHelper {
  static accessOnlyType(type: string) {
    return `Функция доступна только при использовании ${type} типа сборки`;
  }
}
