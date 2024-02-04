import { describe, it, expect, mock } from 'bun:test';
import { Query } from '../../lib';
import type { Session } from 'neo4j-driver';

describe('Query', () => {
    it('should return a query object when the constructor is called', () => {
        const queryString = 'MATCH (n) RETURN n';
        const session = { session: 'session' } as unknown as Session;
        const query = new Query(session, queryString);
        expect(query).toBeDefined();
    });

    it('should run a query', async () => {
        const queryString = 'MATCH (n) RETURN n';
        const session = {
            session: 'session',
            run: mock(() => {}),
        } as unknown as Session;
        const query = new Query(session, queryString);
        const result = await query.run();
        expect(session.run).toHaveBeenCalledWith(queryString, undefined);
        expect(result).toBeUndefined();
    });

    it('should run a query with parameters', async () => {
        const queryString = 'MATCH (n) RETURN n';
        const parameters = { param: 'param' };
        const session = {
            session: 'session',
            run: mock(() => null),
        } as unknown as Session;
        const query = new Query(session, queryString, parameters);
        const result = await query.run();
        expect(session.run).toHaveBeenCalledWith(queryString, parameters);
        expect(result).toBeUndefined();
    });

    it('should return the result of the query', async () => {
        const queryString = 'MATCH (n) RETURN n';
        const session = {
            session: 'session',
            run: mock(() => null),
        } as unknown as Session;
        const query = new Query(session, queryString);
        // @ts-ignore
        query.result = 'result';
        const result = await query.getResult();
        expect(result).toBe('result');
    });
});
