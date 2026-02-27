/**
 * API Service — centralised HTTP helpers for the backend.
 *
 * All fetch calls go through these functions so error handling
 * and base-URL logic live in one place.
 */

const API_BASE = "/api"; // proxied to backend via vite.config.js

/**
 * Fetch all products, optionally filtered by category or keyword.
 * @param {{ category?: string, q?: string }} filters
 * @returns {Promise<{ count: number, products: object[] }>}
 */
export async function fetchProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.q) params.set("q", filters.q);

    const url = `${API_BASE}/products${params.toString() ? "?" + params : ""}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to fetch products (${res.status})`);
    }

    return res.json();
}

/**
 * Send a natural-language query to the AI-powered /api/ask endpoint.
 * @param {string} query
 * @returns {Promise<{ products: object[], summary: string }>}
 */
export async function askAI(query) {
    const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
    }

    return res.json();
}
