import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";
import { AutoFormalisationTopMessageDiv } from "./AutoFormalisationTopMessageDiv";
import { AutoFormalisationPaperDiv } from "./AutoFormalisationPaperDiv";
import { Paper } from "../papers/Paper";
import { Filters } from "../papers/Filters";
import { EmptyFilters } from "../papers/EmptyFilters";
import { AutoFormalisationPapersDiv } from "./AutoFormalisationPapersDiv";
import { AutoFormalisationFiltersDiv } from "./AutoFormalisationFiltersDiv";
import { AutoFormalisationPaginationDiv } from "./AutoFormalisationPaginationDiv";

export class AutoFormalisationMainContainerDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly topMessageDiv: AutoFormalisationTopMessageDiv;
    private readonly filtersDiv: AutoFormalisationFiltersDiv;
    private readonly filteredPapers: Paper[];
    private readonly topMessage: string;
    private readonly counterMessage: string;
    private readonly description: string;
    private packed: boolean;
    private currentPage: number = 1;
    private readonly pageSize: number = 20;
    private currentlyVisiblePapers: Paper[] = [];
    private currentPaginationDiv!: AutoFormalisationPaginationDiv;

    public constructor(papers: Paper[], filters: Filters, topMessage: string, counterMessage: string, description: string) {
        AutoFormalisationValidator.ensureExists(papers, "The papers list cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(papers, "The papers list cannot contain null or undefined entries.");
        AutoFormalisationValidator.ensureExists(filters, "The filters cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(topMessage, "The top message cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(counterMessage, "The counter message cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(description, "The description cannot be null or undefined.");

        this.filteredPapers = AutoFormalisationMainContainerDiv.filterPapers(papers, filters);
        this.currentlyVisiblePapers = [...this.filteredPapers];
        this.topMessage = topMessage;
        this.counterMessage = counterMessage;
        this.description = description;

        this.div = document.createElement("div");

        this.div.id = "main-container-div";
        this.div.hidden = true;

        this.topMessageDiv = new AutoFormalisationTopMessageDiv(this.topMessage, this.counterMessage, this.description);
        this.filtersDiv = this.createFiltersDiv(papers);
        this.packed = false;
    }

    private filtersCallback(filters: Filters): void {
        this.currentlyVisiblePapers = this.filteredPapers.filter(p => this.doesPaperMatchFilters(p, filters));
        this.currentPage = 1;
        this.refreshPapersDiv();
        this.refreshPaginationDiv();
    }

    private refreshPapersDiv(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const pageSlice = this.currentlyVisiblePapers.slice(start, start + this.pageSize);
        const paperDivs: AutoFormalisationPaperDiv[] = pageSlice.map(p => new AutoFormalisationPaperDiv(p));
        const newPapersDiv = new AutoFormalisationPapersDiv(paperDivs);

        newPapersDiv.pack();
        newPapersDiv.show();

        const existing = AutoFormalisationHTMLUtils.getElementByIdOrThrow<HTMLDivElement>("papers-div");

        existing.replaceWith(newPapersDiv.getDiv());
    }

    private refreshPaginationDiv(): void {
        const newPaginationDiv = new AutoFormalisationPaginationDiv(
            this.currentlyVisiblePapers.length,
            this.currentPage,
            this.pageSize,
            (page) => this.goToPage(page)
        );

        newPaginationDiv.pack();
        newPaginationDiv.show();

        const existing = AutoFormalisationHTMLUtils.getElementByIdOrThrow<HTMLDivElement>("pagination-div");

        existing.replaceWith(newPaginationDiv.getDiv());

        this.currentPaginationDiv = newPaginationDiv;
    }

    private goToPage(page: number): void {
        this.currentPage = page;
        this.refreshPapersDiv();
        this.refreshPaginationDiv();
    }

    public doesPaperMatchFilters(paper: Paper, filters: Filters): boolean {
        const appliedFilters: Filters = filters ?? new EmptyFilters();

        return ((!appliedFilters.language || paper.language === appliedFilters.language)
            && (!appliedFilters.type || paper.type === appliedFilters.type)
            && (!appliedFilters.goal || paper.goal === appliedFilters.goal)
            && (!appliedFilters.area || paper.area === appliedFilters.area)
            && (!appliedFilters.repository || paper.repository === appliedFilters.repository)
            && (appliedFilters.search
                ? (paper.title?.toLowerCase().includes(appliedFilters.search.toLowerCase())
                    || paper.author?.toLowerCase().includes(appliedFilters.search.toLowerCase()))
                : true)) ?? false;
    }

    private static filterPapers(papers: Paper[], filters: Filters): Paper[] {
        const appliedFilters: Filters = filters ?? new EmptyFilters();

        return papers
            .filter((p) => !appliedFilters.language || p.language === appliedFilters.language)
            .filter((p) => !appliedFilters.type || p.type === appliedFilters.type)
            .filter((p) => !appliedFilters.goal || p.goal === appliedFilters.goal)
            .filter((p) => !appliedFilters.area || p.area === appliedFilters.area)
            .filter((p) => !appliedFilters.repository || p.repository === appliedFilters.repository)
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
        const langsSet: Set<string> = new Set(papers.map(p => p.language).filter((x): x is string => !!x));
        const typesSet: Set<string> = new Set(papers.map(p => p.type).filter((x): x is string => !!x));
        const goalsSet: Set<string> = new Set(papers.map(p => p.goal).filter((x): x is string => !!x));
        const areasSet: Set<string> = new Set(papers.map(p => p.area).filter((x): x is string => !!x));
        const repositoriesSet: Set<string> = new Set(papers.map(p => p.repository).filter((x): x is string => !!x));

        const languages: string[] = [...langsSet].sort((a, b) => a.localeCompare(b));
        const types: string[] = [...typesSet].sort((a, b) => a.localeCompare(b));
        const goals: string[] = [...goalsSet].sort((a, b) => a.localeCompare(b));
        const areas: string[] = [...areasSet].sort((a, b) => a.localeCompare(b));
        const repositories: string[] = [...repositoriesSet].sort((a, b) => a.localeCompare(b));

        return new AutoFormalisationFiltersDiv(languages, types, goals, areas, repositories, this.filtersCallback.bind(this));
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
        return !!this.div.hidden;
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
        const start = (this.currentPage - 1) * this.pageSize;
        const pageSlice = this.currentlyVisiblePapers.slice(start, start + this.pageSize);
        const paperDivs: AutoFormalisationPaperDiv[] = pageSlice.map(p => new AutoFormalisationPaperDiv(p));
        const papersDiv: AutoFormalisationPapersDiv = new AutoFormalisationPapersDiv(paperDivs);

        papersDiv.pack();
        papersDiv.show();

        this.div.appendChild(papersDiv.getDiv());
    }

    private packAndAppendPaginationDiv(): void {
        const paginationDiv = new AutoFormalisationPaginationDiv(
            this.currentlyVisiblePapers.length,
            this.currentPage,
            this.pageSize,
            (page) => this.goToPage(page)
        );

        paginationDiv.pack();
        paginationDiv.show();

        this.currentPaginationDiv = paginationDiv;

        this.div.appendChild(paginationDiv.getDiv());
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
        this.packAndAppendPaginationDiv();

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
