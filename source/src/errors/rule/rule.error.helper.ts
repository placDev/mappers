import { MapperSettings } from "../../settings/mapper-settings";

export class RuleErrorHelper {
  static fromNotFound(fromName: string) {
    if (MapperSettings.settings.isCollectDI) {
      return `No rules found for '${fromName}'. Make sure that the profile is added to DI in Singleton mode and all entities injected into it are also Singletons.`;
    }

    return `No rules found for '${fromName}'`;
  }

  static toInFromNotFound(fromName: string, toName: string) {
    if (MapperSettings.settings.isCollectDI) {
      return `Rule for '${fromName}' and '${toName}' not found. Make sure that the profile is added to DI in Singleton mode and all entities injected into it are also Singletons.`;
    }

    return `Rule for '${fromName}' and '${toName}' not found`;
  }

  static alredyAdded(fromName: string, toName: string) {
    return `The rule for '${fromName}' and '${toName}' has already been added to the mapper`;
  }
}
