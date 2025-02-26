export class SettingsErrorHelper {
  static accessOnlyType(type: string) {
    return `The function is only available when using the '${type}' collect type`;
  }
}
