import { driver, auth, type Driver, type Session } from 'neo4j-driver';
import { Logger } from './Logger';
const { basic } = auth;

/**
 * Configuration for a Neo4j connection.
 */
export type Neo4jConfiguration = {
    protocol: string;
    host: string;
    port: number;
    user: string;
    password: string;
};

/**
 * Class representing a connection to a Neo4j database.
 */
export class Connection {
    private driver: Driver;
    private session: Session;
    private uri: string;
    private logger = Logger.getLogger('connection');

    /**
     * Get the URI for a Neo4j connection.
     * @param {Neo4jConfiguration} config - The configuration for the connection.
     * @returns {string} The connection URI.
     */
    getUri(config: Neo4jConfiguration): string {
        const { protocol, host, port } = config;
        return `${protocol}://${host}:${port}`;
    }

    /**
     * Create a new connection.
     * @param {Neo4jConfiguration} config - The configuration for the connection.
     */
    constructor(config: Neo4jConfiguration) {
        this.uri = this.getUri(config);
        console.log(this.uri);
        const { user, password } = config;
        this.logger.info(`establishing connection to ${this.uri}`);
        try {
            this.driver = driver(this.uri, basic(user, password));
            this.session = this.driver.session();
        } catch (error) {
            this.logger.error(`error connecting to ${this.uri}`, error);
            throw error;
        }
        this.logger.info(`successfully connected to ${this.uri}`);
    }

    /**
     * Get the current session.
     * @returns {Session} The current session.
     */
    getSession(): Session {
        return this.session;
    }

    /**
     * Close the connection.
     */
    close(): void {
        try {
            this.logger.info(`closing connection to ${this.uri}`);
            this.session.close();
            this.driver.close();
        } catch (error) {
            this.logger.error(`error closing connection to ${this.uri}`);
        }
    }
}
