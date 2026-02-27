import React from "react";
import "./Header.css";

/**
 * Header — app title bar with branding and tagline.
 * Reusable: accepts optional `subtitle` prop.
 */
export default function Header({ subtitle = "AI-Powered Product Discovery" }) {
    return (
        <header className="header">
            <div className="header__inner">
                <h1 className="header__title">
                    <span className="header__logo">⚡</span>
                    Discvr<span className="header__accent">AI</span>
                </h1>
                <p className="header__subtitle">{subtitle}</p>
            </div>
        </header>
    );
}
