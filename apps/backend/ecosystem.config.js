module.exports = {
    apps : [
        {
            name: 'zuugle_api',
            script: './api/index.js',
            log_date_format: "YYYY-MM-DD",
            exec_mode: "fork_mode",
            env: {
                NODE_ENV: 'production'
            },
        }
    ],
};



