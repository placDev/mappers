import { MapperBase } from "mapper-lite"

class TestDto {
  one: number
}

class Test {
  constructor(twoValue: number) {
    this.two = twoValue
  }

  one: number;
  two: number;
  three?: number;

  methodTest() {
    return this.one + this.two;
  }
}

class TestEntity {
  one: number;
  array: string[] = ["test1"];
}

class TestMap extends MapperBase<TestDto, Test, TestEntity> {
  constructor() {
    super(TestDto, Test, TestEntity);
  }

  protected toDto(domain: Test): Promise<TestDto> {
    return this.plainToDto(domain);
  }

  protected dtoToDomain(dto: TestDto): Test {
    return this.plainToDomain({
      one: dto.one,
      two: 5,
    });
  }

  protected toEntity(domain: Test): TestEntity {
    return this.plainToEntity({
      one: domain.one,
      array: []
    });
  }
}

describe('Testing simple function', () => {
  beforeEach(async () => {});

  it('should return domain Test with methods', () => {
    const dto = new TestDto();
    dto.one = 5;

    const domain = TestMap.to().domain(dto);
    expect(domain.one).toBe(5);
    expect(domain.two).toBe(5);
    expect(domain).toBeInstanceOf(Test);
    expect(domain.methodTest()).toEqual(10);
  });

  it('should return entity Test with methods', () => {
    const domain = new Test(10);
    domain.one = 15;
    domain.three = 100;

    const entity = TestMap.to().entity(domain);
    expect(entity).toBeInstanceOf(TestEntity);
    expect(entity.one).toBe(15);
    // @ts-ignore
    expect(entity.two).toBe(undefined);
    // @ts-ignore
    expect(entity.methodTest).toEqual(undefined);
    expect(entity.array).toContain('test1');
  })

});
