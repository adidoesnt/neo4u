import 'reflect-metadata';

export enum DataType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Date = 'date',
    Point = 'point',
    DateArray = 'date[]',
    StringArray = 'string[]',
    NumberArray = 'number[]',
    BooleanArray = 'boolean[]',
}

export interface PropertyOptions {
    name: string;
    type: DataType;
    primary?: boolean;
    unique?: boolean;
    required?: boolean;
    default?: any;
}

export const modelMetaDataKey = Symbol('modelMetaData');
export const propertyMetaDataKey = Symbol('propertyMetaData');

export function Entity(modelName: string) {
    return function (target: any) {
        Reflect.defineMetadata(modelMetaDataKey, modelName, target);
    };
}

export function Property(metadata: PropertyOptions) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata(
            propertyMetaDataKey,
            metadata,
            target,
            propertyKey,
        );
    };
}
