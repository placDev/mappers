import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapperInterface } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { DefaultMapperValidator } from './utils/test-mapper-validator';
import {MapperInterface} from "../../../../source/src";

export class SimpleValidate {
  a: number = 100;
}

export class SimpleValidateDto {
  aDto: string = '';
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapperInterface) {
    mapper
      .addRule(SimpleValidate, SimpleValidateDto)
      .property(
        (x) => x.a,
        (x) => x.aDto,
        (property) => {
          return property.toString();
        },
      )
      .validate();
  }
}

describe('...', () => {
  let mapper: MapperInterface;

  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
  });

  it('.....', async () => {
    MapperSettings.setSettings({
      defaultValidator: DefaultMapperValidator,
    });
    MapperSettings.collectProfiles();

    mapper = MapperSettings.getMapper();

    const simpleMany = [new SimpleValidate(), new SimpleValidate()];

    const [first] = await mapper.map(
      simpleMany,
      SimpleValidate,
      SimpleValidateDto,
    );
    expect(first.aDto).toBe('100');
  });
});
