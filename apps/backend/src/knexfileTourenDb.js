// Tour source database (MySQL, read-only) connection config — driven entirely by env vars.
require("dotenv").config({ quiet: true });

const config = {
    client: "mysql",
    connection: {
        host: process.env.TOUREN_DB_HOST,
        user: process.env.TOUREN_DB_USER,
        password: process.env.TOUREN_DB_PASSWORD,
        database: process.env.TOUREN_DB_NAME,
        charset: "utf8",
    },
};

module.exports = {
    production: config,
    development: config,
};
