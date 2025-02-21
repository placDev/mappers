import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import {
  BaseMapperProfile,
  BaseMapperValidator,
  MapperInterface,
} from '../../../../source/src';
import { ProfileMapperInterface } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
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
  async define(mapper: ProfileMapperInterface) {
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
  let mapper: MapperInterface;

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
