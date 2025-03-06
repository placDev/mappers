import { BaseMapperProfile } from '../../../../source/src/profile/base-mapper-profile';
import { ProfileMapperInterface } from '../../../../source/src/mapper/interfaces/profile-mapper.interface';
import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { MapperInterface } from '../../../../source/src';

class TestObjectConstructor {
  testDto: string = 'Bye';
}

class TestObjectConstructorDto {
  constructor() {
    this.foo = 'Hi';
  }

  test: string;
  foo: string;
}

class TestObjectConstructorTwoDto {
  constructor(foo: string) {
    this.foo = foo;
  }

  test: string;
  foo: string;
}

type ComplexNumber = { coefficient: number };
class TestObjectConstructorComplexDto {
  constructor(a: number[], b: number[], c: ComplexNumber) {
    const concat = a.concat(b);
    this.result = concat.reduce(
      (x, currentValue) => (currentValue + x) * c.coefficient,
      0,
    );
  }

  result: number = 0;
  test: string;
}

class TestConstructorFirstProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapperInterface) {
    mapper
      .addRule(TestObjectConstructor, TestObjectConstructorDto)
      .callConstructor()
      .property(
        (x) => x.testDto,
        (x) => x.test,
      );

    mapper
      .addRule(TestObjectConstructor, TestObjectConstructorTwoDto)
      .callConstructor(TestObjectConstructorTwoDto, async (call, from) => {
        call(`Nice ${from.testDto}`);
      })
      .property(
        (x) => x.testDto,
        (x) => x.test,
      );

    mapper
      .addRule(TestObjectConstructor, TestObjectConstructorComplexDto)
      .callConstructor(TestObjectConstructorComplexDto, async (call) => {
        call([1, 2, 3], [1, 2, 3], { coefficient: 10 });
      })
      .property(
        (x) => x.testDto,
        (x) => x.test,
      );
  }
}

describe('...', () => {
  let mapper: MapperInterface;

  beforeEach(async () => {
    MapperSettings.addProfile(TestConstructorFirstProfile);
    MapperSettings.collectProfiles();

    mapper = MapperSettings.getMapper();
  });

  it('empty constructor', async () => {
    const simple = new TestObjectConstructor();

    const first = await mapper.map(
      simple,
      TestObjectConstructor,
      TestObjectConstructorDto,
    );
    expect(first.foo).toEqual('Hi');
  });

  it('first argument', async () => {
    const simple = new TestObjectConstructor();

    const first = await mapper.map(
      simple,
      TestObjectConstructor,
      TestObjectConstructorTwoDto,
    );
    expect(first.foo).toEqual('Nice Bye');
  });

  it('complex argument', async () => {
    const simple = new TestObjectConstructor();

    const first = await mapper.map(
      simple,
      TestObjectConstructor,
      TestObjectConstructorComplexDto,
    );
    expect(first.result).toEqual(1231230);
  });
});
