import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { Paper } from "./Paper";

export class AutoFormalisationPaperLoader {
    private constructor() {} // prevent instantiation

    public static async loadPapers(papersJsonPath: string): Promise<Paper[]> {
        AutoFormalisationValidator.ensureExists(papersJsonPath, "The path to the papers JSON file must be provided.");

        const url: URL = new URL(papersJsonPath, globalThis.location.href);
        const response: Response = await fetch(url.toString());
        const jsonText: string = await response.text();
        const papers: Paper[] = JSON.parse(jsonText);

        return papers;
    }
}
