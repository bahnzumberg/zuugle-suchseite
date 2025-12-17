const baseUrl = 'https://www2.zuugle.at';
const apiUser = process.env.API_USER;
const apiPass = process.env.API_PASSWORD;

const getHeaders = () => {
    const headers = {};
    if (apiUser && apiPass) {
        const auth = Buffer.from(`${apiUser}:${apiPass}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
    }
    return headers;
};

describe('Zuugle API UAT Tests', () => {
    test('GET /api/cities returns 200 and list of cities', async () => {
        const url = `${baseUrl}/api/cities?domain=www.zuugle.at`;
        const response = await fetch(url, { headers: getHeaders() });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.cities)).toBe(true);
        expect(data.cities.length).toBeGreaterThan(0);
    });

    test('GET /api/tours returns 200 and list of tours', async () => {
        const url = `${baseUrl}/api/tours?domain=www.zuugle.at&city=wien`;
        const response = await fetch(url, { headers: getHeaders() });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(Array.isArray(data.tours)).toBe(true);
    });

    test('GET /api/tours/filter returns 200 and filter options', async () => {
        const url = `${baseUrl}/api/tours/filter?domain=www.zuugle.at&city=wien`;
        const response = await fetch(url, { headers: getHeaders() });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.filter).toBeDefined();
        expect(Array.isArray(data.filter.types)).toBe(true);
    });
});
