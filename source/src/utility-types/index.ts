import { BaseMapperValidator } from "../rule/validator/base-mapper-validator";

export type ConstructorType<T = any> = new (...arg: any[]) => T;

export type IsMethod<T> = T extends (...args: any[]) => any ? true : false;
export type ClassFields<T> = Pick<
  T,
  {
    [K in keyof T]: IsMethod<T[K]> extends true ? never : K;
  }[keyof T]
>;

export type PrimitiveKeys<T> = {
  [K in keyof T]: T[K] extends object ? never : K;
}[keyof T];
export type Primitive<T> = Pick<T, PrimitiveKeys<T>>;

export type NonPrimitiveKeys<T> = {
  [K in keyof T]: T[K] extends object ? K : never;
}[keyof T];
export type NonPrimitive<T> = Pick<T, NonPrimitiveKeys<T>>;

export type ConstructorArgs<T> = T extends new (...args: infer U) => any
  ? U
  : never;

export type CallConstructorCallback<ToConstructor, From> = (
  call: (...arg: ConstructorArgs<ToConstructor>) => void,
  from?: From,
) => void | Promise<void>;

export type IntersectionProperty = { "@prop": symbol };
export type IntersectionProperties<T, U> = IntersectionPropertiesInner<
  Primitive<T>,
  Primitive<U>
>;
type IntersectionPropertiesInner<T, U> = {
  [K in keyof T & keyof U as T[K] extends U[K]
    ? U[K] extends T[K]
      ? K
      : never
    : never]: IntersectionProperty;
};

export type MapperValidatorType<
  V extends BaseMapperValidator,
  To,
> = V["validate"] extends (item: To) => Promise<void> ? V : never;
export type MapperValidator<V extends BaseMapperValidator, To> = new (
  ...arg: any[]
) => MapperValidatorType<V, To>;

export type NotVoid<Z> = Z extends void ? never : Z;
