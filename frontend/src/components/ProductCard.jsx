import React from "react";
import "./ProductCard.css";

/**
 * ProductCard — reusable card component for a single product.
 *
 * Props:
 *  - product: { id, name, category, price, description, tags }
 *
 * This is the primary reusable component in the app, used by both
 * the full product list and the AI search results.
 */
export default function ProductCard({ product }) {
    // Map categories to emoji icons for visual flair
    const categoryIcons = {
        Laptops: "💻",
        Phones: "📱",
        Tablets: "📟",
        Audio: "🎧",
        Wearables: "⌚",
        Monitors: "🖥️",
    };

    const icon = categoryIcons[product.category] || "📦";

    return (
        <article className="product-card">
            {/* Category badge */}
            <div className="product-card__badge">
                <span className="product-card__icon">{icon}</span>
                {product.category}
            </div>

            {/* Product info */}
            <h3 className="product-card__name">{product.name}</h3>
            <p className="product-card__description">{product.description}</p>

            {/* Tags */}
            <div className="product-card__tags">
                {product.tags.map((tag) => (
                    <span key={tag} className="product-card__tag">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Price */}
            <div className="product-card__footer">
                <span className="product-card__price">${product.price}</span>
                <span className="product-card__id">ID #{product.id}</span>
            </div>
        </article>
    );
}
