import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/settings/mapper-settings";
import {Mapper} from "../../../../source/src/mapper/mapper";

class Simple {
  a: string = "";
  b: number = 20;
  c: number = 10;

  test: string = "001";
}

class SimpleDto {
  aDto: string = "";
  result: number = 0;

  test: string = "";
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper.addRule(Simple, SimpleDto)
        .properties((x) => ([
            x.test
        ]))
        .property((x) => x.a, (x) => x.aDto)
        .fill((x) => x.result, (from) => {
          return from.c + from.b;
        })
        .fill(x => x.test, () => "999")
  }
}

describe('...', () => {
  let mapper: Mapper;

  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
  });

  it('.....', async () => {
    MapperSettings.collectRules();
    mapper = MapperSettings.getMapper();

    const simple = new Simple();

    const result = await mapper.map(simple, Simple, SimpleDto);
    expect(result.result).toBe(30);
  });
});
