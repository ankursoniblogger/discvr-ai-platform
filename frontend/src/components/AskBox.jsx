import React, { useState } from "react";
import "./AskBox.css";

/**
 * AskBox — natural-language search input.
 *
 * Props:
 *  - onAsk(query: string): callback when the user submits a query
 *  - loading: boolean — disables the button and shows a spinner
 */
export default function AskBox({ onAsk, loading }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !loading) {
            onAsk(query.trim());
        }
    };

    return (
        <form className="ask-box" onSubmit={handleSubmit}>
            <div className="ask-box__wrapper">
                <span className="ask-box__icon">✨</span>
                <input
                    type="text"
                    className="ask-box__input"
                    placeholder={`Ask AI anything — e.g. "Show me budget laptops" or "What's good for gaming?"`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="ask-box__button"
                    disabled={loading || !query.trim()}
                >
                    {loading ? (
                        <span className="ask-box__spinner" />
                    ) : (
                        "Ask AI"
                    )}
                </button>
            </div>
        </form>
    );
}
