module.exports = {
    apps : [
        {
            name: 'zuugle_api',
            script: './api/index.js',
            log_date_format: "YYYY-MM-DD",
            exec_mode: "fork_mode",
            env: {
                NODE_ENV: 'production',
                USE_CDN: 'false'
            },
        },
    {
            name: 'dev-zuugle_api',
            script: './dev-api/index.js',
            log_date_format: "YYYY-MM-DD",
            exec_mode: "fork_mode",
            env: {
                NODE_ENV: 'production',
                USE_CDN: 'false',
                DB_HOST: 'localhost',
                DB_PORT: 5433,
                DB_USER: 'postgres',
                DB_PASSWORD: "${DEV_DB_PASSWORD}",
                DB_NAME: 'zuugle_suchseite_dev',
                DB_CONTAINER_NAME: 'zuugle-postgres-dev',
                DB_POOL_MIN: 2,
                DB_POOL_MAX: 10,
            },
        },
    ],
};
