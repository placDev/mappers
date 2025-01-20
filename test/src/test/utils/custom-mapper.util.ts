import {ConfigurableMapper, Options} from "mapper-lite";

const customConfiguration = {
    entity: {
        makeOptional: false,
    },
    domain: {
        makeOptional: true,
    }
} as const satisfies Options;

export class CustomMapper<Dto, Domain, Entity> extends ConfigurableMapper<Dto, Domain, Entity, typeof customConfiguration> {}