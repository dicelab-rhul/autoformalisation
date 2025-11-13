import * as jsyaml from "js-yaml";
import { Paper } from "./utils/Paper";
import { DomManipulation } from "./utils/DomManipulation";
import { Renderer } from "./Renderer";

export class PaperLoader {
    public static async loadPapers(): Promise<void> {
        const response: Response = await fetch("/_data/papers.yml");
        const text: string = await response.text();
        const data: Paper[] = PaperLoader.populatePapersList(text);
        const llms  = new Set(data.map(p => p.llm).filter((x): x is string => !!x));
        const langs = new Set(data.map(p => p.language).filter((x): x is string => !!x));
        const types = new Set(data.map(p => p.type).filter((x): x is string => !!x));

        PaperLoader.fillSelect("filter-llm", llms);
        PaperLoader.fillSelect("filter-lang", langs);
        PaperLoader.fillSelect("filter-type", types);

        Renderer.renderPapers(data);
    }

    private static populatePapersList(text: string): Paper[] {
        const data: Paper[] = [] as Paper[];

        jsyaml.loadAll(text, (doc) => {
            const p: Paper = doc as Paper;

            if (p.year) {
                const n: number = Number(p.year);

                p.year = Number.isNaN(n) ? p.year : n;
            }

            data.push(p);
        });

        return data;
    }

    private static fillSelect(id: string, values: Set<string>): void {
        const sel: HTMLSelectElement = DomManipulation.getElementByIdOrThrowError<HTMLSelectElement>(id);

        for (const v of [...values].sort((a, b) => a.localeCompare(b))) {
            const opt: HTMLOptionElement = document.createElement("option");

            opt.value = v;
            opt.textContent = v;

            sel.appendChild(opt);
        }
    }
}

await PaperLoader.loadPapers();
