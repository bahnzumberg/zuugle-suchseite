/**
 * Shared Test Configuration
 *
 * This module provides common configuration and utilities for all tests.
 */

export const baseUrl = process.env.API_BASE_URL || "https://www2.zuugle.at";
export const apiUser = process.env.API_USER || "bzb";
export const apiPass = process.env.API_PASSWORD || "bzb";

/**
 * Get HTTP headers with Basic Auth if credentials are available
 */
export const getHeaders = () => {
    const headers = {};
    if (apiUser && apiPass) {
        const auth = Buffer.from(`${apiUser}:${apiPass}`).toString("base64");
        headers["Authorization"] = `Basic ${auth}`;
    }
    return headers;
};

/**
 * Wait for server to become ready
 * @param {string} url - URL to check
 * @param {number} retries - Number of retry attempts (default: 24)
 * @param {number} delay - Delay between retries in ms (default: 5000)
 */
export const waitForServer = async (url, retries = 24, delay = 5000) => {
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
