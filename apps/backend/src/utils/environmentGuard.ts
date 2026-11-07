import logger from "./logger";

export interface EnvironmentGuardOptions {
    composeName?: string;
    dbName?: string;
    isForce?: boolean;
}

/**
 * Asserts that import-data is NOT run on native PROD.
 * Native PROD leaves COMPOSE_PROJECT_NAME unset and uses DB_NAME with "prod".
 * Local, DEV and UAT set COMPOSE_PROJECT_NAME (e.g. zuugle, zuugle-dev, zuugle-uat).
 *
 * @returns true if allowed, false if blocked
 */
export function checkImportDataAllowed(options?: EnvironmentGuardOptions): boolean {
    const composeName = options?.composeName ?? process.env.COMPOSE_PROJECT_NAME;
    const dbName = options?.dbName ?? process.env.DB_NAME ?? "";
    const isForce = options?.isForce ?? process.argv.includes("--force");

    if (!composeName || dbName.toLowerCase().includes("prod")) {
        if (!isForce) {
            logger.error(
                `ABORT: "npm run import-data" must not be run on the PROD environment!\n` +
                    `  This command truncates tables and restores from the nightly dump.\n` +
                    `  On PROD use "npm run import-data-prod" instead.\n` +
                    `  (Emergency override only with: npm run import-data -- --force)`,
            );
            return false;
        }
        logger.warn("PROD guard overridden via --force flag. Proceeding with import-data...");
    }
    return true;
}
