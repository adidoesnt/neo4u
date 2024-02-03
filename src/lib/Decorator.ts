import 'reflect-metadata';

/**
 * Enum representing the possible data types for a property.
 */
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

/**
 * Interface representing the options for a property.
 */
export interface PropertyOptions {
    name: string;
    type: DataType;
    primary?: boolean;
    unique?: boolean;
    required?: boolean;
    default?: any;
}

const modelMetaDataKey = Symbol('modelMetaData');
const propertyMetaDataKey = Symbol('propertyMetaData');

/**
 * Class decorator for specifying the model name of a class.
 * @param {string} modelName - The name of the model.
 */
export function Entity(modelName: string) {
    return function (target: any) {
        Reflect.defineMetadata(modelMetaDataKey, modelName, target);
    };
}

/**
 * Property decorator for specifying the metadata of a property.
 * @param {PropertyOptions} metadata - The metadata of the property.
 */
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
