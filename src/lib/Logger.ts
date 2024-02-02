import log4js from 'log4js';

export class Logger {
    private constructor() {}

    static configure(logLevel: string = 'debug') {
        log4js.configure({
            appenders: {
                console: { type: 'stdout' },
                error: { type: 'stderr' },
            },
            categories: {
                default: { appenders: ['console'], level: logLevel },
                error: { appenders: ['error'], level: 'error' },
            },
        });
    }

    static getLogger(category: string = 'default') {
        Logger.configure();
        return log4js.getLogger(category);
    }
}
