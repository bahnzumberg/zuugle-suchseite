import RateLimit from "express-rate-limit";
import express from "express";
import path from "path";
import compression from "compression";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var port = 4000;
const app = express();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Use Helmet for security headers
app.use(helmet());

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.set("trust proxy", 1 /* number of proxies between user and server */);
app.get("/ip", (request, response) => {
  response.send(request.ip);
});

app.use(compression());

app.listen(port);

app.use(
  "/app_static",
  express.static(path.join(__dirname, "../app/app_static")),
);
app.use(
  "/api",
  createProxyMiddleware({ target: "http://localhost:6060", secure: false }),
);
app.use(
  "/public",
  express.static(path.join(__dirname, "../api/public"), { fallthrough: false }),
);

app.use((req, res, next) => {
  next();
});

app.use((req, res, next) => {
  if (req.url.length > 1 && req.url.match(/.*\/$/)) {
    res.redirect(307, req.url.replace(/\/+$/, ""));
  } else {
    next();
  }
});

app.get(["/*"], function (req, res) {
  res.sendFile(path.join(__dirname, "../app/index.html"));
});
