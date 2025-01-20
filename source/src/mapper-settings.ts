import {ConfigurableMapper} from "./configurable-mapper";

export interface Options {
    domain: {
        makeOptional: boolean;
    },
    entity: {
        makeOptional: boolean;
    }
}

const defaultOptions = {
    domain: {
        makeOptional: false,
    },
    entity: {
        makeOptional: false,
    }
} as const satisfies Options;

export class MapperBase<Dto, Domain, Entity> extends ConfigurableMapper<Dto, Domain, Entity, typeof defaultOptions> {}
