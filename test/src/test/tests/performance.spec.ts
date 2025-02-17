import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/settings/mapper-settings";
import {Mapper} from "../../../../source/src/mapper/mapper";

class Test {
  testData = "3003003";
}

class TestDto {
  testDataDto = "";
}

class Simple {
  constructor(aValue: number) {
    this.a = aValue.toString();
  }

  a: string;
  b: number = Math.random();
  c: number = Math.random();

  test: string = "001";
  testTwo: number = 100500;

  arrayTest = [1, 2, 3, 4];
  arrayTestTwo = [Math.random(), Math.random(), Math.random(), Math.random()];

  large = new Test();
}

class SimpleDto {
  aDto: string = "";
  result: number = 0;

  test: string = "";
  testTwo: number = 0;

  arrayTestDto = [];
  arrayTestTwo = [];

  largeDto: TestDto;
}

class AgaProfile extends BaseMapperProfile {
  async define(mapper: ProfileMapper) {
    mapper.addRule(Simple, SimpleDto)
        .callConstructor()
        .properties((x) => ([
            x.test,
            x.testTwo
        ]))
        .property((x) => x.a, (x) => x.aDto)
        .complex((x) => x.arrayTest, (x) => x.arrayTestDto)
        .complex((x) => x.arrayTestTwo, (x) => x.arrayTestTwo, (x) => {
          return [...x]
        })
        .byRule((x) => x.large, (x) => x.largeDto, mapper.withRule(Test, TestDto))
        .fill((x) => x.result, (from) => {
          return from.c + from.b;
        });

    mapper.addRule(Test, TestDto)
        .callConstructor()
        .property((x) => x.testData, (x) => x.testDataDto)
  }
}

describe('...', () => {
  let mapper: Mapper;

  beforeEach(async () => {
    MapperSettings.addProfile(AgaProfile);
  });

  it('test single map', async () => {
    MapperSettings.collectRules();
    mapper = MapperSettings.getMapper();

    const simple = new Simple(1);

    const startAuto = performance.now();
    const resultAuto = await mapper.autoMap(simple, SimpleDto);
    const endAuto = performance.now();
    console.log(`Auto Map took ${endAuto - startAuto}ms`);

    const start = performance.now();
    const result = await mapper.map(simple, Simple, SimpleDto);
    const end = performance.now();
    console.log(`Map took ${end - start}ms`);

    expect(result.result).toBe(30);
  });


  it('test array map', async () => {
    MapperSettings.collectRules();
    mapper = MapperSettings.getMapper();

    let counter = 0;
    const simple = Array.from({ length: 300 }, () => {
      counter++;
      return new Simple(counter);
    });

    const start = performance.now();
    const result = await mapper.map(simple, Simple, SimpleDto);
    const end = performance.now();
    console.log(`Function took ${end - start}ms`);
  });
});
