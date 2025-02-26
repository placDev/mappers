export class ProfileErrorHelper {
  static notExtendsProfile() {
    return `The object is not an inheritor of BaseMapperProfile`;
  }

  static alredyCreated(profileName: string) {
    return `An instance of the profile '${profileName}' has already been created`;
  }
}
