import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";

export class AutoFormalisationTopMessageDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly mainTitle: string;
    private readonly message: string;
    private packed: boolean;

    public constructor(mainTitle: string, message: string) {
        AutoFormalisationValidator.ensureExists(mainTitle, "The main title cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(message, "The message cannot be null or undefined.");

        this.mainTitle = mainTitle;
        this.message = message;

        this.div = document.createElement("div");

        this.div.id = "top-message-div";
        this.div.hidden = true;

        this.packed = false;
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

        AutoFormalisationValidator.ensureExists(this.mainTitle, "Cannot pack: the main title is null or undefined.");
        AutoFormalisationValidator.ensureExists(this.message, "Cannot pack: the message is null or undefined.");

        this.addTitleAndMessageToDiv();

        this.packed = true;
    }

    private addTitleAndMessageToDiv(): void {
        const titleElement: HTMLHeadingElement = document.createElement("h1");

        titleElement.textContent = this.mainTitle;

        const messageElement: HTMLParagraphElement = document.createElement("p");

        messageElement.textContent = this.message;

        this.div.appendChild(titleElement);
        this.div.appendChild(messageElement);
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
