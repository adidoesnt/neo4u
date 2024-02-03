# Neo4u

A simple typescript OGM for Neo4j.

## Sample usage
```
import { 
    Configuration, 
    DataType, 
    Entity, Model, 
    Neo4u, 
    Property 
} from './lib';

@Entity('Test')
class Test extends Model {
    @Property({ name: 'id', type: DataType.Number, primary: true })
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}

const config: Configuration = {
    neo4j: {
        host: '127.0.0.1',
        port: 7687,
        user: 'neo4j',
        password: 'neo4j',
        protocol: 'bolt',
    },
};

const neo4u: Neo4u = new Neo4u(config);

const session = neo4u.getSession();
Test.setSession(session);

Test.create({ name: 'test' }).then((result) => {
    neo4u.close();
    console.log(result);
});
```
