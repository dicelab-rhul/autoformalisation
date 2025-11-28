import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";

export class AutoFormalisationFiltersDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;

    private searchLabel!: HTMLLabelElement;
    private searchInput!: HTMLInputElement;

    private readonly llms: string[];
    private llmFilterLabel!: HTMLLabelElement;
    private llmFilterSelect!: HTMLSelectElement;
    private llmFilterOptions!: HTMLOptionElement[];

    private readonly languages: string[];
    private languageFilterLabel!: HTMLLabelElement;
    private languageFilterSelect!: HTMLSelectElement;
    private languageFilterOptions!: HTMLOptionElement[];

    private readonly types: string[];
    private typeFilterLabel!: HTMLLabelElement;
    private typeFilterSelect!: HTMLSelectElement;
    private typeFilterOptions!: HTMLOptionElement[];

    private applyButton!: HTMLButtonElement;
    private clearButton!: HTMLButtonElement;

    private readonly callback: (filters: any) => void;

    private packed: boolean;

    public constructor(llms: string[], languages: string[], types: string[], callback: (filters: any) => void) {
        AutoFormalisationValidator.ensureExists(llms, "LLMs cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(llms, "LLM values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(languages, "Languages cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(languages, "Language values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(types, "Types cannot be null or undefined.");
        AutoFormalisationValidator.ensureAllExist(types, "Type values cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(callback, "Callback cannot be null or undefined.");

        this.llms = llms;
        this.languages = languages;
        this.types = types;

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

        // LLM Filter
        this.llmFilterLabel = AutoFormalisationHTMLUtils.createLabel("filter-llm", "LLM:");
        this.llmFilterSelect = AutoFormalisationHTMLUtils.createSelectElement("filter-llm", []);
        this.llmFilterSelect.name = "filter-llm";
        this.llmFilterOptions = AutoFormalisationFiltersDiv.createOptionElements(this.llmFilterSelect, new Set(this.llms));

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

        // Apply Button
        this.applyButton = document.createElement("button");
        this.applyButton.textContent = "Apply Filters";
        this.applyButton.id = "apply-filters-button";
        this.applyButton.addEventListener("click", () => {
            console.log("Apply Filters button clicked.");

            this.callback({
                search: this.searchInput.value,
                llm: this.llmFilterSelect.value,
                language: this.languageFilterSelect.value,
                type: this.typeFilterSelect.value
            });
        });

        // Clear Button
        this.clearButton = document.createElement("button");
        this.clearButton.textContent = "Clear Filters";
        this.clearButton.id = "clear-filters-button";
        this.clearButton.addEventListener("click", () => {
            console.log("Clear Filters button clicked.");

            this.searchInput.value = this.searchInput.defaultValue;
            this.llmFilterSelect.value = this.llmFilterSelect.options[0].value;
            this.languageFilterSelect.value = this.languageFilterSelect.options[0].value;
            this.typeFilterSelect.value = this.typeFilterSelect.options[0].value;

            this.callback({
                search: "",
                llm: "",
                language: "",
                type: ""
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
        return this.div.hidden;
    }

    private packAndAppendAllFilters(): void {
        // Search
        this.div.appendChild(this.searchLabel);
        this.div.appendChild(this.searchInput);

        // LLM Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.llmFilterSelect, this.llmFilterOptions);
        this.div.appendChild(this.llmFilterLabel);
        this.div.appendChild(this.llmFilterSelect);

        // Language Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.languageFilterSelect, this.languageFilterOptions);
        this.div.appendChild(this.languageFilterLabel);
        this.div.appendChild(this.languageFilterSelect);

        // Type Filter
        AutoFormalisationFiltersDiv.appendOptionsToSelect(this.typeFilterSelect, this.typeFilterOptions);
        this.div.appendChild(this.typeFilterLabel);
        this.div.appendChild(this.typeFilterSelect);

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
        AutoFormalisationValidator.ensureAllExist([this.llmFilterLabel, this.llmFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.llmFilterOptions);
        AutoFormalisationValidator.ensureAllExist([this.languageFilterLabel, this.languageFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.languageFilterOptions);
        AutoFormalisationValidator.ensureAllExist([this.typeFilterLabel, this.typeFilterSelect]);
        AutoFormalisationValidator.ensureAllExist(this.typeFilterOptions);
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
