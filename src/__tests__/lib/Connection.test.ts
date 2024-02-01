import { describe, it, spyOn, expect, mock } from "bun:test";
import { Connection } from "../../lib/Connection";
import neo4jDriver, { auth } from "neo4j-driver";

describe("Connection", () => {
    let connection: Connection;
    let mockSession = { close: mock(() => {}) };
    let mockDriver = { close: mock(() => {}) };

    it("should establish a connection when constructed", () => {
        spyOn(auth, "basic").mockResolvedValueOnce(
            null as unknown as never
        );
        spyOn(neo4jDriver, "driver").mockResolvedValueOnce(
            null as unknown as never
        );
        try {
            connection = new Connection({
                protocol: "bolt",
                host: "localhost",
                port: 7687,
                user: "neo4j",
                password: "password",
            });
        } catch (error) {
            expect(error).not.toBeDefined();
        }
    });

    it("should get a session", () => {
        // @ts-ignore
        connection.session = mockSession;
        const session = connection.getSession();
        expect(session).toStrictEqual(mockSession);
    });

    it("should close the connection", () => {
        // @ts-ignore
        connection.session = mockSession;
        // @ts-ignore
        connection.driver = mockDriver;
        connection.close();
        expect(mockSession.close).toHaveBeenCalled();
        expect(mockDriver.close).toHaveBeenCalled();
    });
});
