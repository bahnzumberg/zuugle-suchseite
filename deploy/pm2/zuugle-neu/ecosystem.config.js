module.exports = {
    apps : [
        {
            name: 'zuugle_api',
            script: './api/index.js',
            log_date_format: "YYYY-MM-DD",
        instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: 'production'
            },
        }
    ],
};
