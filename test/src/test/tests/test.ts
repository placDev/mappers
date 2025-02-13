//TODO Уникальные ключи для правил что бы можно было несколько рулов пвеовешать
/////
import {BaseMapperProfile} from "../../../../source/src/profile/base-mapper-profile";
import {MapperSettings} from "../../../../source/src/mapper-settings";
import {ProfileMapper} from "../../../../source/src/mapper/interfaces/profile-mapper.interface";

class User {
    constructor(toot: string, cit: number) {}

    text: string = "123";
    large: UserDto = {} as UserDto;
    method() {

    }
}

class UserDto {
    text3: string = "123";
    large: User = {} as User;
}
////////////

export class UserProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapper) {
        mapper.addRule(UserDto, User)
            .setToken("123")
            .autoMapPrimitive()
            .callConstructor(User, (call) => {
                call("", 123)
            })
            .complex(x => x.large, x => x.large);

        mapper.addRule(User, UserDto)
            .property((x) => x.text, (c) => c.text3)
            .property((x) => x.text, (c) => c.text3, async (value) => {
                return "";
            })
            .complex((x) => x.large, (c) => c.large, (gavno) => {
                return new User();
            })
            .byRule((x) => x.large, (c) => c.large, mapper.withRule(UserDto, User))
            .validate()
    }
}

MapperSettings.addProfile(UserProfile);
MapperSettings.collectRules();

const mapper = MapperSettings.getMapper();

const dfg = [new User()];
const f = mapper.map(dfg, User, UserDto);