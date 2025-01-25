//TODO Уникальные ключи для правил что бы можно было несколько рулов пеовешать

type ConstructorType<T = any> = new (...arg: any[]) => T;

type IsMethod<T> = T extends (...args: any[]) => any ? true : false;
type ClassFields<T> = Pick<
    T,
    {
        [K in keyof T]: IsMethod<T[K]> extends true ? never : K;
    }[keyof T]
>;

type NonPrimitiveKeys<T> = {
    [K in keyof T]: T[K] extends object ? K : never
}[keyof T];
type NonPrimitive<T> = Pick<T, NonPrimitiveKeys<T>>;

interface Options {}

class MapRule<From, To> {
    constructor(from: ConstructorType<From>, to: ConstructorType<To>) {
    }

    settings(value: Options) {
        return this;
    }

    autoMapPrimitive(value: boolean = true): MapRule<From, To> {
        return this;
    }

    forProperty<C>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => C): MapRule<From, To>;
    forProperty<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<V>): MapRule<From, To>;
    forProperty<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => V): MapRule<From, To>;
    forProperty<C, V>(propertyFrom: (value: ClassFields<From>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<V> | V) {
        return this;
    }

    forComplex<C, V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => C): MapRule<From, To>;
    forComplex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<N>): MapRule<From, To>;
    forComplex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => N): MapRule<From, To>;
    forComplex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: ClassFields<To>) => V, transform?: (propertyValue: C, fromValue: From, toValue: To) => Promise<N> | N) {
        return this;
    }

    forComplexWithRule<Z, D>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => Z, propertyTo: (value: NonPrimitive<ClassFields<To>>) => D, rule: MapRule<Z, D>): MapRule<From, To> {
        return this;
    }
}


class ProfileStore {

}

class RuleStore {
    private store = new Map<ConstructorType, Map<ConstructorType, MapRule<any, any>>>();

    addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        this.initialFromState(from);

        let fromState = this.store.get(from) as Map<ConstructorType, MapRule<any, any>>;
        if(fromState.has(to)) {
            throw new Error("Данное правило уже добавленно в маппер")
        }

        const newRule = new MapRule(from, to);
        fromState.set(to, newRule);

        return newRule;
    }

    private initialFromState(from: ConstructorType) {
        if(this.store.has(from)) {
            this.store.set(from, new Map<ConstructorType, MapRule<any, any>>());
        }
    }
}

class Mapper {
    private store = new RuleStore();

    addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        return this.store.addRule(from, to);
    }

    getRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>) {
        // Тут найти рул из стора
        return new MapRule(from, to);
    }
}

abstract class BaseMapperProfile {
    abstract defineProfile(mapper: Mapper): Promise<void>;
}

/////
class User {
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

const mapper = new Mapper();

export class UserProfile extends BaseMapperProfile {
    async defineProfile(mapper: Mapper) {
        mapper.addRule(User, UserDto)
            .autoMapPrimitive()
            .forProperty((x) => x.text, (c) => c.text3)
            .forProperty((x) => x.text, (c) => c.text3, async (value) => {
                return "";
            })
            .forComplex((x) => x.large, (c) => c.large, (gavno) => {
                return new User();
            })
            .forComplexWithRule((x) => x.large, (c) => c.large, mapper.getRule(UserDto, User))
    }
}