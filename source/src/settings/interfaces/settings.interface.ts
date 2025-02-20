import { CollectType } from "../enums/collect-type.enum";
import { MapperValidator } from "../../utility-types";
import { BaseMapperValidator } from "../../rule/validator/base-mapper-validator";

export interface SettingsInterface {
  collectType: CollectType;
  defaultValidator?: MapperValidator<BaseMapperValidator, any>;
}
