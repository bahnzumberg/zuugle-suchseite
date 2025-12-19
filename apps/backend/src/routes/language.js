import express from "express";
import knex from "../knex";
let router = express.Router();
router.get("/language", (req, res) => languageWrapper(req, res));

const languageWrapper = async (req, res) => {
    const tld = req.query.tld;

    try {
        const result = await knex("logsearchphrase")
            .select("menu_lang")
            .count("* as count") // Count all rows as 'count'
            .where("country_code", tld)
            .groupBy("menu_lang")
            .orderBy("count", "desc") // Order by the 'count' column in descending order
            .limit(1);

        const language = result.length > 0 ? result[0].menu_lang : "en"; // Extract the language from the result or fallback to a default language code

        res.status(200).json({ success: true, language });
    } catch (error) {
        console.error("Error retrieving language:", error);
        res.status(500).json({
            success: false,
            error: "Failed to retrieve language",
        });
    }
};

export default languageWrapper;
