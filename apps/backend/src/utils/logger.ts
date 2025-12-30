/**
 * Centralized logging utility with consistent timestamps.
 * Format: YYYY-MM-DD HH:mm:ss [LEVEL] message
 */

const getTimestamp = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatMessage = (level: string, args: unknown[]): string => {
    const timestamp = getTimestamp();
    const message = args
        .map((arg) => {
            if (arg instanceof Error) {
                return arg.stack || arg.message;
            }
            if (typeof arg === "object") {
                try {
                    return JSON.stringify(arg);
                } catch {
                    return String(arg);
                }
            }
            return String(arg);
        })
        .join(" ");
    return `${timestamp} [${level}] ${message}`;
};

const logger = {
    info: (...args: unknown[]): void => {
        console.log(formatMessage("INFO", args));
    },

    error: (...args: unknown[]): void => {
        console.error(formatMessage("ERROR", args));
    },

    warn: (...args: unknown[]): void => {
        console.warn(formatMessage("WARN", args));
    },

    debug: (...args: unknown[]): void => {
        if (process.env.NODE_ENV !== "production") {
            console.log(formatMessage("DEBUG", args));
        }
    },
};

export default logger;
