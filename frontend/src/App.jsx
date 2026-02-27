import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AskBox from "./components/AskBox";
import AISummary from "./components/AISummary";
import ProductList from "./components/ProductList";
import { fetchProducts, askAI } from "./services/api";
import "./App.css";

/**
 * App — root component that orchestrates the product discovery flow.
 *
 * State:
 *  - products:     full catalog from GET /api/products
 *  - aiProducts:   products returned by the AI "ask" endpoint
 *  - aiSummary:    LLM-generated summary text
 *  - loading:      whether a fetch is in progress
 *  - error:        error message string (if any)
 *  - activeFilter: currently selected category tab
 *  - hasAsked:     whether the user has made an AI query
 */
export default function App() {
    const [products, setProducts] = useState([]);
    const [aiProducts, setAiProducts] = useState([]);
    const [aiSummary, setAiSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [hasAsked, setHasAsked] = useState(false);

    // Unique categories for filter tabs
    const categories = ["All", ...new Set(products.map((p) => p.category))];

    // ── Load full product catalog on mount ──────────────
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data.products);
            } catch (err) {
                setError("Failed to load products. Is the backend running?");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // ── Handle AI ask ──────────────────────────────────
    const handleAsk = async (query) => {
        try {
            setLoading(true);
            setError("");
            setAiProducts([]);
            setAiSummary("");
            setHasAsked(true);

            const data = await askAI(query);
            setAiProducts(data.products);
            setAiSummary(data.summary);
        } catch (err) {
            setError(err.message || "Something went wrong with the AI query.");
        } finally {
            setLoading(false);
        }
    };

    // ── Clear AI results and go back to catalog ────────
    const handleClear = () => {
        setHasAsked(false);
        setAiProducts([]);
        setAiSummary("");
        setError("");
        setActiveFilter("All");
    };

    // ── Filter products by category tab ────────────────
    const filteredProducts =
        activeFilter === "All"
            ? products
            : products.filter((p) => p.category === activeFilter);

    return (
        <>
            <Header />

            <main className="app__main">
                {/* Ask AI box */}
                <section className="app__ask-section">
                    <AskBox onAsk={handleAsk} loading={loading} />
                </section>

                {/* Error banner */}
                {error && (
                    <div className="app__error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* AI results section */}
                {hasAsked && !loading && (
                    <section className="app__ai-results">
                        <div className="app__ai-header">
                            <h2>🤖 AI Results</h2>
                            <button className="app__clear-btn" onClick={handleClear}>
                                ✕ Clear &amp; show all
                            </button>
                        </div>
                        <AISummary summary={aiSummary} />
                        <ProductList
                            products={aiProducts}
                            title={`${aiProducts.length} product${aiProducts.length !== 1 ? "s" : ""} matched`}
                        />
                    </section>
                )}

                {/* Loading indicator */}
                {loading && (
                    <div className="app__loading">
                        <div className="app__loading-spinner" />
                        <p>Thinking…</p>
                    </div>
                )}

                {/* Full catalog (hidden when viewing AI results) */}
                {!hasAsked && !loading && (
                    <section className="app__catalog">
                        {/* Category filter tabs */}
                        <div className="app__filters">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`app__filter-btn ${activeFilter === cat ? "app__filter-btn--active" : ""}`}
                                    onClick={() => setActiveFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <ProductList
                            products={filteredProducts}
                            title={`${activeFilter === "All" ? "All Products" : activeFilter} (${filteredProducts.length})`}
                        />
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="app__footer">
                <p>
                    Built with ⚡ React + Express + OpenAI &nbsp;·&nbsp; DiscvrAI
                </p>
            </footer>
        </>
    );
}
