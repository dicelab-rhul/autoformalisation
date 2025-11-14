import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { Paper } from "./Paper";
import jsyaml from "js-yaml";

export class AutoFormalisationPaperLoader {
    private constructor() {} // prevent instantiation

    public static async loadPapers(): Promise<Paper[]> {
        const response: Response = await fetch("/_data/papers.yml");
        const yamlText: string = await response.text();
        const papers: Paper[] = AutoFormalisationPaperLoader.parseYamlToPapers(yamlText);

        return papers;
    }

    private static parseYamlToPaper(doc: unknown): Paper | null {
        if (AutoFormalisationValidator.isNil(doc) || typeof doc !== "object") {
            console.warn("Skipping YAML document: not a valid object.", doc);

            return null;
        }

        const raw: Record<string, unknown> = doc as Record<string, unknown>;

        if (AutoFormalisationValidator.isNil(raw.title) || typeof raw.title !== "string") {
            console.warn("Skipping paper: missing or invalid title.", raw);

            return null;
        }

        return {
            ENTRYTYPE: raw.ENTRYTYPE as string | undefined,
            ID: raw.ID as string | undefined,
            title: raw.title,
            author: raw.author as string | undefined,
            journal: raw.journal as string | undefined,
            topic: raw.topic as string | undefined,
            year: AutoFormalisationPaperLoader.normalizeYear(raw.year),
            llm: raw.llm as string | undefined,
            language: raw.language as string | undefined,
            type: raw.type as string | undefined,
            url: raw.url as string | undefined,
            repository: raw.repository as string | undefined
        };
    }

    private static parseYamlToPapers(text: string): Paper[] {
        AutoFormalisationValidator.ensureExists(text, "YAML text cannot be null or undefined.");

        const papers: Paper[] = [];

        jsyaml.loadAll(text, (doc: unknown) => {
            const paper: Paper | null = AutoFormalisationPaperLoader.parseYamlToPaper(doc);

            if (paper !== null) {
                papers.push(paper);
            }
        });

        return papers;
    }

    private static normalizeYear(year: unknown): number | string | undefined {
        if (AutoFormalisationValidator.isNil(year)) {
            return undefined;
        }

        if (typeof year === "number") {
            return year;
        }

        if (typeof year === "string") {
            const parsed = Number(year.trim());

            return Number.isNaN(parsed) ? year : parsed;
        }

        return undefined;
    }
}
