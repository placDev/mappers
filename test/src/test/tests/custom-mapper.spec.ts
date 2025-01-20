import {MapperBase} from "mapper-lite";
import {CustomMapper} from "../utils/custom-mapper.util";

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

class TestMap extends CustomMapper<TestDto, Test, TestEntity> {
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
    });
  }
}