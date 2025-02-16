import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";
import {MapperSettings} from "../../../../source/src/mapper-settings";
import {Mapper} from "../../../../source/src/mapper/mapper";
import {BaseMapperValidator} from "../../../../source/src/validator/base-mapper-validator";
import {TestMapperValidator} from "../validators/test-mapper-validator";

class SimpleValidate {
    a: number = 100;
}

export class SimpleValidateDto {
    aDto: string = "";
}

class AgaProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapper) {
        mapper.addRule(SimpleValidate, SimpleValidateDto)
            .property(x => x.a, x => x.aDto, (property) => {
                return property.toString();
            })
            .validate(TestMapperValidator)
    }
}

describe('...', () => {
    let mapper: Mapper;

    beforeEach(async () => {
        MapperSettings.addProfile(AgaProfile);
    });

    it('.....', async () => {
        MapperSettings.collectRules();
        mapper = MapperSettings.getMapper();

        const simple = new SimpleValidate();

        const result = await mapper.map(simple, SimpleValidate, SimpleValidateDto);
        expect(result.aDto).toBe("100");
    });
});
