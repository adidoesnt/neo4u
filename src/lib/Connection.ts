import { driver, auth, type Driver, type Session } from 'neo4j-driver';
import { Logger } from './Logger';
const { basic } = auth;

export type Neo4jConfiguration = {
    protocol: string;
    host: string;
    port: number;
    user: string;
    password: string;
};

export class Connection {
    private driver: Driver;
    private session: Session;
    private uri: string;
    private logger = Logger.getLogger('connection');

    getUri(config: Neo4jConfiguration): string {
        const { protocol, host, port } = config;
        return `${protocol}://${host}:${port}`;
    }

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

    getSession(): any {
        return this.session;
    }

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
