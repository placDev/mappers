import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapperInterface } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { MapperInterface } from '../../../../source/src';

enum TestEnum {
  a = 543,
  b = 544,
}

type Test = {
  sd: number;
};

class Simple {
  a: string = '321';
  sd: Test = { sd: 123 };
  type: string = 'a';

  anyValue: number = 123;
}

class SimpleDto {
  a: string = '123';
  sd: Test = { sd: 123 };
  type: TestEnum = TestEnum.a;

  anyValue: string = '123';
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapperInterface) {
    mapper
      .addRule(Simple, SimpleDto)
      .callConstructor()
      .properties((x) => [x.a])
      .property(
        (x) => x.type,
        (x) => x.type,
        (value) => TestEnum[value],
      );
  }
}

describe('...', () => {
  let mapper: MapperInterface;

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
    expect(result.type).toBe(543);
  });
});
