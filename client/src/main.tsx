import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Meta tags for SEO
document.title = "RE LED LIGHT - Modern LED Lighting Solutions";
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Premium LED lighting solutions for your home and business. Energy-efficient, stylish, and long-lasting LED products at affordable prices.";
document.head.appendChild(metaDescription);

// Favicon
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>";
document.head.appendChild(favicon);

// Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.property = "og:title";
ogTitle.content = "RE LED LIGHT - Modern LED Lighting Solutions";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.property = "og:description";
ogDescription.content = "Premium LED lighting solutions for your home and business. Energy-efficient, stylish, and long-lasting LED products at affordable prices.";
document.head.appendChild(ogDescription);

const ogType = document.createElement("meta");
ogType.property = "og:type";
ogType.content = "website";
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
