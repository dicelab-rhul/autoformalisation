import { AutoFormalisationMainContainerDiv } from "./divs/AutoFormalisationMainContainerDiv";
import { AutoFormalisationPaperLoader } from "./papers/AutoFormalisationPaperLoader";
import { Paper } from "./papers/Paper";
import { EmptyFilters } from "./papers/EmptyFilters";

export class Main {
    private constructor() {}

    public static async main(): Promise<void> {
        const papersJsonPath: string = "_data/papers.json";
        const [papers, llmCount, languageCount]: [Paper[], number, number] = await AutoFormalisationPaperLoader.loadPapers(papersJsonPath);
        const mainMessage: string = "Awesome LLM papers";
        const counterMessage: string = `Papers: ${papers.length} | LLMs: ${llmCount} | Languages: ${languageCount}`;
        const description: string = "Explore this collection of papers on LLMs. Use the filters to narrow down your search and find papers that match your interests.";
        const mainContainerDiv: AutoFormalisationMainContainerDiv = new AutoFormalisationMainContainerDiv(papers, new EmptyFilters(), mainMessage, counterMessage, description);

        mainContainerDiv.pack();

        Main.removeCommentsFromBody();

        document.body.appendChild(mainContainerDiv.getDiv());

        mainContainerDiv.show();
    }

    public static removeCommentsFromBody(): void {
        for (const node of Array.from(document.body.childNodes)) {
            if (node.nodeType === Node.COMMENT_NODE) {
                node.remove();
            }
        }
    }
}
