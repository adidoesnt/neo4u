import 'reflect-metadata';
import { modelMetaDataKey } from './Decorator';
import type { Node, Session } from 'neo4j-driver';
import { Logger } from './Logger';

/**
 * Abstract class representing a model.
 * Provides methods for interacting with the database.
 */
export abstract class Model {
    protected static session?: Session;
    private static logger = Logger.getLogger('model');

    /**
     * Add the model to a session.
     * @param {Session} session - The session to add the model to.
     */
    static setSession(session: Session): void {
        Model.session = session;
    }

    /**
     * Create a new instance of the model.
     * @param {T} props - The properties of the new instance.
     * @returns {Promise<T | null>} The created instance, or null if an error occurred.
     */
    static async create<T extends new (...args: any[]) => Model>(
        this: T,
        props: InstanceType<T>,
    ): Promise<T | null> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const result = await Model.session?.run(
                `CREATE (n:${modelName} $props) RETURN n, ID(n) as _id`,
                { props },
            );
            const record = result?.records?.shift();
            if (record) {
                const node = record.get('n') as Node;
                const _id = node.identity.toNumber();
                const properties = node.properties;
                properties._id = _id;
                return properties as T;
            } else {
                throw new Error('error creating node');
            }
        } catch (error) {
            Model.logger.error(error);
            return null;
        }
    }

    /**
     * Get the conditions for a query.
     * @param {Partial<InstanceType<any>>} props - The properties to include in the conditions.
     * @param {string} propsName - The name to use for the properties in the query.
     * @returns {string} The conditions for the query.
     */
    static getConditions(
        props: Partial<InstanceType<any>>,
        propsName: string = 'props',
    ): string {
        return Object.keys(props)
            .map((key) => `n.${key} = $${propsName}.${key}`)
            .join(' AND ');
    }

    /**
     * Find instances of the model that match the specified properties.
     * @param {Partial<InstanceType<T>>} props - The properties to match.
     * @returns {Promise<T[]>} The matching instances.
     */
    static async find<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>> & { _id?: number },
    ): Promise<T[]> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props);
            const result = props._id
                ? await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ID(n) = $id RETURN n, ID(n) as _id`,
                      { id: props._id },
                  )
                : await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ${conditions} RETURN n`,
                      { props },
                  );
            const records = result?.records ?? [];
            return (
                records.map((record) => {
                    const node = record.get('n') as Node;
                    const _id = node.identity.toNumber();
                    const properties = node.properties;
                    properties._id = _id;
                    return properties as T;
                }) ?? []
            );
        } catch (error) {
            Model.logger.error('error finding node', error);
            return [];
        }
    }

    /**
     * Find one instance of the model that matches the specified properties.
     * @param {Partial<InstanceType<T>>} props - The properties to match.
     * @returns {Promise<T | null>} The matching instance, or null if no match was found.
     */
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

    /**
     * Delete instances of the model that match the specified properties.
     * @param {Partial<InstanceType<T>>} props - The properties to match.
     * @returns {Promise<boolean>} True if the operation was successful, false otherwise.
     */
    static async delete<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>> & { _id?: number },
    ): Promise<boolean> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props);
            props._id
                ? await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ID(n) = $id DELETE n`,
                      { id: props._id },
                  )
                : await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ${conditions} DELETE n`,
                      { props },
                  );
            return true;
        } catch (error) {
            Model.logger.error('error deleting node', error);
            return false;
        }
    }

    /**
     * Detach and delete instances of the model that match the specified properties.
     * @param {Partial<InstanceType<T>>} props - The properties to match.
     * @returns {Promise<boolean>} True if the operation was successful, false otherwise.
     */
    static async detachDelete<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>> & { _id?: number },
    ): Promise<boolean> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props);
            props._id
                ? await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ID(n) = $id DETACH DELETE n`,
                      { id: props._id },
                  )
                : await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ${conditions} DETACH DELETE n`,
                      { props },
                  );
            return true;
        } catch (error) {
            Model.logger.error('error detaching and deleting node', error);
            return false;
        }
    }

    /**
     * Get the set statements for an update query.
     * @param {Partial<InstanceType<any>>} props - The properties to include in the set statements.
     * @param {string} propsName - The name to use for the properties in the query.
     * @returns {string} The set statements for the query.
     */
    static getSetStatements(
        props: Partial<InstanceType<any>>,
        propsName: string,
    ): string {
        return Object.keys(props)
            .map((key) => `n.${key} = $${propsName}.${key}`)
            .join(', ');
    }

    /**
     * Update instances of the model that match the specified properties.
     * @param {Partial<InstanceType<T>>} props - The properties to match.
     * @param {Partial<InstanceType<T>>} newProps - The new properties to set.
     * @returns {Promise<T | null>} The updated instance, or null if an error occurred.
     */
    static async update<T extends new (...args: any[]) => Model>(
        this: T,
        props: Partial<InstanceType<T>> & { _id?: number },
        newProps: Partial<InstanceType<T>>,
    ): Promise<T[]> {
        try {
            const modelName = Reflect.getMetadata(modelMetaDataKey, this);
            const conditions = Model.getConditions(props, 'props');
            const setStatements = Model.getSetStatements(newProps, 'newProps');
            const result = props._id
                ? await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ID(n) = $id SET ${setStatements} RETURN n, ID(n) as _id`,
                      { id: props._id, newProps },
                  )
                : await Model.session?.run(
                      `MATCH (n:${modelName}) WHERE ${conditions} SET ${setStatements} RETURN n, ID(n) as _id`,
                      { props, newProps },
                  );
            const records = result?.records ?? [];
            return (
                records.map((record) => {
                    const node = record.get('n') as Node;
                    const _id = node.identity.toNumber();
                    const properties = node.properties;
                    properties._id = _id;
                    return properties as T;
                }) ?? []
            );
        } catch (error) {
            Model.logger.error('error updating node', error);
            return [];
        }
    }
}
