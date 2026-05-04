import { AutoFormalisationMainContainerDiv } from "./divs/AutoFormalisationMainContainerDiv";
import { AutoFormalisationPaperLoader } from "./papers/AutoFormalisationPaperLoader";
import { AutoFormalisationSidebarDiv, Page } from "./divs/AutoFormalisationSideBarDiv";
import { AutoFormalisationHomePageDiv } from "./divs/AutoFormalisationHomePageDiv";
import { Paper } from "./papers/Paper";
import { EmptyFilters } from "./papers/EmptyFilters";
import { AutoFormalisationAboutDiv } from "./divs/AutoFormalisationAboutDiv";
import { AutoFormalisationStatisticsDiv } from "./divs/AutoFormalisationStatisticsDiv";

export class Main {
    private constructor() {}

    public static async main(): Promise<void> {
        const papersJsonPath: string = "_data/papers.json";
        const [papers] = await AutoFormalisationPaperLoader.loadPapers(papersJsonPath);

        // Main content wrapper
        const mainContent = document.createElement("div");
        mainContent.id = "main-content";

        // Pages
        const homePage = new AutoFormalisationHomePageDiv();
        const browseDiv = new AutoFormalisationMainContainerDiv(papers, new EmptyFilters(), "Browse Papers", "", "Filter and search the autoformalization paper catalogue.");
        const about = new AutoFormalisationAboutDiv();
        const statisticsPage = new AutoFormalisationStatisticsDiv(papers);

        browseDiv.pack();
        browseDiv.getDiv().hidden = true;
        about.getDiv().hidden = true;
        statisticsPage.pack();
        statisticsPage.getDiv().hidden = true;

        mainContent.appendChild(homePage.getDiv());
        mainContent.appendChild(browseDiv.getDiv());
        mainContent.appendChild(about.getDiv());
        mainContent.appendChild(statisticsPage.getDiv());

        // Sidebar
        const sidebar = new AutoFormalisationSidebarDiv((page: Page) => {
            homePage.hide();
            browseDiv.getDiv().hidden = true;
            about.hide();
            statisticsPage.getDiv().hidden = true;

            if (page === "home") {
                homePage.show();
            } else if (page === "browse") {
                browseDiv.getDiv().hidden = false;
                browseDiv.show();
            } else if (page === "about") {
                about.getDiv().hidden = false;
                about.show();
            } else if (page === "trends") {
                statisticsPage.getDiv().hidden = false;
                statisticsPage.show();
            }
            // Add new pages here as else-if branches
        });

        document.body.appendChild(sidebar.getDiv());
        document.body.appendChild(mainContent);
    }
}