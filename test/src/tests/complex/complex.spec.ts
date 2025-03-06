import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapperInterface } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { MapperInterface } from '../../../../source/src';

interface SimpleInterface {
  name: string;
  age: number;
  test?: SimpleDto[];
}

class AnyObject {
  test: number;
  aga: string;

  method() {
    return this.test * 100;
  }
}

class Foo {
  name: string = 'Foo';
}

class FooDto {
  nameDto: string = 'FooDto';
}

class Simple {
  simple: SimpleInterface = {
    age: 2101,
    name: 'Вячеслав Якуб',
    test: [new SimpleDto()],
  };

  any = new AnyObject();
  anyTransfrom = new AnyObject();
  foo = new Foo();
}

class SimpleDto {
  simple: SimpleInterface = {
    age: 1999,
    name: 'Вячеслав',
  };

  any = new AnyObject();
  anyTransfrom: AnyObject;
  fooDto: FooDto;
}

class TestComplexProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapperInterface) {
    mapper
      .addRule(Simple, SimpleDto)
      .complex(
        (x) => x.simple,
        (x) => x.simple,
      )
      .complex(
        (x) => x.any,
        (x) => x.any,
      )
      .complex(
        (x) => x.anyTransfrom,
        (x) => x.anyTransfrom,
        async (property, from) => {
          const newObject = new AnyObject();
          newObject.test = 222 + from.simple.age;
          newObject.aga = '222';
          return newObject;
        },
      )
      .byRule(
        (x) => x.foo,
        (x) => x.fooDto,
        mapper.withRule(Foo, FooDto),
      );

    mapper.addRule(Foo, FooDto).property(
      (xd) => xd.name,
      (x) => x.nameDto,
      () => {
        return '- + - + - +';
      },
    );
  }
}

describe('...', () => {
  let mapper: MapperInterface;

  beforeEach(async () => {
    MapperSettings.addProfile(TestComplexProfile);
    MapperSettings.collectProfiles();

    mapper = MapperSettings.getMapper();
  });

  it('.....', async () => {
    const simple = new Simple();

    const single = await mapper.map(simple, Simple, SimpleDto);
    const t = single;
  });
});
