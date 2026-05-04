import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";

export class AutoFormalisationPaginationDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly totalPapers: number;
    private readonly currentPage: number;
    private readonly pageSize: number;
    private readonly onPageChange: (page: number) => void;
    private packed: boolean;

    public constructor(totalPapers: number, currentPage: number, pageSize: number, onPageChange: (page: number) => void) {
        this.totalPapers = totalPapers;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.onPageChange = onPageChange;

        this.div = document.createElement("div");
        this.div.id = "pagination-div";
        this.div.hidden = true;

        this.packed = false;
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The pagination div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the pagination div is null or undefined.");

        if (this.div.hidden) {
            console.log("The pagination div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the pagination div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the pagination div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The pagination div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the pagination div is not packed.");
        }
    }

    public isHidden(): boolean {
        return !!this.div.hidden;
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the pagination div is null or undefined.");

        if (this.packed) {
            console.log("The pagination div is already packed.");
            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the pagination div must be hidden before packing.");
        }

        const totalPages = Math.ceil(this.totalPapers / this.pageSize);

        const prevButton = document.createElement("button");
        prevButton.textContent = "← Prev";
        prevButton.className = "pagination-button";
        prevButton.disabled = this.currentPage <= 1;
        prevButton.addEventListener("click", () => {
            this.onPageChange(this.currentPage - 1);
            document.getElementById("papers-div")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        const info = document.createElement("span");
        info.className = "pagination-info";
        info.textContent = `Page ${this.currentPage} of ${totalPages} (${this.totalPapers} papers)`;

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next →";
        nextButton.className = "pagination-button";
        nextButton.disabled = this.currentPage >= totalPages;
        nextButton.addEventListener("click", () => {
            this.onPageChange(this.currentPage + 1);
            document.getElementById("papers-div")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        this.div.appendChild(prevButton);
        this.div.appendChild(info);
        this.div.appendChild(nextButton);

        this.packed = true;
    }

    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the pagination div is null or undefined.");

        if (!this.packed) {
            console.log("The pagination div is already unpacked.");
            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the pagination div must be hidden before unpacking.");
        }

        this.div.innerHTML = "";
        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}
