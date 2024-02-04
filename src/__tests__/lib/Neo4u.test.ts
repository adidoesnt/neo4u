import { describe, beforeEach, it, expect, spyOn } from 'bun:test';
import { type Configuration, Neo4u, Query, Connection } from '../../lib';
import { Session } from 'neo4j-driver';

describe('Neo4u', () => {
    let config: Configuration;
    let connection: Connection;
    let neo4u: Neo4u;

    beforeEach(() => {
        config = {
            neo4j: {
                protocol: 'bolt',
                host: 'localhost',
                port: 7687,
                user: 'neo4j',
                password: 'password',
            },
        };
        connection = new Connection(config.neo4j);
        neo4u = new Neo4u(config);
    });

    it('should create a new connection when constructed', () => {
        expect(neo4u).toBeDefined();
        expect(connection).toBeDefined();
    });

    it('should get a session from the connection', () => {
        const getSessionSpy = spyOn(neo4u, 'getSession');
        neo4u.getSession();
        expect(getSessionSpy).toHaveBeenCalled();
    });

    it('should close the connection', () => {
        const closeSpy = spyOn(neo4u, 'close');
        neo4u.close();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('should call run and getResult methods of Query', async () => {
        const queryString = 'MATCH (n) RETURN n';
        const parameters = { paramName: 'value' };
        spyOn(neo4u, 'getSession').mockImplementationOnce(
            () => ({ session: 'session' }) as unknown as Session,
        );
        const runSpy = spyOn(Query.prototype, 'run').mockResolvedValueOnce();
        const getResultSpy = spyOn(
            Query.prototype,
            'getResult',
        ).mockResolvedValueOnce(null);
        await neo4u.run(queryString, parameters);
        expect(runSpy).toHaveBeenCalled();
        expect(getResultSpy).toHaveBeenCalled();
    });
});
