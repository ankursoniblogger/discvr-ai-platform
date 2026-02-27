
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productsRouter = require("./routes/products");
const askRouter = require("./routes/ask");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────
app.use(cors()); // allow frontend origin in dev
app.use(express.json()); // parse JSON bodies

// ── Routes ───────────────────────────────────────────────
app.use("/api/products", productsRouter);
app.use("/api/ask", askRouter);

// ── Health check ─────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});


app.get("/", (req, res) => {
    res.send("Backend running successfully 😄");
});

// ── Start server ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Backend running → http://localhost:${PORT}`);
});
