import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";
import { Paper } from "../papers/Paper";

export class AutoFormalisationPaperDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly paper: Paper;
    private packed: boolean;

    public constructor(paper: Paper) {
        AutoFormalisationValidator.ensureExists(paper, "The paper cannot be null or undefined.");

        this.paper = paper;

        this.div = document.createElement("div");

        this.div.id = `paper-div-${paper.ID}`;
        this.div.classList.add("paper-div");
        this.div.hidden = true;

        this.packed = false;
    }

    public getPaper(): Paper {
        return this.paper;
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The paper div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the paper div is null or undefined.");

        if (this.div.hidden) {
            console.log("The paper div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the paper div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the paper div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The paper div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the paper div is not packed.");
        }
    }

    public isHidden(): boolean {
        return this.div.hidden;
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the paper div is null or undefined.");

        if (this.packed) {
            console.log("The paper div is already packed.");

            return;
        }
        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the paper div must be hidden before packing.");
        }

        AutoFormalisationValidator.ensureExists(this.paper, "Cannot pack: the paper is null or undefined.");

        this.addPaperToDiv();

        this.packed = true;
    }

    private addPaperToDiv(): void {
        const h3: HTMLHeadingElement = document.createElement("h3");

        h3.textContent = this.paper.title ?? "";

        this.div.appendChild(h3);

        const meta: HTMLParagraphElement = document.createElement("p");
        const strong: HTMLElement = document.createElement("strong");

        strong.textContent = this.paper.author ?? "";

        meta.appendChild(strong);
        meta.appendChild(document.createTextNode(` (${this.paper.year ?? ""})`));

        this.div.appendChild(meta);

        this.appendOptionalEntries();
    }

    private appendOptionalEntries(): void {
        const fields: Array<{ key: keyof Paper; label: string; isLink?: boolean }> = [
            { key: "llm", label: "LLM" },
            { key: "language", label: "Language" },
            { key: "type", label: "Type" },
            { key: "url", label: "Paper", isLink: true },
            { key: "repository", label: "Code", isLink: true }
        ];

        for (const field of fields) {
            const value = this.paper[field.key];

            if (!value) {
                continue;
            }
            else if (field.isLink) {
                this.div.appendChild(AutoFormalisationHTMLUtils.createLink(value as string, field.label));
            }
            else {
                this.div.appendChild(AutoFormalisationHTMLUtils.createBoldLabel(field.label, value as string));
            }
        }
    }


    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the paper div is null or undefined.");

        if (!this.packed) {
            console.log("The paper div is already unpacked.");

            return;
        }
        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the paper div must be hidden before unpacking.");
        }

        AutoFormalisationHTMLUtils.clearElementChildren(this.div);

        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}
