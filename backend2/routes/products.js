
const express = require("express");
const router = express.Router();
const products = require("../data/products.json");

router.get("/", (req, res) => {
    let results = [...products];

    // --- Category filter ---
    const { category, q } = req.query;

    if (category) {
        results = results.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
        );
    }

    // --- Keyword search across name, description, and tags ---
    if (q) {
        const keyword = q.toLowerCase();
        results = results.filter(
            (p) =>
                p.name.toLowerCase().includes(keyword) ||
                p.description.toLowerCase().includes(keyword) ||
                p.tags.some((t) => t.toLowerCase().includes(keyword))
        );
    }

    return res.json({ count: results.length, products: results });
});

module.exports = router;
