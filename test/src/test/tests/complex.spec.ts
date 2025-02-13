import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/mapper-settings";
import {Mapper} from "../../../../source/src/mapper/mapper";

interface SimpleInterface {
    name: string;
    age: number;
    test?: SimpleDto[];
}

class Simple {
    simple: SimpleInterface = {
        age: 2101,
        name: "Вячеслав Якуб",
        test: [new SimpleDto()]
    }
}

class SimpleDto {
    simple: SimpleInterface = {
        age: 1999,
        name: "Вячеслав"
    };
}

class TestComplexProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapper) {
        mapper.addRule(Simple, SimpleDto)
            .complex((x) => x.simple, (x) => x.simple)
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
