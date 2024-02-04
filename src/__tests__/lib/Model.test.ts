import { describe, it, expect, mock } from 'bun:test';
import type { Session } from 'neo4j-driver';
import { Entity, Model, Property, DataType } from '../../lib';

describe('Model', () => {
    it('should create a model', () => {
        // @ts-ignore
        const model = new Model();
        expect(model).toBeInstanceOf(Model);
    });

    it('should set the session', () => {
        const session = { run: mock(() => {}) } as unknown as Session;
        Model.setSession(session);
        expect(Model['session']).toBe(session);
    });

    it('should create a node', async () => {
        const session = {
            run: mock(() => {
                return {
                    records: [
                        {
                            get: mock(() => {
                                return {
                                    properties: {
                                        name: 'test',
                                    },
                                };
                            }),
                        },
                    ],
                };
            }),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const test = await Test.create({ name: 'test' });
        expect(session.run).toHaveBeenCalledWith(
            'CREATE (n:Test $props) RETURN n',
            { props: { name: 'test' } },
        );
        expect(test).toStrictEqual({
            name: 'test',
        } as typeof test);
    });

    it('should throw an error when creating a node', async () => {
        const session = {
            run: mock(() => {
                return {
                    records: [],
                };
            }),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const result = await Test.create({ name: 'test' });
        expect(result).toBeNull();
    });

    it('should find nodes', async () => {
        const session = {
            run: mock(() => {
                return {
                    records: [
                        {
                            get: mock(() => {
                                return {
                                    properties: {
                                        name: 'test',
                                    },
                                };
                            }),
                        },
                    ],
                };
            }),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const result = await Test.find({ name: 'test' });
        expect(result).toStrictEqual([
            {
                name: 'test',
            },
        ] as unknown as typeof result);
    });

    it('should find one node', async () => {
        const session = {
            run: mock(() => {
                return {
                    records: [
                        {
                            get: mock(() => {
                                return {
                                    properties: {
                                        name: 'test',
                                    },
                                };
                            }),
                        },
                    ],
                };
            }),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const result = await Test.findOne({ name: 'test' });
        expect(result).toStrictEqual({
            name: 'test',
        } as unknown as typeof result);
    });

    it('should delete a node', async () => {
        const session = {
            run: mock(() => true),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const result = await Test.delete({ name: 'test' });
        expect(result).toBeTrue();
    });

    it('should detach and delete a node', async () => {
        const session = {
            run: mock(() => true),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const result = await Test.detachDelete({ name: 'test' });
        expect(result).toBeTrue();
    });

    it('should update a node', async () => {
        const session = {
            run: mock(() => {
                return {
                    records: [
                        {
                            get: mock(() => {
                                return {
                                    properties: {
                                        name: 'test2',
                                    },
                                };
                            }),
                        },
                    ],
                };
            }),
        } as unknown as Session;
        @Entity('Test')
        class Test extends Model {
            @Property({
                name: 'name',
                type: 'string' as DataType.String,
                primary: true,
            })
            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        Test.setSession(session);
        const test = await Test.update({ name: 'test' }, { name: 'test2' });
        expect(session.run).toHaveBeenCalledWith(
            'MATCH (n:Test) WHERE n.name = $props.name SET n.name = $newProps.name RETURN n',
            {
                props: {
                    name: 'test',
                },
                newProps: {
                    name: 'test2',
                },
            },
        );
        expect(test).toStrictEqual({
            name: 'test2',
        } as typeof test);
    });
});
