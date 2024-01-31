import type { Neo4jConfiguration } from "neo4u";

declare module "neo4u" {
    export interface Configuration {
        neo4j: Neo4jConfiguration;
    }
}
