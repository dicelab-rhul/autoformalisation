import { AutoFormalisationMainContainerDiv } from "./divs/AutoFormalisationMainContainerDiv";
import { AutoFormalisationPaperLoader } from "./papers/AutoFormalisationPaperLoader";
import { Paper } from "./papers/Paper";
import { EmptyFilters } from "./papers/EmptyFilters";

export class Main {
    private constructor() {}

    public static async main(): Promise<void> {
        const papers: Paper[] = await AutoFormalisationPaperLoader.loadPapers();
        const mainContainerDiv: AutoFormalisationMainContainerDiv = new AutoFormalisationMainContainerDiv(papers, new EmptyFilters(), "Welcome to the AutoFormalisation Paper Repository", "Explore the collection of papers on automatic formalisation.");
    
        mainContainerDiv.pack();

        document.body.appendChild(mainContainerDiv.getDiv());

        mainContainerDiv.show();
    }
}
