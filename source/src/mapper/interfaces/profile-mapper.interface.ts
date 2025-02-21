import { ConstructorType } from "../../utility-types";
import { MapRule } from "../../rule/map-rule";
import { ProxyRule } from "../../rule/proxy-rule";

export interface ProfileMapperInterface {
  addRule<F, T>(
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): MapRule<F, T>;
  withRule<F, T>(
    from: ConstructorType<F>,
    to: ConstructorType<T>,
  ): ProxyRule<F, T>;
}
