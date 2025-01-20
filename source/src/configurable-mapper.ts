import {
    ClassConstructor,
    ClassTransformOptions,
    plainToInstance,
} from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {NotImplementedException} from "./errors";
import {Options} from "./mapper-settings";

type IsMethod<T> = T extends (...args: any[]) => any ? true : false
type ClassFields<T> = Pick<T, {
    [K in keyof T]: IsMethod<T[K]> extends true ? never : K
}[keyof T]>;

type DomainConditionalOptional<T, O extends Options> = O["domain"]['makeOptional'] extends true
    ? Partial<T>
    : T;

type EntityConditionalOptional<T, O extends Options> = O["entity"]['makeOptional'] extends true
    ? Partial<T>
    : T;

export enum SourceType {
    Dto,
    Domain,
    Entity,
}

export abstract class ConfigurableMapper<Dto, Domain, Entity, O extends Options> {
    protected constructor(
        protected dtoConstructor: ClassConstructor<Dto>,
        protected domainConstructor: ClassConstructor<Domain>,
        protected entityConstructor?: ClassConstructor<Entity>,
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected dtoToDomain(dto: Dto): Domain {
        throw new NotImplementedException('No implementation found dtoToDomain');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected toDto(domain: Domain): Promise<Dto> {
        throw new NotImplementedException('No implementation found toDto');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected toEntity(domain: Domain): Entity {
        throw new NotImplementedException('No implementation found toEntity');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected entityToDomain(entity: Entity): Domain {
        throw new NotImplementedException('No implementation found transformEntityToDomain');
    }

    protected async plainToDto(value: ClassFields<Dto>, options?: ClassTransformOptions) {
        const instance = plainToInstance(this.dtoConstructor, value, options);
        await validateOrReject(instance as object, {
            forbidUnknownValues: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        return instance;
    }

    // TODO Сделать исключения свойств которых нет в Domain
    protected plainToDomain(value: DomainConditionalOptional<ClassFields<Domain>, O>, options?: ClassTransformOptions) {
        return plainToInstance(this.domainConstructor, value, options);
    }

    // TODO Сделать исключения свойств которых нет в Entity
    protected plainToEntity(value: EntityConditionalOptional<ClassFields<Entity>, O>, options?: ClassTransformOptions) {
        if (!this.entityConstructor) {
            throw new Error('EntityConstructor not found');
        }
        return plainToInstance(this.entityConstructor, value, options);
    }

    async dto(domain: Domain) {
        if (!this.dtoConstructor) {
            throw new Error('The constructor for the Dto is not defined.');
        }

        return this.validateObjectHowInstance(
            this.dtoConstructor,
            await this.toDto(domain),
        );
    }

    async dtos(domains: Domain[]) {
        return Promise.all(domains.map((domain) => this.dto(domain)));
    }

    entity(domain: Domain) {
        if (!this.entityConstructor) {
            throw new Error('The constructor for the Entity is not defined.');
        }

        return this.validateObjectHowInstance(
            this.entityConstructor,
            this.toEntity(domain),
        );
    }

    entities(domains: Domain[]) {
        return domains.map((domain) => this.entity(domain));
    }

    domain(
        entityOrDto: Entity | Dto,
        sourceType?: SourceType.Entity | SourceType.Dto,
    ) {
        return this.entityOrDtoInner(entityOrDto, sourceType);
    }

    domains(
        entitiesOrDtos: Entity[] | Dto[],
        sourceType?: SourceType.Entity | SourceType.Dto,
    ) {
        return entitiesOrDtos.map((entityOrDto: Entity | Dto) =>
            this.entityOrDtoInner(entityOrDto, sourceType),
        );
    }

    private entityOrDtoInner(
        entityOrDto: Entity | Dto,
        sourceType?: SourceType.Entity | SourceType.Dto,
    ) {
        if (entityOrDto === undefined) {
            return undefined;
        }

        if (entityOrDto === null) {
            return null;
        }

        if (
            sourceType == SourceType.Entity ||
            (this.entityConstructor && entityOrDto instanceof this.entityConstructor)
        ) {
            return this.validateObjectHowInstance(
                this.domainConstructor,
                this.entityToDomain(entityOrDto as Entity),
            );
        } else if (
            sourceType == SourceType.Dto ||
            (this.dtoConstructor && entityOrDto instanceof this.dtoConstructor)
        ) {
            return this.validateObjectHowInstance(
                this.domainConstructor,
                this.dtoToDomain(entityOrDto as Dto),
            );
        }

        throw new Error(
            'The prototype of the original object is not a Dto or Entity. If you are passing an anonymous object, specify the second argument (sourceType) to determine the type.',
        );
    }

    private validateObjectHowInstance<T>(
        constructor: ClassConstructor<T>,
        value: T,
    ): T {
        const objectIsNullOrUndefined = value === null || value === undefined;
        if (objectIsNullOrUndefined || value instanceof constructor) {
            return value;
        }

        throw new Error(
            `The resulting object is not an instance of the prototype ${constructor.name}`,
        );
    }

    protected static instance: ConfigurableMapper<any, any, any, any>;
    static to<T>(this: new () => T): T {
        // @ts-ignore
        if (!this.instance) {
            // @ts-ignore
            this.instance = new this();
        }

        // @ts-ignore
        return this.instance as T;
    }
}
