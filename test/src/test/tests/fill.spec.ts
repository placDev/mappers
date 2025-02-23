import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapperInterface } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { MapperInterface } from '../../../../source/src';

class Simple {
  a: string = '';
  b: number = 20;
  c: number = 10;

  test: string = '001';
}

class SimpleDto {
  aDto: string = '';
  result: number = 0;

  test: string = '';
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapperInterface) {
    mapper
      .addRule(Simple, SimpleDto)
      .properties((x) => [x.test])
      .property(
        (x) => x.a,
        (x) => x.aDto,
      )
      .fill(
        (from) => {
          return from.c + from.b;
        },
        (x) => x.result,
      )
      .fill(
        () => 'wer',
        (x) => x.test,
      );
  }
}

describe('...', () => {
  let mapper: MapperInterface;

  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
  });

  it('.....', async () => {
    MapperSettings.collectProfiles();
    mapper = MapperSettings.getMapper();

    const simple = new Simple();

    const result = await mapper.map(simple, Simple, SimpleDto);
    expect(result.result).toBe(30);
  });
});
