const baseUrl = process.env.API_BASE_URL || "https://www2.zuugle.at";
const apiUser = process.env.API_USER;
const apiPass = process.env.API_PASSWORD;

const getHeaders = () => {
    const headers = {};
    if (apiUser && apiPass) {
        const auth = Buffer.from(`${apiUser}:${apiPass}`).toString("base64");
        headers["Authorization"] = `Basic ${auth}`;
    }
    return headers;
};

const waitForServer = async (url, retries = 24, delay = 5000) => {
    // 24 * 5s = 120s
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Checking server status... ${i + 1}/${retries}`);
            const res = await fetch(url, { headers: getHeaders() });
            if (res.status !== 502 && res.status !== 503 && res.status !== 504) {
                console.log(`Server responded with ${res.status}. Ready.`);
                return;
            }
        } catch (e) {
            console.log(`Server check failed: ${e.message}`);
        }
        await new Promise((r) => setTimeout(r, delay));
    }
    throw new Error("Server not ready after multiple attempts");
};

describe("Zuugle API UAT Tests", () => {
    beforeAll(async () => {
        // Wait for server to be ready
        if (baseUrl.startsWith("http")) {
            await waitForServer(`${baseUrl}/api/cities?domain=www.zuugle.at`);
        }
    }, 130000);

    test("GET /api/cities returns 200 and list of cities", async () => {
        const url = `${baseUrl}/api/cities?domain=www.zuugle.at`;
        const response = await fetch(url, { headers: getHeaders() });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.cities)).toBe(true);
        expect(data.cities.length).toBeGreaterThan(0);
    });

    test("GET /api/tours returns 200 and list of tours", async () => {
        const url = `${baseUrl}/api/tours?domain=www.zuugle.at&city=wien`;
        const response = await fetch(url, { headers: getHeaders() });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
    });

    test("GET /api/tours/filter returns 200 and filter options", async () => {
        const url = `${baseUrl}/api/tours/filter?domain=www.zuugle.at&city=wien`;
        const response = await fetch(url, { headers: getHeaders() });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.filter).toBeDefined();
        expect(Array.isArray(data.filter.types)).toBe(true);
    });

    test("GET /api/tours with ranges=true returns tours and ranges", async () => {
        /**
         * This test verifies that the /tours endpoint works correctly with ranges=true.
         *
         * WHAT THIS TESTS:
         * - The SQL query for ranges must have correct parameter bindings
         * - When a city is provided, the city parameter must be passed to knex.raw()
         *
         * COMMON FAILURE CAUSES:
         * - SQL error "there is no parameter $1": The range_sql query uses placeholders
         *   but knex.raw() is called without passing the binding values.
         *   Fix: Ensure knex.raw(range_sql, [city]) passes the city value.
         * - Location: src/routes/tours.js, around line 824 (range_result = await knex.raw())
         */
        const url = `${baseUrl}/api/tours?domain=www.zuugle.at&city=wien&ranges=true&limit=10&currLanguage=de`;
        const response = await fetch(url, { headers: getHeaders() });

        // Check HTTP status first
        expect(response.status).toBe(200);

        const data = await response.json();

        // Basic success check
        expect(data.success).toBe(true);

        // Tours array must exist
        expect(Array.isArray(data.tours)).toBe(true);

        // Ranges array must exist when ranges=true is requested
        expect(data.ranges).toBeDefined();
        expect(Array.isArray(data.ranges)).toBe(true);
    });

    test("GET /api/tours with all common parameters returns 200", async () => {
        /**
         * This test covers the most common API call pattern from the frontend.
         *
         * WHAT THIS TESTS:
         * - Combined parameters work together without SQL errors
         * - Parameter binding is correct for all query parts
         *
         * COMMON FAILURE CAUSES:
         * - SQL parameter mismatch: Check that all SQL queries using placeholders
         *   receive the correct bindings in their knex.raw() calls.
         * - Location: src/routes/tours.js, the listWrapper function
         */
        const params = new URLSearchParams({
            domain: "www.zuugle.at",
            city: "wien",
            ranges: "true",
            limit: "10",
            currLanguage: "de",
            page: "1",
        });
        const url = `${baseUrl}/api/tours?${params.toString()}`;
        const response = await fetch(url, { headers: getHeaders() });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
        expect(typeof data.total).toBe("number");
    });
});
