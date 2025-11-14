import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";
import { AutoFormalisationPaperDiv } from "./AutoFormalisationPaperDiv";

export class AutoFormalisationPapersDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly paperDivs: AutoFormalisationPaperDiv[];
    private packed: boolean;

    public constructor(paperDivs: AutoFormalisationPaperDiv[]) {
        AutoFormalisationValidator.ensureExists(paperDivs, "The papers cannot be null or undefined.");

        this.paperDivs = paperDivs;

        this.div = document.createElement("div");

        this.div.id = "papers-div";
        this.div.hidden = true;

        this.packed = false;
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The papers div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the papers div is null or undefined.");

        if (this.div.hidden) {
            console.log("The papers div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the papers div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the papers div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The papers div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the papers div is not packed.");
        }
    }

    public isHidden(): boolean {
        return this.div.hidden;
    }

    private packAndAppendAllPaperDivs(): void {
        for (const pd of this.paperDivs) {
            pd.pack();
            pd.show();

            this.div.appendChild(pd.getDiv());
        }
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the papers div is null or undefined.");

        if (this.packed) {
            console.log("The papers div is already packed.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the papers div must be hidden before packing.");
        }

        AutoFormalisationValidator.ensureExists(this.paperDivs, "Cannot pack: the papers list is null or undefined.");

        this.packAndAppendAllPaperDivs();

        this.packed = true;
    }

    private unpackAllPaperDivs(): void {
        for (const pd of this.paperDivs) {
            pd.hide();
            pd.unpack();
        }
    }

    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the papers div is null or undefined.");

        if (!this.packed) {
            console.log("The papers div is already unpacked.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the papers div must be hidden before unpacking.");
        }

        AutoFormalisationValidator.ensureExists(this.paperDivs, "Cannot unpack: at least one paper div is null or undefined.");

        this.unpackAllPaperDivs();

        AutoFormalisationHTMLUtils.clearElementChildren(this.div);

        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}
