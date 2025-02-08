import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/mapper-settings";

class Simple {
  a: string = "";
  b: number = 0;
}

class SimpleDto {
  aDto: string = "";
  bDto: number = 0;
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper.addRule(Simple, SimpleDto)
        .property(x => x.a, x => x.aDto)
        .property(x => x.b, x => x.bDto)

    mapper.addRule(SimpleDto, Simple)
        .property(x => x.aDto, x => x.a)
        .property(x => x.bDto, x => x.b)
  }
}

describe('...', () => {
  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
    MapperSettings.collectRules();
  });

  it('.....', () => {
    const mapper = MapperSettings.getMapper();

    const simple = new Simple();
    const t = mapper.map(simple, Simple, SimpleDto);
  });
});
