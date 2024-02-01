import { type Configuration } from "neo4u";
import { Connection } from "./Connection";

export class Neo4u {
    private connection: Connection;

    constructor(private config: Configuration) {
        const { neo4j } = this.config;
        this.connection = new Connection(neo4j);
    }

    getSession() {
        this.connection.getSession();
    }

    close() {
        this.connection.close();
    }
}
