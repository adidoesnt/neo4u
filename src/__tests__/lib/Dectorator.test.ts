import { describe, it, expect } from 'bun:test';
import { Entity, Model, Property, DataType } from '../../lib';
import { modelMetaDataKey, propertyMetaDataKey } from '../../lib/Decorator';
import 'reflect-metadata';
import e from 'express';

describe('Decorator', () => {
    it('should set model metadata', () => {
        @Entity('TestModel')
        class TestModel extends Model {}

        const metadata = Reflect.getMetadata(modelMetaDataKey, TestModel);
        expect(metadata).toBe('TestModel');
    });

    it('should set property metadata', () => {
        const options = {
            name: 'name',
            type: 'string' as DataType.String,
            primary: true,
        };
        class TestModel extends Model {
            @Property(options)
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        const metadata = Reflect.getMetadata(
            propertyMetaDataKey,
            TestModel.prototype,
            'name',
        );
        expect(metadata).toStrictEqual(options);
    });
});
