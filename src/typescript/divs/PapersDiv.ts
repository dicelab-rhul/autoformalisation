import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { DomManipulation } from "../utils/DomManipulation";
import { PaperDiv } from "./PaperDiv";

export class PapersDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly paperDivs: PaperDiv[];
    private packed: boolean;

    public constructor(paperDivs: PaperDiv[]) {
        if (AutoFormalisationValidator.allArgumentsExist(paperDivs)) {
            this.paperDivs = paperDivs;
            this.div = document.createElement("div");

            this.div.classList.add("papers-div");
            this.div.hidden = true;
            this.packed = false;
        }
        else {
            throw new Error("The paper cannot be null or undefined.");
        }
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.validateExistence(this.div, "The papers div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot hide: the paper div is null or undefined.");
        }
        else if (this.div.hidden) {
            console.log("The papers div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new Error("Cannot hide: the papers div is not packed.");
        }
    }

    public show(): void {
        if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot show: the papers div is null or undefined.");
        }
        else if (!this.div.hidden) {
            console.log("The papers div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new Error("Cannot show: the papers div is not packed.");
        }
    }

    public isHidden(): boolean {
        return this.div.hidden;
    }

    private packAndAppendAllPaperDivs(): void {
        for (const pd of this.paperDivs) {
            pd.pack();

            this.div.appendChild(pd.getDiv());
        }
    }

    public pack(): void {
        if (this.packed) {
            console.log("The papers div is already packed.");
        }
        else if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot pack: the papers div is null or undefined.");
        }
        else if (!this.div.hidden) {
            throw new Error("Cannot pack: the papers div is not hidden (it must be before packing it).");
        }
        else if (AutoFormalisationValidator.allArgumentsExist(this.paperDivs)) {
            this.packAndAppendAllPaperDivs();

            this.packed = true;
        }
        else {
            throw new Error("Cannot pack: the papers is null or undefined.");
        }
    }

    private unpackAllPaperDivs(): void {
        for (const pd of this.paperDivs) {
            pd.unpack();
        }
    }

    public unpack(): void {
        if (!this.packed) {
            console.log("The papers div is already unpacked.");
        }
        else if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot unpack: the papers div is null or undefined.");
        }
        else if (!this.div.hidden) {
            throw new Error("Cannot unpack: the papers div is not hidden (it must be before unpacking it).");
        }
        else if (AutoFormalisationValidator.allArgumentsExist(this.paperDivs)) {
            this.unpackAllPaperDivs();

            DomManipulation.clearElementChildren(this.div);

            this.packed = false;
        }
        else {
            throw new Error("Cannot unpack: at least a paper div is null or undefined.");
        }
    }

    public isPacked(): boolean {
        return this.packed;
    }    
}
