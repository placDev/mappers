export type ConstructorType<T = any> = new (...arg: any[]) => T;

export type IsMethod<T> = T extends (...args: any[]) => any ? true : false;
export type ClassFields<T> = Pick<
    T,
    {
        [K in keyof T]: IsMethod<T[K]> extends true ? never : K;
    }[keyof T]
>;

export type PrimitiveKeys<T> = {
    [K in keyof T]: T[K] extends object ? never : K
}[keyof T];
export type Primitive<T> = Pick<T, PrimitiveKeys<T>>;

export type NonPrimitiveKeys<T> = {
    [K in keyof T]: T[K] extends object ? K : never
}[keyof T];
export type NonPrimitive<T> = Pick<T, NonPrimitiveKeys<T>>;

export type ConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never;

export type CallConstructorCallback<ToConstructor, From> = (call: (...arg: ConstructorArgs<ToConstructor>) => void, from?: From) => void | Promise<void>

export type IntersectionProperty = { "@prop": Symbol };

export type IntersectionProperties<T, U> = {
    [K in Extract<keyof Primitive<T>, keyof Primitive<U>>]: IntersectionProperty;
};