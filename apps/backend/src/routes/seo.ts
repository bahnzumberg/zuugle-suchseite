import express from "express";
import knex from "../knex";
import { rangeImagePath } from "../utils/assetPaths";
import logger from "../utils/logger";

const router = express.Router();

export type SupportedLang = "de" | "sl" | "it" | "fr" | "en";

interface TranslationStrings {
    tourFrom: (provider: string) => string;
    days: (count: number) => string;
    difficulties: Record<number, string>;
    tourTypes: Record<string, string>;
    maxElevationPrefix: string;
    cta: string;
    locale: string;
    defaultProvider: string;
}

const I18N: Record<SupportedLang, TranslationStrings> = {
    de: {
        tourFrom: (provider) => `Eine Tour von ${provider}`,
        days: (count) => `${count} Tage`,
        difficulties: { 1: "Leicht", 2: "Mittel", 3: "Schwer" },
        tourTypes: {
            wandern: "Wandern",
            "bike & hike": "Bike & Hike",
            bike_hike: "Bike & Hike",
            hochtour: "Hochtour",
            klettern: "Klettern",
            klettersteig: "Klettersteig",
            langlaufen: "Langlaufen",
            rodeln: "Rodeln",
            schneeschuh: "Schneeschuh",
            skitour: "Skitour",
            trailrunning: "Trailrunning",
            weitwandern: "Weitwandern",
        },
        maxElevationPrefix: "Max.",
        cta: "Zuugle Tour aufrufen",
        locale: "de-AT",
        defaultProvider: "Bahn zum Berg",
    },
    sl: {
        tourFrom: (provider) => `Tura ponudnika ${provider}`,
        days: (count) => `${count} dni`,
        difficulties: { 1: "Enostavno", 2: "Srednje", 3: "Težavno" },
        tourTypes: {
            wandern: "Planinarjenje",
            "bike & hike": "Kolo & pohod",
            bike_hike: "Kolo & pohod",
            hochtour: "Višinska tura",
            klettern: "Plezanje",
            klettersteig: "Zavarovana plezalna pot",
            langlaufen: "Tek na smučeh",
            rodeln: "Sankanje",
            schneeschuh: "Krpljanje",
            skitour: "Turno smučanje",
            trailrunning: "Gorski tek",
            weitwandern: "Daljinske pohodniške poti",
        },
        maxElevationPrefix: "Maks.",
        cta: "Odpri turo na Zuugle",
        locale: "sl-SI",
        defaultProvider: "Bahn zum Berg",
    },
    it: {
        tourFrom: (provider) => `Un tour di ${provider}`,
        days: (count) => `${count} giorni`,
        difficulties: { 1: "Facile", 2: "Medio", 3: "Difficile" },
        tourTypes: {
            wandern: "Escursionismo",
            "bike & hike": "Bike & hike",
            bike_hike: "Bike & hike",
            hochtour: "Alpinismo",
            klettern: "Arrampicata",
            klettersteig: "Ferrata",
            langlaufen: "Sci di fondo",
            rodeln: "Slittino",
            schneeschuh: "Ciaspole",
            skitour: "Scialpinismo",
            trailrunning: "Trail running",
            weitwandern: "Trekking",
        },
        maxElevationPrefix: "Max.",
        cta: "Apri tour su Zuugle",
        locale: "it-IT",
        defaultProvider: "Bahn zum Berg",
    },
    fr: {
        tourFrom: (provider) => `Un itinéraire de ${provider}`,
        days: (count) => `${count} jours`,
        difficulties: { 1: "Facile", 2: "Moyenne", 3: "Difficile" },
        tourTypes: {
            wandern: "Randonnée",
            "bike & hike": "Randonnée VTT",
            bike_hike: "Randonnée VTT",
            hochtour: "Alpinisme",
            klettern: "Escalade",
            klettersteig: "Via ferrata",
            langlaufen: "Ski de fond",
            rodeln: "Luge",
            schneeschuh: "Raquettes",
            skitour: "Ski de randonnée",
            trailrunning: "Trail",
            weitwandern: "Itinérance pédestre",
        },
        maxElevationPrefix: "Max.",
        cta: "Voir la randonnée sur Zuugle",
        locale: "fr-FR",
        defaultProvider: "Bahn zum Berg",
    },
    en: {
        tourFrom: (provider) => `A tour by ${provider}`,
        days: (count) => `${count} days`,
        difficulties: { 1: "Easy", 2: "Medium", 3: "Hard" },
        tourTypes: {
            wandern: "Hiking",
            "bike & hike": "Bike & Hike",
            bike_hike: "Bike & Hike",
            hochtour: "Tour of High Alps",
            klettern: "Climbing",
            klettersteig: "Via ferrata",
            langlaufen: "Cross-country skiing",
            rodeln: "Tobogganing",
            schneeschuh: "Snowshoe",
            skitour: "Skitour",
            trailrunning: "Trail running",
            weitwandern: "Long-distance hiking",
        },
        maxElevationPrefix: "Max.",
        cta: "Open tour on Zuugle",
        locale: "en-US",
        defaultProvider: "Bahn zum Berg",
    },
};

export function detectLanguage(host: string, queryLang?: unknown): SupportedLang {
    if (typeof queryLang === "string") {
        const ql = queryLang.toLowerCase();
        if (["de", "sl", "it", "fr", "en"].includes(ql)) {
            return ql as SupportedLang;
        }
    }
    const lowerHost = host.toLowerCase();
    if (lowerHost.includes("zuugle.si")) return "sl";
    if (lowerHost.includes("zuugle.it")) return "it";
    if (lowerHost.includes("zuugle.fr")) return "fr";
    if (
        lowerHost.includes("zuugle.de") ||
        lowerHost.includes("zuugle.ch") ||
        lowerHost.includes("zuugle.li") ||
        lowerHost.includes("zuugle.at")
    ) {
        return "de";
    }
    return "de";
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function formatDuration(
    durationHours: number | null,
    numberOfDays: number | null,
    lang: SupportedLang,
): string | null {
    if (numberOfDays && numberOfDays > 1) {
        return I18N[lang].days(numberOfDays);
    }
    if (durationHours && durationHours > 0) {
        const hours = Math.floor(durationHours);
        const mins = Math.round((durationHours - hours) * 60);
        return `${hours}:${String(mins).padStart(2, "0")} h`;
    }
    return null;
}

function formatTourType(rawType: string | null | undefined, lang: SupportedLang): string | null {
    if (!rawType) return null;
    const key = rawType.trim().toLowerCase();
    return I18N[lang].tourTypes[key] || rawType;
}

function formatDifficulty(
    difficulty: number | null | undefined,
    lang: SupportedLang,
): string | null {
    if (!difficulty) return null;
    return I18N[lang].difficulties[difficulty] || null;
}

/**
 * Builds the rich OpenGraph description string combining title, provider, and metrics in the target language.
 */
function buildOgDescription(
    tour: {
        title: string | null;
        provider_name: string | null;
        type: string | null;
        duration: number | null;
        number_of_days: number | null;
        distance: number | null;
        difficulty: number | null;
        ascent: number | null;
        descent: number | null;
        max_ele: number | null;
    },
    lang: SupportedLang,
): string {
    const t = I18N[lang];
    const providerName = tour.provider_name || t.defaultProvider;
    const parts: string[] = [];

    // Title and provider prefix
    const tourFromStr = t.tourFrom(providerName);
    if (tour.title) {
        parts.push(`${tour.title} – ${tourFromStr}`);
    } else {
        parts.push(tourFromStr);
    }

    // Sport type (e.g. Wandern, Planinarjenje, Escursionismo)
    const formattedType = formatTourType(tour.type, lang);
    if (formattedType) {
        parts.push(formattedType);
    }

    // Duration (e.g. 5:00 h or 3 Tage / 3 dni)
    const formattedDuration = formatDuration(tour.duration, tour.number_of_days, lang);
    if (formattedDuration) {
        parts.push(formattedDuration);
    }

    // Distance in km
    if (tour.distance && tour.distance > 0) {
        parts.push(`${Math.round(tour.distance)} km`);
    }

    // Difficulty (Leicht / Enostavno / Facile...)
    const diffText = formatDifficulty(tour.difficulty, lang);
    if (diffText) {
        parts.push(diffText);
    }

    // Elevation metrics
    if (tour.ascent && tour.ascent > 0) {
        parts.push(`↑ ${Math.round(tour.ascent)} m`);
    }
    if (tour.descent && tour.descent > 0) {
        parts.push(`↓ ${Math.round(tour.descent)} m`);
    }
    if (tour.max_ele && tour.max_ele > 0) {
        parts.push(
            `${t.maxElevationPrefix} ${Math.round(tour.max_ele).toLocaleString(t.locale)} m`,
        );
    }

    let description = parts.join(" · ");
    if (description.length > 200) {
        description = description.slice(0, 197) + "…";
    }
    return description;
}

/**
 * Resolves the absolute OpenGraph image URL.
 */
function resolveOgImage(
    rawImage: string | null | undefined,
    rangeSlug: string | null | undefined,
    origin: string,
): string {
    let img = rawImage;

    // Fall back to curated mountain range image if tour image is missing
    if ((!img || img.length < 5) && rangeSlug) {
        img = rangeImagePath(rangeSlug);
    }

    if (!img || img.length < 5) {
        return `${origin}/opengraph.jpg`;
    }

    // Sanitise: the sync job can double-append "?width=…&height=…" leaving
    // two "?" in the URL.  Keep only the first query string.
    const firstQ = img.indexOf("?");
    if (firstQ >= 0) {
        const secondQ = img.indexOf("?", firstQ + 1);
        if (secondQ >= 0) {
            img = img.slice(0, secondQ);
        }
    }

    if (img.startsWith("http://") || img.startsWith("https://")) {
        return img;
    }

    // Relative path handling
    if (img.startsWith("/public")) {
        return `${origin}${img}`;
    }
    if (img.startsWith("/")) {
        return `${origin}/public${img}`;
    }
    return `${origin}/public/${img}`;
}

/**
 * Handles bot / OpenGraph requests for tours:
 * /api/seo/tour/:id/:city?
 */
router.get(["/tour/:id", "/tour/:id/:city"], async (req, res) => {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId || "", 10);
    const rawCity = Array.isArray(req.params.city) ? req.params.city[0] : req.params.city;
    const city = rawCity || (typeof req.query.city === "string" ? req.query.city : null);

    if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
        res.status(400).send("Invalid tour ID");
        return;
    }

    const host = (req.get("x-forwarded-host") || req.get("host") || "www.zuugle.at").split(":")[0];
    const proto = req.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;
    const lang = detectLanguage(host, req.query.lang);

    try {
        let tour = await knex("tour")
            .select(
                "tour.id",
                "tour.title",
                "tour.description",
                "tour.image_url",
                "tour.provider",
                "tour.type",
                "tour.duration",
                "tour.distance",
                "tour.difficulty",
                "tour.ascent",
                "tour.descent",
                "tour.max_ele",
                "tour.number_of_days",
                "tour.range_slug",
                "tour.range",
                "provider.provider_name",
            )
            .leftJoin("provider", "tour.provider", "provider.provider")
            .where("tour.id", id)
            .first();

        if (!tour) {
            tour = await knex("tour_inactive")
                .select(
                    "tour_inactive.id",
                    "tour_inactive.title",
                    "tour_inactive.description",
                    "tour_inactive.image_url",
                    "tour_inactive.provider",
                    "tour_inactive.type",
                    "tour_inactive.duration",
                    "tour_inactive.distance",
                    "tour_inactive.difficulty",
                    "tour_inactive.ascent",
                    "tour_inactive.descent",
                    "tour_inactive.max_ele",
                    "tour_inactive.number_of_days",
                    "tour_inactive.range_slug",
                    "tour_inactive.range",
                    "provider.provider_name",
                )
                .leftJoin("provider", "tour_inactive.provider", "provider.provider")
                .where("tour_inactive.id", id)
                .first();
        }

        if (!tour) {
            res.status(404).send("Tour not found");
            return;
        }

        const tourTitle = tour.title || "Öffi-Bergtour";
        const ogTitle = `Zuugle: ${tourTitle}`;
        const ogDescription = buildOgDescription(tour, lang);
        const ogImage = resolveOgImage(tour.image_url, tour.range_slug, origin);

        // Build canonical URL including city and query params (e.g. ?diana-share=...)
        const cityPath = city && city !== "no-city" ? `/${city}` : "";
        const queryIdx = req.originalUrl.indexOf("?");
        const queryString = queryIdx >= 0 ? req.originalUrl.slice(queryIdx) : "";
        const canonicalUrl = `${origin}/tour/${id}${cityPath}${queryString}`;

        const schemaJson = {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: tourTitle,
            description: tour.description || ogDescription,
            image: ogImage,
            inLanguage: lang,
            touristType: tour.type || "Hiking",
            provider: {
                "@type": "Organization",
                name: tour.provider_name || I18N[lang].defaultProvider,
            },
        };

        const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(ogTitle)}</title>
  <meta name="description" content="${escapeHtml(ogDescription)}" />

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Zuugle" />
  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
  </script>
</head>
<body>
  <article>
    <h1>${escapeHtml(tourTitle)}</h1>
    <p>${escapeHtml(I18N[lang].tourFrom(tour.provider_name || I18N[lang].defaultProvider))}</p>
    <p>${escapeHtml(ogDescription)}</p>
    <p><a href="${escapeHtml(canonicalUrl)}">${escapeHtml(I18N[lang].cta)}</a></p>
  </article>
</body>
</html>`;

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.status(200).send(html);
    } catch (err) {
        logger.error("Error generating SEO / OpenGraph preview:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
