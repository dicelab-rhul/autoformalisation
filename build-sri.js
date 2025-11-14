import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import prettier from "prettier";

function sri(path) {
    const data = readFileSync(path);
    const hash = createHash("sha384").update(data).digest("base64");

    return `sha384-${hash}`;
}

const cssFile = "static/css/index.css";
const jsFile = "static/js/index.js";
const ttFile = "static/js/trusted_types_enforced_polyfill.js";

const cssIntegrity = sri(cssFile);
const jsIntegrity = sri(jsFile);
const ttIntegrity = sri(ttFile);

const cssIntegrityPlaceholder = "{{index_css_integrity}}";
const jsIntegrityPlaceholder = "{{index_js_integrity}}";
const ttIntegrityPlaceholder = "{{tt_integrity}}";
const noncePlaceholder = "{{nonce_value}}";

const templateHtmlPath = "template.html";
const indexHtmlPath = "index.html";

let html = readFileSync(templateHtmlPath, "utf-8");

// 1️⃣ Format BEFORE inserting placeholders (Prettier cannot parse {{...}})
html = await prettier.format(html, {
    parser: "html",
    tabWidth: 4,
    useTabs: false,
});

// 2️⃣ Insert SRI hashes AFTER formatting
html = html.replace(cssIntegrityPlaceholder, cssIntegrity);
html = html.replace(jsIntegrityPlaceholder, jsIntegrity);
html = html.replace(ttIntegrityPlaceholder, ttIntegrity);

// 3️⃣ Collapse <script> tags
html = html.replaceAll(/<script\b[\s\S]*?<\/script>/g, s => s.replaceAll(/\s*\n\s*/g, " "));

// 4️⃣ Collapse <link> tags
html = html.replaceAll(/<link\b[\s\S]*?>/g, s => s.replaceAll(/\s*\n\s*/g, " "));

writeFileSync(indexHtmlPath, html, "utf-8");

console.log("index.html updated successfully");
