import { driver, auth, type Driver, type Session } from "neo4j-driver";
import type { Neo4jConfiguration } from "neo4u";
const { basic } = auth;

export class Connection {
    private driver: Driver;
    private session: Session;

    getUri(config: Neo4jConfiguration): string {
        const { protocol, host, port } = config;
        return `${protocol}://${host}:${port}`;
    }

    constructor(config: Neo4jConfiguration) {
        const uri = this.getUri(config);
        const { user, password } = config;
        this.driver = driver(uri, basic(user, password));
        this.session = this.driver.session();
    }

    getSession(): any {
        return this.session;
    }

    close(): void {
        this.session.close();
        this.driver.close();
    }
}
