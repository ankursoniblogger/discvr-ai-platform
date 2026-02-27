import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

/**
 * ProductList — renders a grid of ProductCard components.
 *
 * Props:
 *  - products: array of product objects
 *  - title: optional section heading
 */
export default function ProductList({ products, title }) {
    if (!products || products.length === 0) {
        return (
            <div className="product-list__empty">
                <p>🔍 No products found.</p>
            </div>
        );
    }

    return (
        <section className="product-list">
            {title && <h2 className="product-list__title">{title}</h2>}
            <div className="product-list__grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
