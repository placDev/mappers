import {MapperValidator, MapperValidatorType} from "../utility-types";
import {BaseMapperValidator} from "../rule/validator/base-mapper-validator";

export class SettingsValidatorStore {
    private defaultValidator?: MapperValidator<any, any>;
    private validatorInstance?: MapperValidatorType<any, any>;

    setDefaultValidator<T extends BaseMapperValidator>(validator: MapperValidator<T, any>) {
        this.defaultValidator = validator;
    }

    getDefaultValidator() {
        if(this.isEmpty) {
            throw new Error("Дефолтный валидатор не установлен");
        }

        this.fillValidatorInstance();

        return this.validatorInstance;
    }

    get isEmpty() {
        return this.defaultValidator === undefined;
    }

    private fillValidatorInstance() {
        if(!this.validatorInstance) {
            this.validatorInstance = new this.defaultValidator!();
        }
    }
}