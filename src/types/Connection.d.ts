declare module "neo4u" {
    export interface Neo4jConfiguration {
        protocol: string;
        host: string;
        port: string;
        user: string;
        password: string;
    }
}
