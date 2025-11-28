import { AutoFormalisationMainContainerDiv } from "./divs/AutoFormalisationMainContainerDiv";
import { AutoFormalisationPaperLoader } from "./papers/AutoFormalisationPaperLoader";
import { Paper } from "./papers/Paper";
import { EmptyFilters } from "./papers/EmptyFilters";

export class Main {
    private constructor() {}

    public static async main(): Promise<void> {
        const papersJsonPath: string = "_data/papers.json";
        const papers: Paper[] = await AutoFormalisationPaperLoader.loadPapers(papersJsonPath);
        const mainMessage: string = "Awesome LLM papers";
        const description: string = "Explore this collection of papers on LLMs. Use the filters to narrow down your search and find papers that match your interests.";
        const mainContainerDiv: AutoFormalisationMainContainerDiv = new AutoFormalisationMainContainerDiv(papers, new EmptyFilters(), mainMessage, description);
    
        mainContainerDiv.pack();

        document.body.appendChild(mainContainerDiv.getDiv());

        mainContainerDiv.show();
    }
}
