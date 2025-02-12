import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/mapper-settings";

class Simple {
  a: string = "";
  b: number = 0;
  z: string = "Пука"
}

class SimpleDto {
  aDto: string = "";
  bDto: number = 0;
  zDto: number = 0;
}

class Giga {
  tot: string;
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper.addRule(Simple, SimpleDto)
        .property(x => x.a, x => x.aDto)
        .property(x => x.b, x => x.bDto)
        .property(x => x.z, x => x.zDto, async (property, from, to) => {
          const pV = property;
          const fV = from;
          const tV = to;

          return 666;
        })

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

  it('.....', async () => {
    const fggh = "tot" in new Giga();
    const mapper = MapperSettings.getMapper();

    const simple = new Simple();
    simple.a = "good";
    simple.b = 100500;

    const t = await mapper.map(simple, Simple, SimpleDto);
    const f = await mapper.map([simple], Simple, SimpleDto);

    const fd = await mapper.defineMap(simple, SimpleDto);
    const fddd = await mapper.defineMap([simple], SimpleDto);
    const fddfd = await mapper.defineMap([{}], SimpleDto);
  });
});
