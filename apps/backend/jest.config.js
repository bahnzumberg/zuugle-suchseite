module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.(js|ts)$": ["ts-jest", { diagnostics: false, tsconfig: "tsconfig.build.json" }],
    },
};
