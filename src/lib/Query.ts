import type { Session } from 'neo4j-driver';
import { Logger } from './Logger';

/**
 * Class representing a database query.
 */
export class Query {
    private query: string;
    private parameters?: Record<string, any>;
    private session: Session;
    private logger = Logger.getLogger('query');
    private result: any;

    /**
     * Create a new Query instance.
     * @param {Session} session - The session to use for the query.
     * @param {string} query - The query string.
     * @param {Record<string, any>} parameters - The parameters for the query.
     */
    constructor(
        session: Session,
        query: string,
        parameters?: Record<string, any>,
    ) {
        this.session = session;
        this.query = query;
        this.parameters = parameters;
    }

    /**
     * Run the query.
     */
    async run(): Promise<void> {
        try {
            this.logger.info(`Running query: ${this.query}`);
            this.result = await this.session.run(this.query, this.parameters);
        } catch (error) {
            this.logger.error(`Error running query: ${this.query}`, error);
            this.result = null;
        }
    }

    /**
     * Get the result of the query.
     * @returns {any} The result of the query.
     */
    getResult(): any {
        return this.result;
    }
}
