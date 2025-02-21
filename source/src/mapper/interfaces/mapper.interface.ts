import { ConstructorType } from "../../utility-types";

export interface MapperInterface {
  map<V extends F, F, T>(
    values: V[],
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): Promise<T[]>;
  map<V extends F, F, T>(
    values: V,
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): Promise<T>;
  map<V extends F, F, T>(
    values: V | V[],
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): Promise<T> | Promise<T[]>;

  autoMap<V extends object, T>(
    values: V[],
    to: ConstructorType<T>,
  ): Promise<T[]>;
  autoMap<V extends object, T>(values: V, to: ConstructorType<T>): Promise<T>;
  autoMap<V extends object, T>(
    values: V | V[],
    to: ConstructorType<T>,
  ): Promise<T> | Promise<T[]>;
}
