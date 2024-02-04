# Neo4u

A simple typescript OGM for Neo4j.

## Quickstart

We can start by importing the relevant types:

```
import {
    Configuration,
    Neo4u,
} from 'neo4u';
```

Then we can a configuration for our Neo4u object:

```
const config: Configuration = {
    neo4j: {
        host: '127.0.0.1',
        port: 7687,
        user: 'neo4j',
        password: 'neo4j',
        protocol: 'bolt',
    },
};
```

We can then use this configuration to instantiate it:

```
const neo4u: Neo4u = new Neo4u(config);
```

The most basic operation we can carry out is running a query:

```
const result = neo4u
    .run('CREATE (a:Person {name: $name}) RETURN a', { name: 'Adi' })
    .then((result) => {
        console.log(result);
    });
```

Our code so far should look like this:

```
import {
    Configuration,
    Neo4u,
} from 'neo4u';

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

const result = neo4u
    .run('CREATE (a:Person {name: $name}) RETURN a', { name: 'Adi' })
    .then((result) => {
        console.log(result);
    });
```

## Using Entities

Once again, we start by importing the necessary types:

```
import {
    Configuration,
    DataType,
    Entity,
    Model,
    Neo4u,
    Property
} from 'neo4u';
```

Just like before, we create our configuration object:

```
const config: Configuration = {
    neo4j: {
        host: '127.0.0.1',
        port: 7687,
        user: 'neo4j',
        password: 'neo4j',
        protocol: 'bolt',
    },
};
```

We instantiate Neo4u with this configuration:

```
const neo4u: Neo4u = new Neo4u(config);
```

Now, we are going to try to use entity and property decorators. These are useful for defining our models.

The entity decorator is the name of the model, while the property decorator(s) identify the property metadata for the model.

```
@Entity('Test')
class Test extends Model {
    @Property({
        name: 'id',
        type: DataType.Number,
        primary: true
    })
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}
```

Now that we have created a model, we are ready to use it. But before that we must register our model with the current session:

```
const session = neo4u.getSession();
Test.setSession(session);
```

Now the model can be used to carry out CRUD operations:

```
Test.create({ name: 'test' }).then((result) => {
    neo4u.close();
    console.log(result);
});
```

Our code should look like this:

```
import {
    Configuration,
    DataType,
    Entity,
    Model,
    Neo4u,
    Property
} from 'neo4u';

@Entity('Test')
class Test extends Model {
    @Property({
        name: 'id',
        type: DataType.Number,
        primary: true
    })
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
