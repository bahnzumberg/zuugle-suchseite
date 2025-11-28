//configuration allows a server to accept requests from specific domains ("whitelist")
// and reject requests from all other domains.
export const getZuugleCors = () => {
    const whitelist = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:4000",
        "http://localhost:6060",
        "http://localhost:7070",
        "http://localhost",
        "https://www.zuugle.at",
        "https://www.zuugle.de",
        "https://www.zuugle.ch",
        "https://www.zuugle.it",
        "https://www.zuugle.si",
        "https://www.zuugle.li",
        "https://www.zuugle.fr",
        "https://www2.zuugle.at",
        "https://www2.zuugle.de",
        "https://www2.zuugle.ch",
        "https://www2.zuugle.it",
        "https://www2.zuugle.li",
        "https://www2.zuugle.si",
        "https://www2.zuugle.fr",
        "https://dev.zuugle.at",
    ];

    const corsOptions = {
        origin: function (origin, callback) {
            if (origin === undefined || whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    };
    return corsOptions;
};

export const hostMiddleware = (req, res, next) => {
    const isPostman =
        !!req.headers["user-agent"] &&
        req.headers["user-agent"].indexOf("Postman") >= 0;
    const hostWhitelist = [
        "localhost:8080",
        "localhost:3000",
        "localhost:4000",
        "www.zuugle.at",
        "www.zuugle.de",
        "www.zuugle.ch",
        "www.zuugle.it",
        "www.zuugle.fr",
        "www.zuugle.li",
        "www.zuugle.si",
        "www2.zuugle.at",
        "www2.zuugle.de",
        "www2.zuugle.ch",
        "www2.zuugle.it",
        "www2.zuugle.fr",
        "www2.zuugle.si",
        "www2.zuugle.li",
        "dev.zuugle.at",
    ];
    try {
        const host = req.headers["host"];
        if (hostWhitelist.indexOf(host) === -1 || isPostman) {
            res.status(500).json({});
            return;
        } else {
            next();
        }
    } catch (e) {
        console.error(e);
    }
};
