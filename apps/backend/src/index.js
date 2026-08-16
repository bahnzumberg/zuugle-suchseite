import express from "express";
import cors from "cors";
import path from "path";
import { API_PORT, PUBLIC_DIR } from "./utils/assetPaths";
import tours from "./routes/tours";
import cities from "./routes/cities";
import { cityRouter, cities2tourRouter } from "./routes/cities";
import authenticate from "./middlewares/authenticate";
import { getZuugleCors, hostMiddleware } from "./utils/zuugleCors";
import searchPhrases from "./routes/searchPhrases";
import searchAutocomplete from "./routes/searchAutocomplete";
import diana from "./routes/diana";
import licenses from "./routes/licenses";
import lists from "./routes/lists";
import { swaggerDocs } from "./utils/swagger";
import logger from "./utils/logger";

process.env.TZ = "Europe/Berlin";

/* start api */
logger.info("__dirname=", __dirname);
logger.info("process.env.NODE_ENV=", process.env.NODE_ENV);

let corsOptions = getZuugleCors();

let app = express();
app.disable("x-powered-by"); // #917 — hide Express version

process.setMaxListeners(0);
// app.use(bodyParser.json({limit: '1024mb'}));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ limit: "1024mb", extended: false }));

// preflight options requests for json files fail otherwise
app.use((req, res, next) => {
    if (req.method === "OPTIONS" && req.path.startsWith("/public")) {
        return cors(corsOptions)(req, res, next);
    }
    next();
});
//static file access – provider logos rarely change, serve with long cache
app.use(
    "/public/icons/provider",
    cors(corsOptions),
    express.static(path.join(PUBLIC_DIR, "icons/provider"), {
        maxAge: "365d",
        immutable: true,
    }),
);
app.use("/public", cors(corsOptions), express.static(PUBLIC_DIR));

app.use("/api/tours", cors(corsOptions), hostMiddleware, authenticate, tours);
app.use("/api/cities", cors(corsOptions), hostMiddleware, authenticate, cities);
app.use("/api/city", cors(corsOptions), hostMiddleware, authenticate, cityRouter);
app.use("/api/cities2tour", cors(corsOptions), hostMiddleware, authenticate, cities2tourRouter);
// TODO: searchPhrases is the old endpoint for autocompletion. Can be removed once new POI system is functional.
app.use("/api/searchPhrases", cors(corsOptions), hostMiddleware, authenticate, searchPhrases);
app.use("/api/searchphrase", cors(corsOptions), hostMiddleware, authenticate, searchAutocomplete);
app.use("/api/diana", cors(corsOptions), hostMiddleware, authenticate, diana);
app.use("/api/licenses", cors(corsOptions), licenses);
app.use("/api/lists", cors(corsOptions), hostMiddleware, lists);
swaggerDocs(app);

app.listen(API_PORT, () => logger.info("Running on localhost:" + API_PORT));
