import React from 'react';

export const GWA_COLOR = (gwa) => {
    if (!gwa) return "#8b949e";
    if (gwa <= 1.5) return "#34d399";
    if (gwa <= 2.0) return "#4a9eff";
    if (gwa <= 2.5) return "#f0a500";
    return "#f87171";
};

export const GWA_LABEL = (gwa) => {
    if (!gwa) return "N/A";
    if (gwa <= 1.5) return "Excellent";
    if (gwa <= 2.0) return "Very Good";
    if (gwa <= 2.5) return "Good";
    return "Passing";
};

export function Highlight({ text, query }) {
    if (!query || !text) return <>{text}</>;
    const str = String(text);
    const idx = str.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{str}</>;
    return (
        <>
            {str.slice(0, idx)}
            <mark style={{ background: "rgba(249,115,22,0.3)", color: "#fb923c", borderRadius: 3, padding: "0 2px" }}>
                {str.slice(idx, idx + query.length)}
            </mark>
            {str.slice(idx + query.length)}
        </>
    );
}
