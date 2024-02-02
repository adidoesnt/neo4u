import 'reflect-metadata';
import { modelMetaDataKey } from './Decorator';
import type { Session } from 'neo4j-driver';
import { Logger } from './Logger';

export abstract class Model {
    protected static session?: Session;
    private static logger = Logger.getLogger('model');

    static setSession(session: Session): void {
        Model.session = session;
    }

    static async create<T extends new (...args: any[]) => Model>(
        this: T,
        props: InstanceType<T>,
    ): Promise<T | null> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const result = await Model.session?.run(
                `CREATE (n:${modelName} $props) RETURN n`,
                { props },
            );
            const record = result?.records?.shift();
            if (record) {
                return record.get('n').properties as T;
            } else {
                throw new Error('error creating node');
            }
        } catch (error) {
            Model.logger.error(error);
            return null;
        }
    }

    static getConditions(
        props: Partial<InstanceType<any>>,
        propsName: string = 'props',
    ): string {
        return Object.keys(props)
            .map((key) => `n.${key} = $${propsName}.${key}`)
            .join(' AND ');
    }

    static async find<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>>,
    ): Promise<T[]> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props);
            const result = await Model.session?.run(
                `MATCH (n:${modelName}) WHERE ${conditions} RETURN n`,
                { props },
            );
            const records = result?.records ?? [];
            return (
                records.map((record) => record.get('n').properties as T) ?? []
            );
        } catch (error) {
            Model.logger.error('error finding node', error);
            return [];
        }
    }

    static async findOne<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>>,
    ): Promise<T | null> {
        const result = await Model.find.call(this, props);
        const record = result?.shift();
        if (record) {
            return record as T;
        } else {
            return null;
        }
    }

    static async delete<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>>,
    ): Promise<boolean> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props);
            await Model.session?.run(
                `MATCH (n:${modelName}) WHERE ${conditions} DELETE n`,
                { props },
            );
            return true;
        } catch (error) {
            Model.logger.error('error deleting node', error);
            return false;
        }
    }

    static async detachDelete<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>>,
    ): Promise<boolean> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props);
            await Model.session?.run(
                `MATCH (n:${modelName}) WHERE ${conditions} DETACH DELETE n`,
                { props },
            );
            return true;
        } catch (error) {
            Model.logger.error('error detaching and deleting node', error);
            return false;
        }
    }

    static getSetStatements(
        props: Partial<InstanceType<any>>,
        propsName: string,
    ): string {
        return Object.keys(props)
            .map((key) => `n.${key} = $${propsName}.${key}`)
            .join(', ');
    }

    static async update<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>>,
        newProps: Partial<InstanceType<T>>,
    ): Promise<T | null> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props, 'props');
            const setStatements = Model.getSetStatements(newProps, 'newProps');
            const result = await Model.session?.run(
                `MATCH (n:${modelName}) WHERE ${conditions} SET ${setStatements} RETURN n`,
                { props, newProps },
            );
            const record = result?.records?.shift();
            if (record) {
                return record.get('n').properties as T;
            } else {
                throw new Error('error updating node');
            }
        } catch (error) {
            Model.logger.error('error updating node', error);
            return null;
        }
    }
}
