import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

export const swaggerDocs = (app) => {
    let version = "0.0.0";
    try {
        // Try to locate package.json in root (Dev) or one level up (Prod/Build)
        // In Dev: src/utils/swagger.js -> ../../package.json
        // In Prod: build/utils/swagger.js -> ../package.json
        const possiblePaths = [
            path.join(__dirname, "../../package.json"),
            path.join(__dirname, "../package.json"),
            path.join(process.cwd(), "package.json"),
        ];

        let packageJsonPath = possiblePaths.find((p) => fs.existsSync(p));

        if (packageJsonPath) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
            version = packageJson.version;
        }
    } catch (e) {
        console.warn("Swagger: Could not load package.json version", e.message);
    }

    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Zuugle API Documentation",
                version: version,
                description:
                    "API documentation for the Zuugle backend. This documentation is automatically generated from the code.",
            },
            servers: [
                {
                    url: "https://www2.zuugle.at",
                    description: "UAT Server",
                },
                {
                    url: "https://www.zuugle.at",
                    description: "Production Server",
                },
                {
                    url: "http://localhost:8080",
                    description: "Local Development",
                },
            ],
        },
        apis: ["./src/routes/*.js", "./build/routes/*.js", "./routes/*.js"], // Attempt to cover dev and prod paths
    };

    try {
        const swaggerSpec = swaggerJsdoc(options);

        // Swagger UI
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // JSON Endpoint
        app.get("/api-docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerSpec);
        });
    } catch (err) {
        console.error("Swagger init failed:", err);
    }
};
