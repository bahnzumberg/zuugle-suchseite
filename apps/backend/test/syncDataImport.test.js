import { checkImportDataAllowed } from "../src/utils/environmentGuard";

describe("syncDataImport environment guard", () => {
    test("allows execution in compose-managed non-prod environments", () => {
        const allowedDev = checkImportDataAllowed({
            composeName: "zuugle-dev",
            dbName: "zuugle_suchseite_dev",
            isForce: false,
        });
        expect(allowedDev).toBe(true);

        const allowedLocal = checkImportDataAllowed({
            composeName: "zuugle",
            dbName: "zuugle_suchseite_dev",
            isForce: false,
        });
        expect(allowedLocal).toBe(true);

        const allowedUat = checkImportDataAllowed({
            composeName: "zuugle-uat",
            dbName: "zuugle_suchseite_uat",
            isForce: false,
        });
        expect(allowedUat).toBe(true);
    });

    test("blocks execution when COMPOSE_PROJECT_NAME is unset (PROD)", () => {
        const blocked = checkImportDataAllowed({
            composeName: undefined,
            dbName: "zuugle_suchseite_dev",
            isForce: false,
        });
        expect(blocked).toBe(false);
    });

    test("blocks execution when DB_NAME indicates prod", () => {
        const blocked = checkImportDataAllowed({
            composeName: "zuugle",
            dbName: "zuugle_postgresql_prod",
            isForce: false,
        });
        expect(blocked).toBe(false);
    });

    test("allows execution on PROD when --force flag is passed", () => {
        const allowedWithForce = checkImportDataAllowed({
            composeName: undefined,
            dbName: "zuugle_postgresql_prod",
            isForce: true,
        });
        expect(allowedWithForce).toBe(true);
    });
});
