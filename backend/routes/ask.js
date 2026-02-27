
const express = require("express");
const router = express.Router();
const { askLLM } = require("../services/llmService");
const allProducts = require("../data/products.json");

router.post("/", async (req, res) => {
    try {
        const { query } = req.body;

        // Validate input
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return res
                .status(400)
                .json({ error: "A non-empty 'query' field is required." });
        }

        // Call the LLM
        const llmResult = await askLLM(query.trim());

        // Resolve product IDs to full product objects
        const matchedProducts = llmResult.productIds
            .map((id) => allProducts.find((p) => p.id === id))
            .filter(Boolean); // drop any IDs not found in catalog

        return res.json({
            products: matchedProducts,
            summary: llmResult.summary,
        });
    } catch (err) {
        console.error("[/api/ask] Error:", err.message || err);

        // Determine appropriate status code based on error type
        if (err.status === 429 || err.code === "rate_limit_exceeded") {
            return res.status(503).json({
                error: "AI service is temporarily busy. Please try again in a moment.",
            });
        }

        if (err.status === 401 || err.code === "invalid_api_key") {
            return res.status(502).json({
                error: "AI service configuration error. Please contact support.",
            });
        }

        if (err.message?.includes("JSON")) {
            return res.status(502).json({
                error: "AI returned an unexpected response. Please try rephrasing your question.",
            });
        }

        return res.status(502).json({
            error: "Unable to process your request right now. Please try again later.",
        });
    }
});

module.exports = router;
