import Chart from "chart.js/auto";
import { Paper } from "./utils/Paper";
import { Filters } from "./utils/Filters";
import { DomManipulation } from "./utils/DomManipulation";


export class Renderer {
    public static renderPapers(data: Paper[]): void {
        const container: HTMLDivElement = DomManipulation.getElementByIdOrThrowError<HTMLDivElement>("papers");

        // Clear existing children safely
        while (container.firstChild) {
            container.firstChild.remove();
        }

        container.appendChild(document.createElement("hr"));

        const filtered: Paper[] = Renderer.filterPapers(data);

        Renderer.renderFilteredPapers(filtered, container);
        Renderer.renderCharts(filtered, data);

        container.appendChild(document.createElement("hr"));
    }

    private static filterPapers(data: Paper[], filters?: Filters): Paper[] {
        const appliedFilters: Filters = filters ?? {
            llm: "",
            language: "",
            type: "",
            search: ""
        };

        return data
            .filter((p) => !appliedFilters.llm || p.llm === appliedFilters.llm)
            .filter((p) => !appliedFilters.language || p.language === appliedFilters.language)
            .filter((p) => !appliedFilters.type || p.type === appliedFilters.type)
            .filter((p) => {
                if (appliedFilters.search) {
                    const s: string = appliedFilters.search.toLowerCase();

                    return (p.title?.toLowerCase().includes(s) || p.author?.toLowerCase().includes(s));
                }
                else {
                    return true;
                }
            });
    }

    private static appendOptionalEntries(p: Paper, div: HTMLDivElement): void {
        const fields: Array<{ key: keyof Paper; label: string; isLink?: boolean }> = [
            { key: "llm", label: "LLM" },
            { key: "language", label: "Language" },
            { key: "type", label: "Type" },
            { key: "url", label: "Paper", isLink: true },
            { key: "repository", label: "Code", isLink: true }
        ];

        for (const field of fields) {
            const value = p[field.key];

            if (!value) {
                continue;
            }
            else if (field.isLink) {
                div.appendChild(DomManipulation.createLink(value as string, field.label));
            }
            else {
                div.appendChild(DomManipulation.createBoldLabel(field.label, value as string));
            }
        }
    }

    private static renderFilteredPapers(filtered: Paper[], container: HTMLDivElement): void {
        for (const p of filtered) {
            const div: HTMLDivElement = document.createElement("div");

            div.className = "paper";

            const h3: HTMLHeadingElement = document.createElement("h3");

            h3.textContent = p.title ?? "";

            div.appendChild(h3);

            const meta: HTMLParagraphElement = document.createElement("p");
            const strong: HTMLElement = document.createElement("strong");

            strong.textContent = p.author ?? "";

            meta.appendChild(strong);
            meta.appendChild(document.createTextNode(` (${p.year ?? ""})`));

            div.appendChild(meta);

            Renderer.appendOptionalEntries(p, div);

            container.appendChild(div);
        }
    }

    private static renderCharts(filtered: Paper[], data: Paper[]): void {
        const subset: Paper[] = filtered ?? data;
        const byYear: Record<string, number> = {};
        const byLLM: Record<string, number> = {};

        for (const p of subset) {
            const y: string = p.year?.toString() ?? "Unknown";

            byYear[y] = (byYear[y] || 0) + 1;

            const l: string = p.llm ?? "None";

            byLLM[l] = (byLLM[l] || 0) + 1;
        }

        // New instances (if you want to avoid duplicates, you can store refs)
        const _chartYear: Chart = new Chart(DomManipulation.getElementByIdOrThrowError<HTMLCanvasElement>("chartYear"), {
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
            options: {
                responsive: true
            },
        });

        const _chartLLM: Chart = new Chart(DomManipulation.getElementByIdOrThrowError<HTMLCanvasElement>("chartLLM"), {
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
            options: {
                responsive: true
            },
        });
    }
}
