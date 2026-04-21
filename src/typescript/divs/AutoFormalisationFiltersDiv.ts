import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";

export class AutoFormalisationFiltersDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;

    private searchLabel!: HTMLLabelElement;
    private searchInput!: HTMLInputElement;

    private readonly languages: string[];
    private languageFilterLabel!: HTMLLabelElement;
    private languageFilterSelect!: HTMLSelectElement;
    private languageFilterOptions!: HTMLOptionElement[];

    private readonly types: string[];
    private typeFilterLabel!: HTMLLabelElement;
    private typeFilterSelect!: HTMLSelectElement;
    private typeFilterOptions!: HTMLOptionElement[];

    private readonly goals: string[];
    private goalFilterLabel!: HTMLLabelElement;
    private goalFilterSelect!: HTMLSelectElement;
    private goalFilterOptions!: HTMLOptionElement[];

    private readonly areas: string[];
    private areaFilterLabel!: HTMLLabelElement;
    private areaFilterSelect!: HTMLSelectElement;
    private areaFilterOptions!: HTMLOptionElement[];

    private readonly repositories: string[];
    private repositoryFilterLabel!: HTMLLabelElement;
    private repositoryFilterSelect!: HTMLSelectElement;
    private repositoryFilterOptions!: HTMLOptionElement[];

    private applyButton!: HTMLButtonElement;
    private clearButton!: HTMLButtonElement;

    private readonly callback: (filters: any) => void;

    private packed: boolean;

    public constructor(languages: string[], types: string[], goals: string[], areas: string[], repositories: string[], callback: (filters: any) => void) {
        AutoFormalisationValidator.ensureExists(languages, "Languages cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(languages, "Language values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(types, "Types cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(types, "Type values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(goals, "Goal cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(goals, "Goal values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(areas, "Areas cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(areas, "Area values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(repositories, "Repositories cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(repositories, "Repositories values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(callback, "Callback cannot be null or undefined.");

        this.languages = languages;
        this.types = types;
        this.goals = goals;
        this.areas = areas;
        this.repositories = repositories;

        this.callback = callback;

        this.div = document.createElement("div");

        this.div.id = "filters-div";

        this.createFilters();

        this.div.hidden = true;

        this.packed = false;
    }

    private createFilters(): void {
        // Search
        this.searchLabel = AutoFormalisationHTMLUtils.createLabel("filter-search", "Search:");
        this.searchInput = document.createElement("input");
        this.searchInput.type = "text";
        this.searchInput.id = "filter-search";
        this.searchInput.name = "filter-search";

        // Language Filter
        this.languageFilterLabel = AutoFormalisationHTMLUtils.createLabel("filter-lang", "Language:");
        this.languageFilterSelect = AutoFormalisationHTMLUtils.createSelectElement("filter-lang", []);
        this.languageFilterSelect.name = "filter-lang";
        this.languageFilterOptions = AutoFormalisationFiltersDiv.createOptionElements(this.languageFilterSelect, new Set(this.languages));

        // Type Filter
        this.typeFilterLabel = AutoFormalisationHTMLUtils.createLabel("filter-type", "Type:");
        this.typeFilterSelect = AutoFormalisationHTMLUtils.createSelectElement("filter-type", []);
        this.typeFilterSelect.name = "filter-type";
        this.typeFilterOptions = AutoFormalisationFiltersDiv.createOptionElements(this.typeFilterSelect, new Set(this.types));

        // Goal Filter
        this.goalFilterLabel = AutoFormalisationHTMLUtils.createLabel("filter-goal", "Goal:");
        this.goalFilterSelect = AutoFormalisationHTMLUtils.createSelectElement("filter-goal", []);
        this.goalFilterSelect.name = "filter-goal";
        this.goalFilterOptions = AutoFormalisationFiltersDiv.createOptionElements(this.goalFilterSelect, new Set(this.goals));

        // Area Filter
        this.areaFilterLabel = AutoFormalisationHTMLUtils.createLabel("filter-area", "Area:");
        this.areaFilterSelect = AutoFormalisationHTMLUtils.createSelectElement("filter-area", []);
        this.areaFilterSelect.name = "filter-area";
        this.areaFilterOptions = AutoFormalisationFiltersDiv.createOptionElements(this.areaFilterSelect, new Set(this.areas));

        // Repository Filter
        this.repositoryFilterLabel = AutoFormalisationHTMLUtils.createLabel("filter-repository", "Repository:");
        this.repositoryFilterSelect = AutoFormalisationHTMLUtils.createSelectElement("filter-repository", []);
        this.repositoryFilterSelect.name = "filter-repository";
        this.repositoryFilterOptions = AutoFormalisationFiltersDiv.createOptionElements(this.repositoryFilterSelect, new Set(this.repositories));

        // Apply Button
        this.applyButton = document.createElement("button");
        this.applyButton.textContent = "Apply Filters";
        this.applyButton.id = "apply-filters-button";
        this.applyButton.addEventListener("click", () => {
            console.log("Apply Filters button clicked.");

            this.callback({
                search: this.searchInput.value,
                language: this.languageFilterSelect.value,
                type: this.typeFilterSelect.value,
                goal: this.goalFilterSelect.value,
                area: this.areaFilterSelect.value,
                repository: this.repositoryFilterSelect.value
            });
        });

        // Allow pressing Enter in the search input to apply filters
        this.searchInput.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();

                this.applyButton.click();
            }
        });

        // Clear Button
        this.clearButton = document.createElement("button");
        this.clearButton.textContent = "Clear Filters";
        this.clearButton.id = "clear-filters-button";
        this.clearButton.addEventListener("click", () => {
            console.log("Clear Filters button clicked.");

            this.searchInput.value = this.searchInput.defaultValue;
            this.languageFilterSelect.value = this.languageFilterSelect.options[0].value;
            this.typeFilterSelect.value = this.typeFilterSelect.options[0].value;
            this.goalFilterSelect.value = this.goalFilterSelect.options[0].value;
            this.areaFilterSelect.value = this.areaFilterSelect.options[0].value;
            this.repositoryFilterSelect.value = this.repositoryFilterSelect.options[0].value;

            this.callback({
                search: "",
                language: "",
                type: "",
                goal: "",
                area: "",
                repository: ""
            });
        });
    }

    private static createOptionElements(selectElement: HTMLSelectElement, values: Set<string>): HTMLOptionElement[] {
        const optionElements: HTMLOptionElement[] = [];

        optionElements.push(AutoFormalisationHTMLUtils.createOptionElement("", "", "All"));

        for (const v of [...values].sort((a, b) => a.localeCompare(b))) {
            const opt: HTMLOptionElement = document.createElement("option");

            opt.value = v;
            opt.textContent = v;

            optionElements.push(opt);
        }

        return optionElements;
    }

    private static appendOptionsToSelect(select: HTMLSelectElement, options: HTMLOptionElement[]): void {
        for (const option of options) {
            select.appendChild(option);
        }
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The filters div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the filters div is null or undefined.");

        if (this.div.hidden) {
            console.log("The filters div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the filters div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the filters div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The filters div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the filters div is not packed.");
        }
    }

    public isHidden(): boolean {
        return !!this.div.hidden;
    }

    private packAndAppendAllFilters(): void {
        // Search
        this.div.appendChild(this.searchLabel);
        this.div.appendChild(this.searchInput);
        this.div.appendChild(document.createElement("br"));

        // Language Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.languageFilterSelect, this.languageFilterOptions);
        this.div.appendChild(this.languageFilterLabel);
        this.div.appendChild(this.languageFilterSelect);

        // Type Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.typeFilterSelect, this.typeFilterOptions);
        this.div.appendChild(this.typeFilterLabel);
        this.div.appendChild(this.typeFilterSelect);

        // Goal Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.goalFilterSelect, this.goalFilterOptions);
        this.div.appendChild(this.goalFilterLabel);
        this.div.appendChild(this.goalFilterSelect);

        // Newline before Domain and Repository filters
        this.div.appendChild(document.createElement("br"));

        // Domain Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.domainFilterSelect, this.domainFilterOptions);
        this.div.appendChild(this.domainFilterLabel);
        this.div.appendChild(this.domainFilterSelect);

        // Repository Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.repositoryFilterSelect, this.repositoryFilterOptions);
        this.div.appendChild(this.repositoryFilterLabel);
        this.div.appendChild(this.repositoryFilterSelect);

        // Buttons in a new line
        this.div.appendChild(document.createElement("br"));
        this.div.appendChild(this.applyButton);
        this.div.appendChild(this.clearButton);
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the filters div is null or undefined.");

        if (this.packed) {
            console.log("The filters div is already packed.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the filters div must be hidden before packing.");
        }

        AutoFormalisationValidator.ensureAllExist([this.searchLabel, this.searchInput]);
        AutoFormalisationValidator.ensureAllExist([this.languageFilterLabel, this.languageFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.languageFilterOptions);
        AutoFormalisationValidator.ensureAllExist([this.typeFilterLabel, this.typeFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.typeFilterOptions);
        AutoFormalisationValidator.ensureAllExist([this.goalFilterLabel, this.goalFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.goalFilterOptions);
        AutoFormalisationValidator.ensureAllExist([this.areaFilterLabel, this.areaFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.areaFilterOptions);
        AutoFormalisationValidator.ensureAllExist([this.repositoryFilterLabel, this.repositoryFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.repositoryFilterOptions);
        AutoFormalisationValidator.ensureExists(this.applyButton);
        AutoFormalisationValidator.ensureExists(this.clearButton);

        this.packAndAppendAllFilters();

        this.packed = true;
    }

    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the filters div is null or undefined.");

        if (!this.packed) {
            console.log("The filters div is already unpacked.");
            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the filters div must be hidden before unpacking.");
        }

        AutoFormalisationHTMLUtils.clearElementChildren(this.div);

        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}
