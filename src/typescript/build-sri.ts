import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import prettier from "prettier";

function sri(path : string): string {
    const data: Buffer = readFileSync(path);
    const hash: string = createHash("sha384").update(data).digest("base64");

    return `sha384-${hash}`;
}

const cssFile: string = "static/css/index.css";
const jsFile: string = "static/js/index.js";
const ttFile: string = "static/js/trusted_types_enforced_polyfill.js";

const cssIntegrity: string = sri(cssFile);
const jsIntegrity: string = sri(jsFile);
const ttIntegrity: string = sri(ttFile);

const cssIntegrityPlaceholder: string = "{{index_css_integrity}}";
const jsIntegrityPlaceholder: string = "{{index_js_integrity}}";
const ttIntegrityPlaceholder: string = "{{tt_integrity}}";

const templateHtmlPath: string = "template.html";
const indexHtmlPath: string = "index.html";

let html: string = readFileSync(templateHtmlPath, "utf-8");

// Format BEFORE inserting placeholders (Prettier cannot parse {{...}})
html = await prettier.format(html, {
    parser: "html",
    tabWidth: 4,
    useTabs: false,
});

// Insert SRI hashes AFTER formatting (integrity attributes + CSP meta tag)
html = html.replaceAll(cssIntegrityPlaceholder, cssIntegrity);
html = html.replaceAll(jsIntegrityPlaceholder, jsIntegrity);
html = html.replaceAll(ttIntegrityPlaceholder, ttIntegrity);

// Collapse <script> tags
html = html.replaceAll(/<script\b[\s\S]*?<\/script>/g, (s: string): string => s.replaceAll(/\s*\n\s*/g, " "));

// Collapse <link> tags
html = html.replaceAll(/<link\b[\s\S]*?>/g, (s: string): string => s.replaceAll(/\s*\n\s*/g, " "));

// Collapse <meta> tags
html = html.replaceAll(/<meta\b[\s\S]*?>/g, (s: string): string => s.replaceAll(/\s*\n\s*/g, " "));

writeFileSync(indexHtmlPath, html, "utf-8");

console.log("Successfully generated index.html from template.html with SRI integrity attributes and CSP meta tag.");
