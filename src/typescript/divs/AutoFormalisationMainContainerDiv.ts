import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";
import { AutoFormalisationTopMessageDiv } from "./AutoFormalisationTopMessageDiv";
import { AutoFormalisationStatisticsDiv } from "./AutoFormalisationStatisticsDiv";
import { AutoFormalisationPaperDiv } from "./AutoFormalisationPaperDiv";
import { Paper } from "../papers/Paper";
import { Filters } from "../papers/Filters";
import { EmptyFilters } from "../papers/EmptyFilters";
import { AutoFormalisationPapersDiv } from "./AutoFormalisationPapersDiv";
import { AutoFormalisationFiltersDiv } from "./AutoFormalisationFiltersDiv";

export class AutoFormalisationMainContainerDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly topMessageDiv: AutoFormalisationTopMessageDiv;
    private readonly filtersDiv: AutoFormalisationFiltersDiv;
    private readonly filteredPapers: Paper[];
    private readonly topMessage: string;
    private readonly description: string
    private packed: boolean;

    public constructor(papers: Paper[], filters: Filters, topMessage: string, description: string) {
        AutoFormalisationValidator.ensureExists(papers, "The papers list cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(papers, "The papers list cannot contain null or undefined entries.");
        AutoFormalisationValidator.ensureExists(filters, "The filters cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(topMessage, "The top message cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(description, "The description cannot be null or undefined.");

        this.filteredPapers = AutoFormalisationMainContainerDiv.filterPapers(papers, filters);
        this.topMessage = topMessage;
        this.description = description;

        this.div = document.createElement("div");

        this.div.id = "main-container-div";
        this.div.hidden = true;

        this.topMessageDiv = new AutoFormalisationTopMessageDiv(this.topMessage, this.description);
        this.filtersDiv = this.createFiltersDiv(papers);
        this.packed = false;
    }

    private filtersCallback(filters: Filters): void {
        // For all paper divs, if doesPaperMatchFilters is true, show, else hide
        // Then, update statistics div
        const matchingPapers: Paper[] = [];

        for (const child of this.div.children) {
            if (child.id === "papers-div") {
                const papersDiv: HTMLDivElement = AutoFormalisationHTMLUtils.getElementByIdOrThrow<HTMLDivElement>("papers-div");

                for (const paperChild of papersDiv.children) {
                    const paperID = paperChild.id.replace("paper-div-", "");

                    if (this.doesPaperMatchFilters(this.filteredPapers.find(p => p.ID === paperID)!, filters)) {
                        (paperChild as HTMLDivElement).hidden = false;

                        matchingPapers.push(this.filteredPapers.find(p => p.ID === paperID)!);
                    }
                    else {
                        (paperChild as HTMLDivElement).hidden = true;
                    }
                }
            }
        }

        const statisticsDiv: AutoFormalisationStatisticsDiv = new AutoFormalisationStatisticsDiv(matchingPapers);

        statisticsDiv.pack();
        statisticsDiv.show();

        const existingStatisticsDiv: HTMLDivElement = AutoFormalisationHTMLUtils.getElementByIdOrThrow<HTMLDivElement>("statistics-div");

        existingStatisticsDiv.replaceWith(statisticsDiv.getDiv());
    }

    public doesPaperMatchFilters(paper: Paper, filters: Filters): boolean {
        const appliedFilters: Filters = filters ?? new EmptyFilters();

        return ((!appliedFilters.llm || paper.llm === appliedFilters.llm)
            && (!appliedFilters.language || paper.language === appliedFilters.language)
            && (!appliedFilters.type || paper.type === appliedFilters.type)
            && (appliedFilters.search
                ? (paper.title?.toLowerCase().includes(appliedFilters.search.toLowerCase())
                    || paper.author?.toLowerCase().includes(appliedFilters.search.toLowerCase()))
                : true)) ?? false;
    }

    private static filterPapers(papers: Paper[], filters: Filters): Paper[] {
        const appliedFilters: Filters = filters ?? new EmptyFilters();

        return papers
            .filter((p) => !appliedFilters.llm || p.llm === appliedFilters.llm)
            .filter((p) => !appliedFilters.language || p.language === appliedFilters.language)
            .filter((p) => !appliedFilters.type || p.type === appliedFilters.type)
            .filter((p) => {
                if (appliedFilters.search) {
                    const s: string = appliedFilters.search.toLowerCase();

                    return (p.title?.toLowerCase().includes(s) || p.author?.toLowerCase().includes(s));
                }
                else {
                    return true;
                }
            });
    }

    private createFiltersDiv(papers: Paper[]): AutoFormalisationFiltersDiv {
        const llmsSet: Set<string> = new Set(papers.map(p => p.llm).filter((x): x is string => !!x));
        const langsSet: Set<string> = new Set(papers.map(p => p.language).filter((x): x is string => !!x));
        const typesSet: Set<string> = new Set(papers.map(p => p.type).filter((x): x is string => !!x));

        const llms: string[] = [...llmsSet].sort((a, b) => a.localeCompare(b));
        const languages: string[] = [...langsSet].sort((a, b) => a.localeCompare(b));
        const types: string[] = [...typesSet].sort((a, b) => a.localeCompare(b));

        return new AutoFormalisationFiltersDiv(llms, languages, types, this.filtersCallback.bind(this));
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The main container div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the main container div is null or undefined.");

        if (this.div.hidden) {
            console.log("The main container div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the main container div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the main container div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The main container div is already shown.");
        }
        else if (this.packed) {
            this.topMessageDiv.show();
            this.filtersDiv.show();

            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the main container div is not packed.");
        }
    }

    public isHidden(): boolean {
        return this.div.hidden;
    }

    private packAndAppendTopMessageDiv(): void {
        this.topMessageDiv.pack();

        this.div.appendChild(this.topMessageDiv.getDiv());
    }

    private packAndAppendFiltersDiv(): void {
        this.filtersDiv.pack();

        this.div.appendChild(this.filtersDiv.getDiv());
    }

    private packAndAppendPapersDiv(): void {
        const paperDivs: AutoFormalisationPaperDiv[] = [];

        for (const paper of this.filteredPapers) {
            const paperDiv: AutoFormalisationPaperDiv = new AutoFormalisationPaperDiv(paper);

            paperDivs.push(paperDiv);
        }

        const papersDiv: AutoFormalisationPapersDiv = new AutoFormalisationPapersDiv(paperDivs);

        papersDiv.pack();
        papersDiv.show();

        this.div.appendChild(papersDiv.getDiv());
    }

    private packAndAppendStatisticsDiv(): void {
        const statisticsDiv: AutoFormalisationStatisticsDiv = new AutoFormalisationStatisticsDiv(this.filteredPapers);

        statisticsDiv.pack();
        statisticsDiv.show();

        this.div.appendChild(statisticsDiv.getDiv());
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the main container div is null or undefined.");

        if (this.packed) {
            console.log("The main container div is already packed.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the main container div must be hidden before packing.");
        }

        AutoFormalisationValidator.ensureExists(this.topMessageDiv, "Cannot pack: the top message div is null or undefined.");

        this.packAndAppendTopMessageDiv();
        this.packAndAppendFiltersDiv();
        this.packAndAppendPapersDiv();
        this.packAndAppendStatisticsDiv();

        this.packed = true;
    }

    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the main container div is null or undefined.");

        if (!this.packed) {
            console.log("The main container div is already unpacked.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the main container div must be hidden before unpacking.");
        }

        AutoFormalisationValidator.ensureExists(this.topMessageDiv, "Cannot unpack: the top message div is null or undefined.");

        this.topMessageDiv.hide();
        this.topMessageDiv.unpack();

        AutoFormalisationHTMLUtils.clearElementChildren(this.div);

        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}
