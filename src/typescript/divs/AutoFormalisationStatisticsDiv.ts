import Chart from "chart.js/auto";
import { Paper } from "../papers/Paper";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";

export class AutoFormalisationStatisticsDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly papers: Paper[];
    private yearChart!: HTMLCanvasElement;
    private llmChart!: HTMLCanvasElement;
    private packed: boolean;

    public constructor(papers: Paper[]) {
        AutoFormalisationValidator.ensureExists(papers, "The papers cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(papers, "The papers cannot contain null or undefined entries.");

        this.papers = papers;

        this.div = document.createElement("div");

        this.div.id = "statistics-div";
        this.div.hidden = true;

        this.packed = false;
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The statistics div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the statistics div is null or undefined.");

        if (this.div.hidden) {
            console.log("The statistics div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the statistics div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the statistics div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The statistics div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the statistics div is not packed.");
        }
    }

    public isHidden(): boolean {
        return this.div.hidden;
    }

    private packYearChart(byYear: Record<string, number>): void {
        this.yearChart = document.createElement("canvas");
        this.yearChart.id = "year-chart";

        this.div.appendChild(this.yearChart);

        const _chartYear: Chart = new Chart(this.yearChart, {
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
    }

    private packLLMChart(byLLM: Record<string, number>): void {
        this.llmChart = document.createElement("canvas");
        this.llmChart.id = "llm-chart";

        this.div.appendChild(this.llmChart);

        const _chartLLM: Chart = new Chart(this.llmChart, {
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

    private packCharts(): void {
        const byYear: Record<string, number> = {};
        const byLLM: Record<string, number> = {};

        for (const p of this.papers) {
            const y: string = p.year?.toString() ?? "Unknown";

            byYear[y] = (byYear[y] || 0) + 1;

            const l: string = p.llm ?? "None";

            byLLM[l] = (byLLM[l] || 0) + 1;
        }

        this.packYearChart(byYear);
        this.packLLMChart(byLLM);
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the statistics div is null or undefined.");

        if (this.packed) {
            console.log("The statistics div is already packed.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the statistics div must be hidden before packing.");
        }

        this.packCharts();

        this.packed = true;
    }

    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the statistics div is null or undefined.");

        if (!this.packed) {
            console.log("The statistics div is already unpacked.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the statistics div must be hidden before unpacking.");
        }

        AutoFormalisationHTMLUtils.clearElementChildren(this.div);

        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}