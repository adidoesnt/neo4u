import { type Configuration } from "neo4u";
import { Connection } from "./Connection";
import { Query } from "./Query";

export class Neo4u {
    private connection: Connection;

    constructor(private config: Configuration) {
        const { neo4j } = this.config;
        this.connection = new Connection(neo4j);
    }

    getSession() {
        return this.connection.getSession();
    }

    close() {
        this.connection.close();
    }

    async run(queryString: string, parameters?: Record<string, any>) {
        const session = this.getSession();
        const query = new Query(session, queryString, parameters);
        await query.run();
        return query.getResult();
    }
}
