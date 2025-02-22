export class ProfileErrorHelper {
  static notExtendsProfile() {
    return `Объект не является наследником BaseMapperProfile`;
  }

  static alredyCreated(profileName: string) {
    return `Экземпляр профиля ${profileName} уже создан`;
  }
}
