import { Result, Session } from 'neo4j-driver';
import { Neo4jConfiguration, Connection } from './Connection';
import { Query } from './Query';

/**
 * Interface representing the configuration for Neo4u.
 */
export interface Configuration {
    neo4j: Neo4jConfiguration;
}

/**
 * Class representing a Neo4u instance.
 * Provides methods for interacting with the database.
 */
export class Neo4u {
    private connection: Connection;

    /**
     * Create a new Neo4u instance.
     * @param {Configuration} config - The configuration for the Neo4u instance.
     */
    constructor(private config: Configuration) {
        const { neo4j } = this.config;
        this.connection = new Connection(neo4j);
    }

    /**
     * Get the session for the Neo4u instance.
     * @returns {Session} The session.
     */
    getSession(): Session {
        return this.connection.getSession();
    }

    /**
     * Close the connection for the Neo4u instance.
     */
    close() {
        this.connection.close();
    }

    /**
     * Run a query on the Neo4u instance.
     * @param {string} queryString - The query string.
     * @param {Record<string, any>} parameters - The parameters for the query.
     * @returns {Promise<Result>} The result of the query.
     */
    async run(
        queryString: string,
        parameters?: Record<string, any>,
    ): Promise<Result> {
        const session = this.getSession();
        const query = new Query(session, queryString, parameters);
        await query.run();
        return query.getResult();
    }
}
