import { Neo4u } from './lib/Neo4u';
import { type Configuration } from 'neo4u'

const config: Configuration = {
    neo4j: {
        protocol: 'bolt',
        host: 'localhost',
        port: 7687,
        user: 'neo4j',
        password: 'password'
    }
};

const neo4u = new Neo4u(config);

// Use the getSession method
neo4u.getSession();

// Remember to close the connection when you're done
neo4u.close();