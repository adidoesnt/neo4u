import { type Configuration } from "neo4u";
import { Connection } from "./Connection";
import { Logger } from "./Logger";

export class Neo4u {
    private connection: Connection;
    private logger: Logger;

    constructor(private config: Configuration) {
        const { neo4j } = this.config;
        this.connection = new Connection(neo4j);
        this.logger = Logger.getLogger("neo4u")
    }

    getSession() {
        this.connection.getSession();
    }

    close() {
        this.connection.close();
    }
}
