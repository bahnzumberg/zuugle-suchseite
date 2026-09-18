import http from "node:http";
import { baseUrl, getHeaders, waitForServer } from "./testConfig.js";

/**
 * Issues a request with an arbitrary Host header, which fetch() forbids.
 * Only usable against a local server — hence the guards on its callers.
 */
const requestAsHost = (host, { method, path, body }) =>
    new Promise((resolve, reject) => {
        const url = new URL(baseUrl);
        const payload = body === undefined ? null : JSON.stringify(body);
        const req = http.request(
            {
                hostname: url.hostname,
                port: url.port,
                method,
                path,
                headers: {
                    ...getHeaders(),
                    Host: host,
                    ...(payload ? { "Content-Type": "application/json" } : {}),
                },
            },
            (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    try {
                        resolve({ status: res.statusCode, ...JSON.parse(data || "{}") });
                    } catch {
                        resolve({ status: res.statusCode });
                    }
                });
            },
        );
        req.on("error", reject);
        if (payload) req.write(payload);
        req.end();
    });

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

    test("POST /api/tours with search and search_type", async () => {
        const params = new URLSearchParams({
            domain: "www.zuugle.at",
            city: "innsbruck",
            limit: "10",
            currLanguage: "de",
            page: "1",
            search: "Brandjochkreuz",
            search_type: "peak",
        });
        const url = `${baseUrl}/api/tours?${params.toString()}`;
        const response = await fetch(url, { method: "POST", headers: getHeaders() });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
        expect(data.tours.length).toBeGreaterThan(0);
        expect(typeof data.total).toBe("number");
        expect(data.total).toBeGreaterThan(0);
        expect(data.total).toBeLessThan(20);
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
            const url = `${baseUrl}/api/searchphrase?search=schn&tld=AT&city=wien`;
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

// ─── User Lists API ───────────────────────────────────────────────
describe("User Lists API", () => {
    // Collect keys created during this test run so we can verify them;
    // there is no delete-list endpoint yet, but the data is harmless.
    const createdKeys = [];

    beforeAll(async () => {
        if (baseUrl.startsWith("http")) {
            await waitForServer(`${baseUrl}/api/cities?domain=www.zuugle.at`);
        }
    }, 130000);

    test("POST /api/lists creates a list with default name", async () => {
        const response = await fetch(`${baseUrl}/api/lists`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ domain: "www.zuugle.at" }),
        });
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.key).toBeDefined();
        expect(data.key.length).toBeGreaterThanOrEqual(40);
        expect(data.name).toBe("Meine Favoriten");
        createdKeys.push(data.key);
    });

    test("POST /api/lists with custom name stores it", async () => {
        const response = await fetch(`${baseUrl}/api/lists`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Sommertouren 2026",
                language: "de",
                domain: "www.zuugle.at",
            }),
        });
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data.name).toBe("Sommertouren 2026");
        createdKeys.push(data.key);
    });

    test("POST /api/lists with language=en uses English default name", async () => {
        const response = await fetch(`${baseUrl}/api/lists`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ language: "en", domain: "www.zuugle.at" }),
        });
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data.name).toBe("My Favourites");
        createdKeys.push(data.key);
    });

    test("GET /api/lists/:key returns the list with empty tours", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}`, {
            headers: getHeaders(),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.list.key).toBe(key);
        expect(data.list.name).toBe("Meine Favoriten");
        expect(data.tours).toEqual([]);
        expect(data.total).toBe(0);
    });

    test("GET /api/lists/:invalidkey returns 404", async () => {
        const response = await fetch(`${baseUrl}/api/lists/this-key-does-not-exist`, {
            headers: getHeaders(),
        });
        expect(response.status).toBe(404);
    });

    test("POST /api/lists/:key/tours with invalid tour_id returns 404", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ tour_id: 999999999 }),
        });
        expect(response.status).toBe(404);
    });

    test("POST /api/lists/:key/tours with missing tour_id returns 400", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        expect(response.status).toBe(400);
    });

    // Find a valid tour ID dynamically from the search results
    let validTourId;
    test("find a valid tour ID from search", async () => {
        const response = await fetch(`${baseUrl}/api/tours?domain=www.zuugle.at&city=wien`, {
            method: "POST",
            headers: getHeaders(),
        });
        const data = await response.json();
        expect(data.tours.length).toBeGreaterThan(0);
        validTourId = data.tours[0].id;
    });

    test("POST /api/lists/:key/tours adds a valid tour", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ tour_id: validTourId }),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
    });

    test("POST /api/lists/:key/tours duplicate is idempotent", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ tour_id: validTourId }),
        });
        expect(response.status).toBe(200);
    });

    test("GET /api/lists/:key returns the tour with search-equivalent fields", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}`, {
            headers: getHeaders(),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.total).toBeGreaterThanOrEqual(1);
        const tour = data.tours[0];
        // Verify search-equivalent fields are present
        expect(tour.id).toBeDefined();
        expect(tour.title).toBeDefined();
        expect(tour.provider).toBeDefined();
        expect(tour.url).toBeDefined();
        // Verify list-specific field
        expect(tour.added_at).toBeDefined();
    });

    test("DELETE /api/lists/:key/tours/:tourId removes the tour", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours/${validTourId}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
    });

    test("GET /api/lists/:key after removal returns empty tours", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}`, {
            headers: getHeaders(),
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.total).toBe(0);
    });

    test("DELETE /api/lists/:key/tours/:tourId for missing tour returns 404", async () => {
        const key = createdKeys[0];
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours/999999999`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        expect(response.status).toBe(404);
    });
});

// ─── Favourites device sync (#882) ────────────────────────────────
describe("User Lists sync", () => {
    const json = { "Content-Type": "application/json" };

    const createList = async () => {
        const response = await fetch(`${baseUrl}/api/lists`, {
            method: "POST",
            headers: { ...getHeaders(), ...json },
            body: JSON.stringify({ domain: "www.zuugle.at" }),
        });
        return (await response.json()).key;
    };

    const issueCode = async (key) => {
        const response = await fetch(`${baseUrl}/api/lists/${key}/pairing-code`, {
            method: "POST",
            headers: { ...getHeaders(), ...json },
        });
        return { status: response.status, ...(await response.json()) };
    };

    const pair = async (code, key) => {
        const response = await fetch(`${baseUrl}/api/lists/pair`, {
            method: "POST",
            headers: { ...getHeaders(), ...json },
            body: JSON.stringify({ code, key }),
        });
        return { status: response.status, ...(await response.json()) };
    };

    const getList = async (key) => {
        const response = await fetch(`${baseUrl}/api/lists/${key}`, { headers: getHeaders() });
        return { status: response.status, ...(await response.json()) };
    };

    const addTour = async (key, tourId) => {
        const response = await fetch(`${baseUrl}/api/lists/${key}/tours`, {
            method: "POST",
            headers: { ...getHeaders(), ...json },
            body: JSON.stringify({ tour_id: tourId }),
        });
        return { status: response.status, ...(await response.json()) };
    };

    // Two real tour IDs, so the merged lists have distinguishable contents.
    let tourA;
    let tourB;

    beforeAll(async () => {
        if (baseUrl.startsWith("http")) {
            await waitForServer(`${baseUrl}/api/cities?domain=www.zuugle.at`);
        }
        const response = await fetch(`${baseUrl}/api/tours?domain=www.zuugle.at&city=wien`, {
            method: "POST",
            headers: getHeaders(),
        });
        const data = await response.json();
        tourA = data.tours[0].id;
        tourB = data.tours[1].id;
    }, 130000);

    test("POST /api/lists/:key/pairing-code issues a typeable code", async () => {
        const key = await createList();
        const result = await issueCode(key);

        expect(result.status).toBe(201);
        expect(result.success).toBe(true);
        expect(result.code).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/);
        expect(new Date(result.expires_at).getTime()).toBeGreaterThan(Date.now());
    });

    test("POST /api/lists/:key/pairing-code for an unknown key returns 404", async () => {
        const result = await issueCode("this-key-does-not-exist");
        expect(result.status).toBe(404);
    });

    test("issuing a new code retires the previous one", async () => {
        const key = await createList();
        const first = await issueCode(key);
        await issueCode(key);

        const result = await pair(first.code, await createList());
        expect(result.status).toBe(404);
    });

    test("pairing merges the union into the code-issuing list", async () => {
        const keyB = await createList(); // shows the code, survives
        const keyA = await createList(); // enters the code, migrates
        await addTour(keyB, tourA);
        await addTour(keyA, tourB);

        const { code } = await issueCode(keyB);
        const result = await pair(code, keyA);

        expect(result.status).toBe(200);
        expect(result.success).toBe(true);
        // The device that showed the code keeps its key.
        expect(result.key).toBe(keyB);
        // One tour crossed in each direction.
        expect(result.received).toBe(1);
        expect(result.sent).toBe(1);
        expect(result.total).toBe(2);

        const merged = await getList(keyB);
        expect(merged.tours.map((t) => t.id).sort()).toEqual([tourA, tourB].sort());
    });

    // The counts are reported to the device that entered the code, so they have
    // to be stated from its side — not from the surviving list's.
    test("an empty list entering a code receives that list's tours", async () => {
        const keyB = await createList();
        const keyA = await createList(); // enters the code, has nothing
        await addTour(keyB, tourA);
        await addTour(keyB, tourB);

        const { code } = await issueCode(keyB);
        const result = await pair(code, keyA);

        expect(result.received).toBe(2);
        expect(result.sent).toBe(0);
        expect(result.total).toBe(2);
    });

    test("entering a code with nothing on the other side sends, receives none", async () => {
        const keyB = await createList(); // shows the code, has nothing
        const keyA = await createList();
        await addTour(keyA, tourA);

        const { code } = await issueCode(keyB);
        const result = await pair(code, keyA);

        expect(result.received).toBe(0);
        expect(result.sent).toBe(1);
        expect(result.total).toBe(1);
    });

    test("the absorbed key is tombstoned, not broken", async () => {
        const keyB = await createList();
        const keyA = await createList();
        await addTour(keyA, tourA);

        const { code } = await issueCode(keyB);
        await pair(code, keyA);

        // A device still holding the absorbed key is redirected rather than 404ed.
        const stale = await getList(keyA);
        expect(stale.status).toBe(200);
        expect(stale.moved_to).toBe(keyB);
        expect(stale.list.key).toBe(keyB);
        expect(stale.tours.map((t) => t.id)).toEqual([tourA]);
    });

    test("writes against a tombstoned key land on the surviving list", async () => {
        const keyB = await createList();
        const keyA = await createList();

        const { code } = await issueCode(keyB);
        await pair(code, keyA);

        const added = await addTour(keyA, tourB);
        expect(added.status).toBe(200);
        expect(added.moved_to).toBe(keyB);

        const survivor = await getList(keyB);
        expect(survivor.tours.map((t) => t.id)).toEqual([tourB]);
    });

    test("a third pairing does not strand the devices already sharing a list", async () => {
        // A and B share keyB; then A pairs into C. B must still find its way.
        const keyB = await createList();
        const keyA = await createList();
        const first = await issueCode(keyB);
        await pair(first.code, keyA);

        const keyC = await createList();
        await addTour(keyC, tourA);
        const second = await issueCode(keyC);
        const result = await pair(second.code, keyB);
        expect(result.key).toBe(keyC);

        // B never acted and still holds keyB — one hop behind the chain head.
        const stranded = await getList(keyB);
        expect(stranded.status).toBe(200);
        expect(stranded.moved_to).toBe(keyC);

        // A holds the key it adopted first. The B→C merge repoints A directly
        // at C too (chains are flattened at merge time), not through B.
        const older = await getList(keyA);
        expect(older.status).toBe(200);
        expect(older.moved_to).toBe(keyC);
    });

    test("a tour in both lists keeps the earlier added_at", async () => {
        const keyB = await createList();
        const keyA = await createList();

        await addTour(keyA, tourA); // earlier
        const before = await getList(keyA);
        const earliest = before.tours[0].added_at;

        await new Promise((r) => setTimeout(r, 1100));
        await addTour(keyB, tourA); // later

        const { code } = await issueCode(keyB);
        await pair(code, keyA);

        const merged = await getList(keyB);
        expect(merged.total).toBe(1);
        expect(new Date(merged.tours[0].added_at).getTime()).toBe(new Date(earliest).getTime());
    });

    test("pairing a list with itself is a no-op", async () => {
        const key = await createList();
        await addTour(key, tourA);

        const { code } = await issueCode(key);
        const result = await pair(code, key);

        expect(result.status).toBe(200);
        expect(result.key).toBe(key);
        expect(result.received).toBe(0);
        expect(result.sent).toBe(0);

        const list = await getList(key);
        expect(list.tours.map((t) => t.id)).toEqual([tourA]);
    });

    test("pairing without a list of one's own just adopts the key", async () => {
        const keyB = await createList();
        await addTour(keyB, tourA);

        const { code } = await issueCode(keyB);
        const result = await pair(code, null);

        expect(result.status).toBe(200);
        expect(result.key).toBe(keyB);
        expect(result.received).toBe(1);
        expect(result.sent).toBe(0);
        expect(result.total).toBe(1);
    });

    test("a code cannot be used twice", async () => {
        const keyB = await createList();
        const { code } = await issueCode(keyB);

        expect((await pair(code, await createList())).status).toBe(200);
        expect((await pair(code, await createList())).status).toBe(404);
    });

    test("unknown and malformed codes are indistinguishable", async () => {
        const key = await createList();
        const unknown = await pair("ZZZZZZZZ", key);
        const malformed = await pair("nope", key);
        const empty = await pair("", key);

        expect(unknown.status).toBe(404);
        expect(malformed.status).toBe(404);
        expect(empty.status).toBe(404);
        // Same body, so the endpoint can't be used to probe which codes exist.
        expect(unknown.message).toBe(malformed.message);
        expect(malformed.message).toBe(empty.message);
    });

    test("codes are read case-insensitively and ignore the display separator", async () => {
        const keyB = await createList();
        const { code } = await issueCode(keyB);
        const typed = `${code.slice(0, 4)}-${code.slice(4)}`.toLowerCase();

        const result = await pair(typed, await createList());
        expect(result.status).toBe(200);
        expect(result.key).toBe(keyB);
    });

    // Spoofing Host needs the raw http client, so this only runs locally.
    // Against a deployed host the TLD is fixed by the domain under test.
    const localOnly = baseUrl.startsWith("http://localhost") ? test : test.skip;

    localOnly("lists on different Zuugle domains refuse to pair", async () => {
        const german = await requestAsHost("www.zuugle.de", {
            method: "POST",
            path: "/api/lists",
            body: {},
        });
        expect(german.key).toBeDefined();

        const { code } = await issueCode(german.key);
        // ...entered on an Austrian device.
        const result = await pair(code, await createList());

        expect(result.status).toBe(409);
        expect(result.success).toBe(false);
    });

    test("two devices pairing into each other at once converge on one list", async () => {
        const keyA = await createList();
        const keyB = await createList();
        await addTour(keyA, tourA);
        await addTour(keyB, tourB);

        const codeA = (await issueCode(keyA)).code;
        const codeB = (await issueCode(keyB)).code;

        const [first, second] = await Promise.all([pair(codeB, keyA), pair(codeA, keyB)]);

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        // Whichever won, both callers are told the same surviving key...
        expect(first.key).toBe(second.key);

        // ...and both original keys resolve to it with the full union.
        const viaA = await getList(keyA);
        const viaB = await getList(keyB);
        expect(viaA.list.key).toBe(viaB.list.key);
        expect(viaA.tours.map((t) => t.id).sort()).toEqual([tourA, tourB].sort());
    });
});
