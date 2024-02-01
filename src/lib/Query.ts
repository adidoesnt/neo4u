import type { Session } from "neo4j-driver";
import { Logger } from "./Logger";

export class Query {
    private query: string;
    private parameters?: Record<string, any>;
    private session: Session;
    private logger = Logger.getLogger("query");
    private result: any;

    constructor(
        session: Session,
        query: string,
        parameters?: Record<string, any>,
    ) {
        this.session = session;
        this.query = query;
        this.parameters = parameters;
    }

    async run() {
        try {
            this.logger.info(`Running query: ${this.query}`);
            this.result = await this.session.run(this.query, this.parameters);
        } catch (error) {
            this.logger.error(`Error running query: ${this.query}`, error);
            this.result = null;
        }
    }

    getResult() {
        return this.result;
    }
}
