import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapper } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { Mapper } from '../../../../source/src/mapper/mapper';

type Test = {
  sd: number;
};

class Simple {
  a: string = '321';
  sd: Test = { sd: 123 };
}

class SimpleDto {
  a: string = '123';
  sd: Test = { sd: 123 };
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper
      .addRule(Simple, SimpleDto)
      .callConstructor()
      .properties((x) => [x.a]);
  }
}

describe('...', () => {
  let mapper: Mapper;

  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
    MapperSettings.collectProfiles();

    mapper = MapperSettings.getMapper();
  });

  it('....', async () => {
    const mapper = MapperSettings.getMapper();

    const simple = new Simple();

    const result = await mapper.autoMap(simple, SimpleDto);
    expect(result.a).toBe('321');
  });
});
