import { AutoFormalisationMainContainerDiv } from "./divs/AutoFormalisationMainContainerDiv";
import { AutoFormalisationPaperLoader } from "./papers/AutoFormalisationPaperLoader";
import { Paper } from "./papers/Paper";
import { EmptyFilters } from "./papers/EmptyFilters";
import { AutoFormalisationWelcomeDiv } from "./divs/AutoFormalisationWelcomeDiv";

export class Main {
    private constructor() {}

    public static async main(): Promise<void> {
        const cookieName: string = "WelcomeMessageAlreadySeen";
        const cookieValue: string = "true";

        Main.removeCommentsFromBody();

        if (document.cookie.includes(`${cookieName}=${cookieValue}`)) {
            Main.initializeApp();
        }
        else {
            const welcomeMessage: string = "Welcome to the Awesome LLM Papers collection! This website is a curated collection of papers on Large Language Models (LLMs). We have gathered a wide range of papers covering various aspects of LLMs, including their architecture, training methods, applications, and ethical considerations. We hope you find this collection useful for your research and exploration of LLMs. Feel free to explore the papers and use the filters to find papers that match your interests. Enjoy your journey through the world of LLMs!";

            Main.showWelcomeMessage(welcomeMessage, cookieName, cookieValue);
        }
    }

    private static showWelcomeMessage(message: string, cookieName: string, cookieValue: string): void {
        const welcomeDiv: AutoFormalisationWelcomeDiv = new AutoFormalisationWelcomeDiv(message, cookieName, cookieValue, Main.initializeApp.bind(this));

        welcomeDiv.pack();

        document.body.appendChild(welcomeDiv.getDiv());

        welcomeDiv.show();
    }

    private static async initializeApp(): Promise<void> {
        const papersJsonPath: string = "_data/papers.json";
        const [papers, llmCount, languageCount]: [Paper[], number, number] = await AutoFormalisationPaperLoader.loadPapers(papersJsonPath);
        const mainMessage: string = "Awesome LLM papers";
        const counterMessage: string = `Papers: ${papers.length} | LLMs: ${llmCount} | Languages: ${languageCount}`;
        const description: string = "Explore this collection of papers on LLMs. Use the filters to narrow down your search and find papers that match your interests.";
        const mainContainerDiv: AutoFormalisationMainContainerDiv = new AutoFormalisationMainContainerDiv(papers, new EmptyFilters(), mainMessage, counterMessage, description);

        mainContainerDiv.pack();

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
