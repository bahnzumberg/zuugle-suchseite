import express from "express";
import cors from "cors";
import { API_PORT, PUBLIC_DIRS } from "./utils/assetPaths";
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
import matomoBotTracker from "./middlewares/matomoBotTracker";
import { swaggerDocs } from "./utils/swagger";
import logger from "./utils/logger";

process.env.TZ = "Europe/Berlin";

/* start api */
logger.info("__dirname=", __dirname);
logger.info("process.env.NODE_ENV=", process.env.NODE_ENV);

let corsOptions = getZuugleCors();

let app = express();
app.disable("x-powered-by"); // #917 — hide Express version
// One hop: nginx proxies to localhost and sets X-Forwarded-For (see
// deploy/nginx/*/snippets). Without this every request looks like it comes
// from 127.0.0.1 and the rate limiters in routes/lists.js would count the
// whole world as one client.
app.set("trust proxy", 1);

process.setMaxListeners(0);
// app.use(bodyParser.json({limit: '1024mb'}));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ limit: "1024mb", extended: false }));

// AI bot tracking — must run before CORS rejects non-whitelisted origins
app.use(matomoBotTracker);

// preflight options requests for json files fail otherwise
app.use((req, res, next) => {
    if (req.method === "OPTIONS" && req.path.startsWith("/public")) {
        return cors(corsOptions)(req, res, next);
    }
    next();
});
// Running from source, the hand-maintained assets (img/, fonts/, icons/,
// headless-leaflet/, favicons) live in the shared assets/public/ folder,
// separate from PUBLIC_DIR; in production build:copy has already merged them
// into the same folder, so PUBLIC_DIRS holds just the one. See assetPaths.ts.
for (const dir of PUBLIC_DIRS) {
    app.use("/public", cors(corsOptions), express.static(dir));
}

app.use("/api/tours", cors(corsOptions), hostMiddleware, authenticate, tours);
app.use("/api/cities", cors(corsOptions), hostMiddleware, authenticate, cities);
app.use("/api/city", cors(corsOptions), hostMiddleware, authenticate, cityRouter);
app.use("/api/cities2tour", cors(corsOptions), hostMiddleware, authenticate, cities2tourRouter);
// TODO: searchPhrases is the old endpoint for autocompletion. Can be removed once new POI system is functional.
app.use("/api/searchPhrases", cors(corsOptions), hostMiddleware, authenticate, searchPhrases);
app.use("/api/searchphrase", cors(corsOptions), hostMiddleware, authenticate, searchAutocomplete);
app.use("/api/diana", cors(corsOptions), hostMiddleware, authenticate, diana);
app.use("/api/licenses", cors(corsOptions), licenses);
// Rate limiting for these routes is applied inside routes/lists.js itself,
// next to the route definitions it governs.
app.use("/api/lists", cors(corsOptions), hostMiddleware, lists);
swaggerDocs(app);

app.listen(API_PORT, () => logger.info("Running on localhost:" + API_PORT));
