import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { Mapper } from '../../../../source/src/mapper/mapper';
import {BaseMapperProfile, BaseMapperValidator} from '../../../../source/src';
import { ProfileMapper } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { CollectType } from '../../../../source/src/settings/enums/collect-type.enum';

class Simple {
  a = '123';
}

class SimpleDto {
  b = '000';
}

class CustomValidator extends BaseMapperValidator {
  async validate(item: SimpleDto) {
    console.log(123);
  }
}

class SimpleProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper
      .addRule(Simple, SimpleDto)
      .property(
        (x) => x.a,
        (x) => x.b,
      )
      .validate();
  }
}

describe('...', () => {
  let mapper: Mapper;

  beforeEach(async () => {
    MapperSettings.setSettings({
      collectType: CollectType.DI,
      defaultValidator: CustomValidator,
    });

    const profile = new SimpleProfile();

    MapperSettings.collectProfileInstances();

    mapper = MapperSettings.getMapper();
  });

  it('.....', async () => {
    const simple = new Simple();

    const simpleDto = await mapper.autoMap(simple, SimpleDto);
    expect(simpleDto.b).toBe('123');
  });
});
