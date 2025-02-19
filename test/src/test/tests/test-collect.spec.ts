import { MapperSettings } from '../../../../source/src/settings/mapper-settings';
import { Mapper } from '../../../../source/src/mapper/mapper';
import { DefaultMapperValidator } from '../validators/test-mapper-validator';

class Collector {
  static instances: Base[] = [];
}

abstract class Base {
  protected constructor() {
    Collector.instances.push(this);
  }

  abstract test();
}

class Test extends Base {
  constructor(private testNumber: number) {
    console.log(test);
    super();
  }

  test() {
    console.log(this.testNumber);
  }
}

describe('...', () => {
  it('.....', async () => {
    const t = new Test(10);
    const ff = Collector.instances;
  });
});
