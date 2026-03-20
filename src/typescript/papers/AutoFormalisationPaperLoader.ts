import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { Paper } from "./Paper";

export class AutoFormalisationPaperLoader {
    private constructor() {} // prevent instantiation

    public static async loadPapers(papersJsonPath: string): Promise<[Paper[], number, number]> {
        AutoFormalisationValidator.ensureExists(papersJsonPath, "The path to the papers JSON file must be provided.");

        const url: URL = new URL(papersJsonPath, globalThis.location.href);
        const response: Response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to load papers from ${papersJsonPath}: ${response.status} ${response.statusText}`);
        }

        const jsonText: string = await response.text();
        const papers: Paper[] = JSON.parse(jsonText).map((p: any) => ({...p,title: p.title?.replaceAll(/[{}]/g, "") ?? p.title}));
        const uniqueLLMs: Set<string> = new Set();
        const uniqueLanguages: Set<string> = new Set();

        papers.forEach(paper => {
            if (paper.llm) {
                uniqueLLMs.add(paper.llm);
            }

            if (paper.language) {
                uniqueLanguages.add(paper.language);
            }
        });

        const llmCount: number = uniqueLLMs.size;
        const languageCount: number = uniqueLanguages.size;

        return [papers, llmCount, languageCount];
    }
}
