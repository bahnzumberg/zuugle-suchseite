module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    // pixelmatch v7+ and its pngjs dependency are ESM-only; transform them
    // through Babel so Jest (which runs in CJS mode) can load them.
    transformIgnorePatterns: ["/node_modules/(?!(pixelmatch|pngjs)/)"],
};
