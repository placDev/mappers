import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapper } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { Mapper } from '../../../../source/src/mapper/mapper';

class Simple {
  a: string = '';
  b: number = 0;
  z: string = 'Пука';
  v: boolean;
}

class SimpleDto {
  aDto: string = '';
  bDto: number = 0;
  zDto: number = 0;
  v: boolean = false;
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper
      .addRule(Simple, SimpleDto)
      .property(
        (x) => x.a,
        (x) => x.aDto,
      )
      .property(
        (x) => x.b,
        (x) => x.bDto,
      )
      .property(
        (x) => x.z,
        (x) => x.zDto,
        async (property, from, to) => {
          const pV = property;
          const fV = from;
          const tV = to;

          return 666;
        },
      )
      .property(
        (x) => x.v,
        (x) => x.v,
        () => {
          return true;
        },
      );

    mapper
      .addRule(SimpleDto, Simple)
      .property(
        (x) => x.aDto,
        (x) => x.a,
        () => 'Martin',
      )
      .property(
        (x) => x.bDto,
        (x) => x.b,
      );
  }
}

describe('...', () => {
  let mapper: Mapper;

  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
    MapperSettings.collectRules();

    mapper = MapperSettings.getMapper();
  });

  it('.....', async () => {
    const simple = new Simple();
    simple.a = 'good';
    simple.b = 100500;

    const single = await mapper.map(simple, Simple, SimpleDto);
    expect(single).toBeInstanceOf(SimpleDto);
    expect(single).toEqual(
      expect.objectContaining<Partial<SimpleDto>>({
        bDto: 100500,
        zDto: 666,
        v: true,
      }),
    );

    const array = await mapper.map([simple], Simple, SimpleDto);
    expect(array).toHaveLength(1);

    const [first] = array;
    expect(first).toBeInstanceOf(SimpleDto);
    expect(first).toEqual(
      expect.objectContaining<Partial<SimpleDto>>({
        bDto: 100500,
        zDto: 666,
        v: true,
      }),
    );
  });

  it('test automap', async () => {
    const simple = new Simple();
    simple.a = 'good';
    simple.b = 100500;

    const single = await mapper.autoMap(simple, SimpleDto);
    expect(single).toBeInstanceOf(SimpleDto);
    expect(single).toEqual(
      expect.objectContaining<Partial<SimpleDto>>({
        bDto: 100500,
        zDto: 666,
        v: true,
      }),
    );

    const array = await mapper.autoMap([simple], SimpleDto);
    expect(array).toHaveLength(1);

    const [first] = array;
    expect(first).toBeInstanceOf(SimpleDto);
    expect(first).toEqual(
      expect.objectContaining<Partial<SimpleDto>>({
        bDto: 100500,
        zDto: 666,
        v: true,
      }),
    );
  });

  it('should throw error', async () => {
    const mapper = MapperSettings.getMapper();

    const simple = new Simple();
    simple.a = 'good';
    simple.b = 100500;

    await expect(async () => {
      await mapper.autoMap([simple, {}], SimpleDto);
    }).rejects.toThrowError(Error);
    await expect(async () => {
      await mapper.autoMap([{}], SimpleDto);
    }).rejects.toThrowError(Error);
  });

  it('revers', async () => {
    const simpleDto = await mapper.map(new Simple(), Simple, SimpleDto);
    const simple = await mapper.map(simpleDto, SimpleDto, Simple);

    expect(simple).toBeInstanceOf(Simple);
    expect(simple.a).toEqual('Martin');
  });
});
