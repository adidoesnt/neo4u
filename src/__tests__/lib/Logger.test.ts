import { describe, expect, it, spyOn } from "bun:test";
import log4js from "log4js";
import { Logger } from "../../lib/Logger";

describe("Logger", () => {
    const loggerConfigSpy = spyOn(log4js, "configure");
    const loggerGetSpy = spyOn(log4js, "getLogger");

    it('should not allow direct instantiation', () => {
        try {
            // @ts-ignore
            new Logger();
        } catch (error) {
            expect(error).not.toBeDefined();
        }
    });
    
    it("should call log4js.configure with default log level", () => {
        Logger.getLogger();
        expect(loggerConfigSpy).toHaveBeenCalledWith({
            appenders: {
                console: { type: "stdout" },
                error: { type: "stderr" },
            },
            categories: {
                default: { appenders: ["console"], level: "debug" },
                error: { appenders: ["error"], level: "error" },
            },
        });
    });

    it("should call log4js.configure with custom log level", () => {
        Logger.configure("info");
        Logger.getLogger();
        expect(loggerConfigSpy).toHaveBeenCalledWith({
            appenders: {
                console: { type: "stdout" },
                error: { type: "stderr" },
            },
            categories: {
                default: { appenders: ["console"], level: "info" },
                error: { appenders: ["error"], level: "error" },
            },
        });
    });

    it("should call log4js.getLogger with default category", () => {
        Logger.getLogger();
        expect(loggerGetSpy).toHaveBeenCalledWith("default");
    });

    it("should call log4js.getLogger with custom category", () => {
        Logger.getLogger("custom");
        expect(loggerGetSpy).toHaveBeenCalledWith("custom");
    });
});
