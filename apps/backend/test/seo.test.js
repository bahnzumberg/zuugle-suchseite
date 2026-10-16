jest.mock("../src/knex", () => ({
    __esModule: true,
    default: jest.fn(),
}));

import { buildOgDescription } from "../src/routes/seo";

describe("buildOgDescription", () => {
    const baseTour = {
        title: "Schrankogel Überschreitung von Gries",
        provider_name: "Bergfex.at",
        type: "wandern",
        duration: 9.5,
        number_of_days: null,
        distance: 20.2,
        difficulty: 3,
        ascent: 1900,
        descent: 1900,
        max_ele: 1744,
    };

    test("formats German highest point without thousands separator space", () => {
        const desc = buildOgDescription(baseTour, "de");
        expect(desc).toContain("Höchster Punkt 1744 m");
        expect(desc).not.toContain("Max. 1 744 m");
        expect(desc).toBe(
            "Eine Tour von Bergfex.at · Wandern · 9:30 h · 20 km · Schwer · ↑ 1900 m · ↓ 1900 m · Höchster Punkt 1744 m",
        );
    });

    test("formats Slovenian highest point", () => {
        const desc = buildOgDescription(baseTour, "sl");
        expect(desc).toContain("Najvišja točka 1744 m");
        expect(desc).toBe(
            "Tura ponudnika Bergfex.at · Planinarjenje · 9:30 h · 20 km · Težavno · ↑ 1900 m · ↓ 1900 m · Najvišja točka 1744 m",
        );
    });

    test("formats Italian highest point", () => {
        const desc = buildOgDescription(baseTour, "it");
        expect(desc).toContain("Punto più alto 1744 m");
        expect(desc).toBe(
            "Un tour di Bergfex.at · Escursionismo · 9:30 h · 20 km · Difficile · ↑ 1900 m · ↓ 1900 m · Punto più alto 1744 m",
        );
    });

    test("formats French highest point", () => {
        const desc = buildOgDescription(baseTour, "fr");
        expect(desc).toContain("Point culminant 1744 m");
        expect(desc).toBe(
            "Un itinéraire de Bergfex.at · Randonnée · 9:30 h · 20 km · Difficile · ↑ 1900 m · ↓ 1900 m · Point culminant 1744 m",
        );
    });

    test("formats English highest point", () => {
        const desc = buildOgDescription(baseTour, "en");
        expect(desc).toContain("Highest point 1744 m");
        expect(desc).toBe(
            "A tour by Bergfex.at · Hiking · 9:30 h · 20 km · Hard · ↑ 1900 m · ↓ 1900 m · Highest point 1744 m",
        );
    });

    test("omits highest point when max_ele is null or 0", () => {
        const descNull = buildOgDescription({ ...baseTour, max_ele: null }, "de");
        expect(descNull).not.toContain("Höchster Punkt");

        const descZero = buildOgDescription({ ...baseTour, max_ele: 0 }, "de");
        expect(descZero).not.toContain("Höchster Punkt");
    });
});
