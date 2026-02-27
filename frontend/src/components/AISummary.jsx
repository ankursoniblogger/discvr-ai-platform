import React from "react";
import "./AISummary.css";

/**
 * AISummary — displays the LLM-generated summary text.
 *
 * Props:
 *  - summary: string from the LLM response
 */
export default function AISummary({ summary }) {
    if (!summary) return null;

    return (
        <div className="ai-summary">
            <div className="ai-summary__badge">🤖 AI Summary</div>
            <p className="ai-summary__text">{summary}</p>
        </div>
    );
}
