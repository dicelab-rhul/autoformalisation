import * as jsyaml from "js-yaml";
import Chart from "chart.js/auto";

interface Paper {
  title: string;
  author?: string;
  year?: number | string;
  llm?: string;
  language?: string;
  type?: string;
  url?: string;
  repository?: string;
}

interface Filters {
  llm: string;
  language: string;
  type: string;
  search: string;
}

// Utility to ensure correct element type
function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

// -------------------------
// SAFE DOM RENDER FUNCTIONS
// -------------------------
function createParagraph(text: string): HTMLParagraphElement {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}

function createBoldLabel(label: string, value: string): HTMLParagraphElement {
  const p = document.createElement("p");
  const b = document.createElement("b");
  b.textContent = label + ": ";
  p.appendChild(b);
  p.appendChild(document.createTextNode(value));
  return p;
}

function createLink(url: string, label: string): HTMLParagraphElement {
  const p = document.createElement("p");
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label;
  p.appendChild(a);
  return p;
}

async function loadPapers(): Promise<void> {
  const response = await fetch("{{ '/_data/papers.yml' | relative_url }}");
  const text = await response.text();

  const data = jsyaml.load(text) as Paper[];

  // Sets for dropdowns
  const llms = new Set<string>();
  const langs = new Set<string>();
  const types = new Set<string>();

  for (const p of data) {
    if (p.llm) llms.add(p.llm);
    if (p.language) langs.add(p.language);
    if (p.type) types.add(p.type);
  }

  const filters: Filters = {
    llm: "",
    language: "",
    type: "",
    search: ""
  };

  const fillSelect = (id: string, values: Set<string>): void => {
    const sel = getEl<HTMLSelectElement>(id);
    for (const v of [...values].sort((a, b) => a.localeCompare(b))) {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    }
  };

  fillSelect("filter-llm", llms);
  fillSelect("filter-lang", langs);
  fillSelect("filter-type", types);

  function renderPapers(): void {
    const container = getEl<HTMLDivElement>("papers");

    // Clear existing children safely
    while (container.firstChild) container.firstChild.remove();

    const filtered = data
      .filter((p) => !filters.llm || p.llm === filters.llm)
      .filter((p) => !filters.language || p.language === filters.language)
      .filter((p) => !filters.type || p.type === filters.type)
      .filter((p) => {
        if (!filters.search) return true;
        const s = filters.search;
        return (
          p.title?.toLowerCase().includes(s) ||
          p.author?.toLowerCase().includes(s)
        );
      });

    for (const p of filtered) {
      const div = document.createElement("div");
      div.className = "paper";

      // Title
      const h3 = document.createElement("h3");
      h3.textContent = p.title;
      div.appendChild(h3);

      // Author + year
      const meta = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = p.author ?? "";
      meta.appendChild(strong);
      meta.appendChild(
        document.createTextNode(` (${p.year ?? ""})`)
      );
      div.appendChild(meta);

      if (p.llm) div.appendChild(createBoldLabel("LLM", p.llm));
      if (p.language) div.appendChild(createBoldLabel("Language", p.language));
      if (p.type) div.appendChild(createBoldLabel("Type", p.type));

      if (p.url) div.appendChild(createLink(p.url, "Paper"));
      if (p.repository) div.appendChild(createLink(p.repository, "Code"));

      // HR divider
      div.appendChild(document.createElement("hr"));

      container.appendChild(div);
    }

    renderCharts(filtered);
  }

  // -------------------------
  // CHARTS
  // -------------------------
  function renderCharts(filtered: Paper[]): void {
    const subset = filtered ?? data;

    const byYear: Record<string, number> = {};
    const byLLM: Record<string, number> = {};

    for (const p of subset) {
      const y = p.year?.toString() ?? "Unknown";
      byYear[y] = (byYear[y] || 0) + 1;

      const l = p.llm ?? "None";
      byLLM[l] = (byLLM[l] || 0) + 1;
    }

    // New instances (if you want to avoid duplicates, you can store refs)
    new Chart(getEl<HTMLCanvasElement>("chartYear"), {
      type: "bar",
      data: {
        labels: Object.keys(byYear),
        datasets: [
          {
            label: "Papers per Year",
            data: Object.values(byYear),
          },
        ],
      },
      options: { responsive: true },
    });

    new Chart(getEl<HTMLCanvasElement>("chartLLM"), {
      type: "pie",
      data: {
        labels: Object.keys(byLLM),
        datasets: [
          {
            label: "LLM usage",
            data: Object.values(byLLM),
          },
        ],
      },
      options: { responsive: true },
    });
  }

  renderPapers();
}

await loadPapers();
