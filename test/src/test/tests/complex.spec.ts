import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/settings/mapper-settings";
import {Mapper} from "../../../../source/src/mapper/mapper";

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
    name: string = "Foo";
}

class FooDto {
    nameDto: string = "FooDto";
}

class Simple {
    simple: SimpleInterface = {
        age: 2101,
        name: "Вячеслав Якуб",
        test: [new SimpleDto()]
    }

    any = new AnyObject();
    anyTransfrom = new AnyObject();
    foo = new Foo();
}

class SimpleDto {
    simple: SimpleInterface = {
        age: 1999,
        name: "Вячеслав"
    };

    any = new AnyObject();
    anyTransfrom: AnyObject;
    fooDto: FooDto;
}

class TestComplexProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapper) {
        mapper.addRule(Simple, SimpleDto)
            .complex((x) => x.simple, (x) => x.simple)
            .complex(x => x.any, x => x.any)
            .complex(x => x.anyTransfrom, x => x.anyTransfrom, async (property, from) => {
                const newObject = new AnyObject();
                newObject.test = 222 + from.simple.age;
                newObject.aga = '222';
                return newObject;
            })
            .byRule(x => x.foo, x => x.fooDto, mapper.withRule(Foo, FooDto))

        mapper.addRule(Foo, FooDto)
            .property((xd) => xd.name, (x) => x.nameDto, () => {
                return "- + - + - +";
            });
    }
}

describe('...', () => {
    let mapper: Mapper;

    beforeEach(async () => {
        MapperSettings.addProfile(TestComplexProfile);
        MapperSettings.collectRules();

        mapper = MapperSettings.getMapper();
    });

    it('.....', async () => {
        const simple = new Simple();

        const single = await mapper.map(simple, Simple, SimpleDto);
        const t = single;
    });
});
