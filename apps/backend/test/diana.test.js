import express from "express";
import http from "node:http";
import dianaRouter from "../src/routes/diana.js";
import cacheService from "../src/services/cache.js";
import * as dianaService from "../src/services/dianaService.js";

describe("Diana routes & caching", () => {
    let server;
    let baseUrl;
    let proxyGetMock;
    let cacheSetSpy;

    beforeAll((done) => {
        const app = express();
        app.use(express.json());
        app.use("/api/diana", dianaRouter);

        server = http.createServer(app);
        server.listen(0, "127.0.0.1", () => {
            const address = server.address();
            baseUrl = `http://127.0.0.1:${address.port}`;
            done();
        });
    });

    afterAll((done) => {
        if (server.closeAllConnections) {
            server.closeAllConnections();
        }
        server.close(done);
    });

    beforeEach(() => {
        jest.restoreAllMocks();
        proxyGetMock = jest.spyOn(dianaService, "proxyGet").mockImplementation(async (path) => {
            if (path === "/quota") {
                return {
                    status: 200,
                    body: {
                        plans: [{ plan: "free", requests_per_minute: 60 }],
                        usage: { requests_today: 10 },
                    },
                };
            }
            if (path === "/connections") {
                return {
                    status: 200,
                    body: {
                        activity: { activity_name: "Test" },
                        connections: {
                            to_activity: [],
                            from_activity: [],
                            recommended_to_activity_connection: 1,
                            recommended_from_activity_connection: 2,
                        },
                    },
                };
            }
            return { status: 404, body: { error: "Not found" } };
        });

        cacheSetSpy = jest.spyOn(cacheService, "set").mockImplementation(() => {});
        jest.spyOn(cacheService, "get").mockImplementation(async () => null);
    });

    test("GET /api/diana/quota proxies to Diana /quota", async () => {
        const res = await fetch(`${baseUrl}/api/diana/quota`);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.plans[0].plan).toBe("free");
        expect(proxyGetMock).toHaveBeenCalledWith("/quota", "");
    });

    test("GET /api/diana/connections for TODAY sets Valkey TTL to 5 minutes (300 seconds)", async () => {
        const todayVienna = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Europe/Vienna",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());

        const res = await fetch(
            `${baseUrl}/api/diana/connections?user_start_location=16.37,48.20&date=${todayVienna}&include_past=true`,
        );
        expect(res.status).toBe(200);

        expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        const [key, , ttl] = cacheSetSpy.mock.calls[0];
        expect(key).toContain("diana:connections:");
        expect(key).toContain(todayVienna);
        expect(ttl).toBe(300); // Exactly 5 minutes!
    });

    test("GET /api/diana/connections for FUTURE date sets Valkey TTL to 24 hours (86400 seconds)", async () => {
        const futureDate = "2099-01-01";

        const res = await fetch(
            `${baseUrl}/api/diana/connections?user_start_location=16.37,48.20&date=${futureDate}`,
        );
        expect(res.status).toBe(200);

        expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        const [key, , ttl] = cacheSetSpy.mock.calls[0];
        expect(key).toContain("diana:connections:");
        expect(key).toContain(futureDate);
        expect(ttl).toBe(86400); // 24 hours!
    });

    test("GET /api/diana/connections with share_id uses dedicated share cache key and skips default times injection", async () => {
        const shareId = "sh-12345";
        const res = await fetch(
            `${baseUrl}/api/diana/connections?share_id=${shareId}&date=2099-01-01&use_flex=true`,
        );
        expect(res.status).toBe(200);

        expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        const [key] = cacheSetSpy.mock.calls[0];
        expect(key).toBe("diana:connections:share:sh-12345:2099-01-01::true:");

        // Verify that default activity times were NOT injected into query
        const queryArg = proxyGetMock.mock.calls[0][1];
        expect(queryArg).toContain("share_id=sh-12345");
        expect(queryArg).not.toContain("activity_earliest_start_time");
    });
});
