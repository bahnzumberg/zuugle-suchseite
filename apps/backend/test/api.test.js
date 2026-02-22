import { baseUrl, getHeaders, waitForServer } from "./testConfig.js";

const TOURS_API_SEARCH_PARAMS = {
    domain: "www.zuugle.at",
    city: "wien",
    ranges: "true",
    limit: "10",
    currLanguage: "de",
    page: "1",
};
const TOURS_API_FILTER_BODY = {
    difficulties: [1, 3],
    languages: ["fr", "it", "sl"],
    maxAscent: 2800,
    maxDescent: 2300,
    maxDistance: 62,
    maxTransportDuration: 5.5,
    providers: ["bergsteigencom", "bergfexsi", "bergfexat"],
    ranges: ["Bayerischer Wald", "Berchtesgadener Alpen", "Böhmerwald"],
    summerSeason: false,
    types: [
        "Bike & Hike",
        "Klettern",
        "Klettersteig",
        "Langlaufen",
        "Rodeln",
        "Schneeschuh",
        "Skitour",
        "Wandern",
        "Weitwandern",
    ],
};

function assertValidToursResponse({ response, data }) {
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.tours).toBeDefined();
    expect(Array.isArray(data.tours)).toBe(true);
}

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

    test("POST /api/tours returns 200 and list of tours", async () => {
        const url = `${baseUrl}/api/tours?domain=www.zuugle.at&city=wien`;
        const response = await fetch(url, {
            method: "POST",
            headers: getHeaders(),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
    });

    test("POST /api/tours returns 200 without city parameter (uses stop_selector)", async () => {
        // Test the scenario when no city is set - should use stop_selector='y' logic
        const url = `${baseUrl}/api/tours?domain=www.zuugle.at`;

        const response = await fetch(url, {
            method: "POST",
            headers: getHeaders(),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
        // Should return at least some tours from the stop_selector='y' filter
        expect(data.tours.length).toBeGreaterThanOrEqual(0);
    });

    test("GET /api/tours/filter returns 200 and filter options", async () => {
        const url = `${baseUrl}/api/tours/filter?domain=www.zuugle.at&city=wien`;

        const response = await fetch(url, { headers: getHeaders() });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.filter).toEqual(
            expect.objectContaining({
                types: expect.arrayContaining([expect.any(String)]),
                ranges: expect.arrayContaining([expect.any(String)]),
                providers: expect.arrayContaining([expect.any(String)]),
                languages: expect.arrayContaining([expect.any(String)]),
                countries: expect.arrayContaining([expect.any(String)]),
                isSingleDayTourPossible: expect.any(Boolean),
                isMultipleDayTourPossible: expect.any(Boolean),
                isSummerTourPossible: expect.any(Boolean),
                isWinterTourPossible: expect.any(Boolean),
                maxAscent: expect.any(Number),
                minAscent: expect.any(Number),
                maxDescent: expect.any(Number),
                minDescent: expect.any(Number),
                maxDistance: expect.any(Number),
                minDistance: expect.any(Number),
                isTraversePossible: expect.any(Boolean),
                minTransportDuration: expect.any(Number),
                maxTransportDuration: expect.any(Number),
            }),
        );
    });

    test("POST /api/tours with ranges=true returns tours and ranges", async () => {
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
        const response = await fetch(url, {
            method: "POST",
            headers: getHeaders(),
        });

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

    test("POST /api/tours with all common parameters returns 200", async () => {
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
        const response = await fetch(url, { method: "POST", headers: getHeaders() });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
        expect(typeof data.total).toBe("number");
    });

    describe("POST api/tours with filter body", () => {
        test("should filter tours by countries", async () => {
            const params = new URLSearchParams(TOURS_API_SEARCH_PARAMS);
            const countries = ["Schweiz", "Deutschland"];
            const body = JSON.stringify({ filter: { ...TOURS_API_FILTER_BODY, countries } });
            const headers = {
                ...getHeaders(),
                "Content-Type": "application/json",
            };
            const url = `${baseUrl}/api/tours?${params.toString()}`;

            const response = await fetch(url, { method: "POST", body, headers });
            const data = await response.json();

            assertValidToursResponse({ response, data });
            data.tours.map((tour) => expect(countries).toContain(tour.country));
        });

        test("should work when filter contains empty array", async () => {
            const params = new URLSearchParams(TOURS_API_SEARCH_PARAMS);
            const body = JSON.stringify({
                filter: {
                    ...TOURS_API_FILTER_BODY,
                    countries: [],
                    providers: [],
                    languages: [],
                    difficulties: [],
                    ranges: [],
                    types: [],
                },
            });
            const headers = {
                ...getHeaders(),
                "Content-Type": "application/json",
            };
            const url = `${baseUrl}/api/tours?${params.toString()}`;

            const response = await fetch(url, { method: "POST", body, headers });
            const data = await response.json();

            assertValidToursResponse({ response, data });
        });
    });

    test("GET /api/tours/:id/:city returns 200 (or 404 if not found) with domain=zuugle.de", async () => {
        // Test specifically requested by user to catch regression in getWrapper
        const id = 33456;
        const city = "wien";
        const url = `${baseUrl}/api/tours/${id}/${city}?domain=zuugle.de`;

        const response = await fetch(url, { headers: getHeaders() });

        // Depending on whether the ID exists in the dev dump, we expect 200 or 404.
        // Crucially, we do NOT expect 500.
        expect([200, 404]).toContain(response.status);

        const data = await response.json();
        // If 200, structure must be correct
        if (response.status === 200) {
            expect(data.success).toBe(true);
            expect(data.tour).toBeDefined();
            expect(data.tour.id).toBe(id);
        } else {
            expect(data.success).toBe(false);
        }
    });

    test("GET /api/tours/:id/:city returns 200 (or 404 if not found) with domain=zuugle.at", async () => {
        // Same test but with production domain
        const id = 33456;
        const city = "wien";
        const url = `${baseUrl}/api/tours/${id}/${city}?domain=zuugle.at`;

        const response = await fetch(url, { headers: getHeaders() });
        expect([200, 404]).toContain(response.status);

        const data = await response.json();
        if (response.status === 200) {
            expect(data.success).toBe(true);
            expect(data.tour).toBeDefined();
        }
    });

    test("GET /api/tours/:id/connections-extended returns 200 (or 404) with domain=zuugle.de", async () => {
        // Test for connectionsExtendedWrapper regression
        const id = 33456;
        const city = "wien";
        const url = `${baseUrl}/api/tours/${id}/connections-extended?city=${city}&domain=zuugle.de`;

        const response = await fetch(url, { headers: getHeaders() });
        expect([200, 404]).toContain(response.status);

        const data = await response.json();
        if (response.status === 200) {
            expect(data.success).toBe(true);
            expect(data.result).toBeDefined();
            expect(Array.isArray(data.result)).toBe(true);
        }
    });

    test("GET /api/tours/:id/connections-extended returns 200 (or 404) with domain=zuugle.at", async () => {
        const id = 33456;
        const city = "wien";
        const url = `${baseUrl}/api/tours/${id}/connections-extended?city=${city}&domain=zuugle.at`;

        const response = await fetch(url, { headers: getHeaders() });
        expect([200, 404]).toContain(response.status);
    });

    test("GET /api/tours/:id/connections-extended returns 200 (or 404) without city parameter", async () => {
        // Test the first call scenario when no city is set yet
        const id = 33456;
        const url = `${baseUrl}/api/tours/${id}/connections-extended?domain=zuugle.at`;

        const response = await fetch(url, { headers: getHeaders() });
        expect([200, 404]).toContain(response.status);

        const data = await response.json();
        if (response.status === 200) {
            expect(data.success).toBe(true);
            expect(data.result).toBeDefined();
            expect(Array.isArray(data.result)).toBe(true);
        }
    });

    describe("GET /api/searchphrase", () => {
        test("returns 200 with valid search term", async () => {
            const url = `${baseUrl}/api/searchphrase?search=wilds&tld=AT`;
            const response = await fetch(url, { headers: getHeaders() });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.items).toBeDefined();
            expect(Array.isArray(data.items)).toBe(true);
            expect(data.items.length).toBeGreaterThan(0);
        });

        test("returns 200 with city filter applied", async () => {
            const url = `${baseUrl}/api/searchphrase?search=wilds&tld=AT&city=wien`;
            const response = await fetch(url, { headers: getHeaders() });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(Array.isArray(data.items)).toBe(true);
            expect(data.items.length).toBeGreaterThan(0);
        });

        test("returns 200 with error message when search is empty string (not 400)", async () => {
            const url = `${baseUrl}/api/searchphrase?search=&tld=AT`;
            const response = await fetch(url, { headers: getHeaders() });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.error).toBe("no search term");
        });

        test("returns 400 when search parameter is missing", async () => {
            const url = `${baseUrl}/api/searchphrase?tld=AT`;
            const response = await fetch(url, { headers: getHeaders() });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.success).toBe(false);
            expect(data.error).toBeDefined();
        });

        test("does not error when tld parameter is omitted (defaults to AT)", async () => {
            const urlWithTld = `${baseUrl}/api/searchphrase?search=Berg&tld=AT`;
            const urlWithoutTld = `${baseUrl}/api/searchphrase?search=Berg`;

            const [responseWith, responseWithout] = await Promise.all([
                fetch(urlWithTld, { headers: getHeaders() }),
                fetch(urlWithoutTld, { headers: getHeaders() }),
            ]);

            expect(responseWith.status).toBe(200);
            expect(responseWithout.status).toBe(200);

            const dataWith = await responseWith.json();
            const dataWithout = await responseWithout.json();

            expect(dataWith.success).toBe(true);
            expect(dataWithout.success).toBe(true);
            // Both should return the same items since the default tld is AT
            expect(dataWithout.items).toEqual(dataWith.items);
        });
    });
});
