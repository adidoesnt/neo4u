import log4js from 'log4js';

/**
 * Class representing a logger.
 */
export class Logger {
    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor() {}

    /**
     * Configure the logger.
     * @param {string} logLevel - The log level (default is 'debug').
     */
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

    /**
     * Get a logger with the specified category.
     * @param {string} category - The category of the logger (default is 'default').
     * @returns {log4js.Logger} The logger.
     */
    static getLogger(category: string = 'default') {
        Logger.configure();
        return log4js.getLogger(category);
    }
}
