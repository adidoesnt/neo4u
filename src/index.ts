import { Neo4u } from './lib/Neo4u';
import { type Configuration } from 'neo4u'

const config: Configuration = {
    neo4j: {
        protocol: 'bolt',
        host: '127.0.0.1',
        port: 7687,
        user: 'wseventbot',
        password: 'wseventbot!!'
    }
};

const neo4u = new Neo4u(config);

// Use the getSession method
neo4u.getSession();

const result = await neo4u.run('MATCH (n) RETURN n');
console.log(result);

// Remember to close the connection when you're done
neo4u.close();