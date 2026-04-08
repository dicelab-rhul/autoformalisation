import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { Paper } from "./Paper";

export class AutoFormalisationPaperLoader {
    private constructor() {} // prevent instantiation

    private static toStr(value: unknown): string {
        return typeof value === "string" ? value : "";
    }

    private static toOptionalStr(value: unknown): string | undefined {
        return typeof value === "string" ? value : undefined;
    }

    private static parsePaper(p: unknown): Paper {
        if (typeof p !== "object" || p === null || Array.isArray(p)) {
            throw new TypeError("Each entry in the papers JSON must be a non-null object.");
        }

        const obj: Record<string, unknown> = p as Record<string, unknown>;

        return {
            entrytype: AutoFormalisationPaperLoader.toStr(obj["entrytype"]),
            id:        AutoFormalisationPaperLoader.toStr(obj["id"]),
            title:     AutoFormalisationPaperLoader.toStr(obj["title"]).replaceAll(/[{}]/g, ""),
            author:    AutoFormalisationPaperLoader.toOptionalStr(obj["author"]),
            journal:   AutoFormalisationPaperLoader.toOptionalStr(obj["journal"]),
            topic:     AutoFormalisationPaperLoader.toOptionalStr(obj["topic"]),
            year:      AutoFormalisationPaperLoader.toOptionalStr(obj["year"]),
            llm:       AutoFormalisationPaperLoader.toOptionalStr(obj["llm"]),
            language:  AutoFormalisationPaperLoader.toOptionalStr(obj["language"]),
            type:      AutoFormalisationPaperLoader.toOptionalStr(obj["type"]),
            goal:   AutoFormalisationPaperLoader.toOptionalStr(obj["goal"]),
            domain:    AutoFormalisationPaperLoader.toOptionalStr(obj["domain"]),
            url:       AutoFormalisationPaperLoader.toOptionalStr(obj["url"]),
            repository: AutoFormalisationPaperLoader.toOptionalStr(obj["repository"]),
        };
    }

    public static async loadPapers(papersJsonPath: string): Promise<[Paper[], number, number]> {
        AutoFormalisationValidator.ensureExists(papersJsonPath, "The path to the papers JSON file must be provided.");

        const url: URL = new URL(papersJsonPath, globalThis.location.href);
        const response: Response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to load papers from ${papersJsonPath}: ${response.status} ${response.statusText}`);
        }

        const jsonText: string = await response.text();
        const rawData: unknown = JSON.parse(jsonText);

        if (!Array.isArray(rawData)) {
            throw new TypeError("The papers JSON file must contain an array.");
        }

        const papers: Paper[] = rawData.map(AutoFormalisationPaperLoader.parsePaper);
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
