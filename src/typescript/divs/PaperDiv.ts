import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { Paper } from "../utils/Paper";
import { DomManipulation } from "../utils/DomManipulation";

export class PaperDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly paper: Paper = {} as Paper;
    private packed: boolean;

    public constructor(paper: Paper) {
        if (AutoFormalisationValidator.allArgumentsExist(paper)) {
            this.paper = paper;
            this.div = document.createElement("div");

            this.div.classList.add("paper-div");
            this.div.hidden = true;
            this.packed = false;
        }
        else {
            throw new Error("The paper cannot be null or undefined.");
        }
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.validateExistence(this.div, "The paper div is null or undefined.");

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
            console.log("The paper div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new Error("Cannot hide: the paper div is not packed.");
        }
    }

    public show(): void {
        if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot show: the paper div is null or undefined.");
        }
        else if (!this.div.hidden) {
            console.log("The paper div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new Error("Cannot show: the paper div is not packed.");
        }
    }

    public isHidden(): boolean {
        return this.div.hidden;
    }

    public pack(): void {
        if (this.packed) {
            console.log("The paper div is already packed.");
        }
        else if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot pack: the paper div is null or undefined.");
        }
        else if (!this.div.hidden) {
            throw new Error("Cannot pack: the paper div is not hidden (it must be before packing it).");
        }
        else if (AutoFormalisationValidator.allArgumentsExist(this.paper)) {
            PaperDiv.addPaperToDiv();

            this.packed = true;
        }
        else {
            throw new Error("Cannot pack: the paper is null or undefined.");
        }
    }

    private static addPaperToDiv(): void {
        // TODO: implementation to add paper details to the div goes here.
    }

    public unpack(): void {
        if (!this.packed) {
            console.log("The paper div is already unpacked.");
        }
        else if (!AutoFormalisationValidator.allArgumentsExist(this.div)) {
            throw new Error("Cannot unpack: the paper div is null or undefined.");
        }
        else if (this.div.hidden) {
            DomManipulation.clearElementChildren(this.div);

            this.packed = false;
        }
        else {
            throw new Error("Cannot unpack: the paper div is not hidden (it must be before unpacking it).");
        }
    }

    public isPacked(): boolean {
        return this.packed;
    }    
}
