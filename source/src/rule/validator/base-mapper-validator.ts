export abstract class BaseMapperValidator {
    abstract validate(item: any): Promise<void>;
}
