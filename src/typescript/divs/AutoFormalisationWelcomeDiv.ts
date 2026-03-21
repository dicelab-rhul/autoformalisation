import { AutoFormalisationDiv } from "./AutoFormalisationDiv";
import { AutoFormalisationValidator } from "../utils/AutoFormalisationValidator";
import { AutoFormalisationHTMLUtils } from "../utils/AutoFormalisationHTMLUtils";

export class AutoFormalisationWelcomeDiv implements AutoFormalisationDiv {
    private readonly div: HTMLDivElement;
    private readonly messageParagraph: HTMLParagraphElement;
    private readonly closeButton: HTMLButtonElement;
    private packed: boolean;

    public constructor(message: string, cookieName: string, cookieValue: string, buttonCallback: () => void) {
        AutoFormalisationValidator.ensureExists(message, "The message cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(cookieName, "The cookie name cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(cookieValue, "The cookie value cannot be null or undefined.");
        AutoFormalisationValidator.ensureExists(buttonCallback, "The button callback cannot be null or undefined.");

        this.div = document.createElement("div");

        this.div.id = "welcome-div";
        this.div.hidden = true;

        this.messageParagraph = document.createElement("p");

        this.messageParagraph.textContent = message;

        this.closeButton = document.createElement("button");

        this.closeButton.id = "welcome-close-button";
        this.closeButton.textContent = "Close";
        this.closeButton.addEventListener("click", () => {
            this.hide();
            this.unpack();

            document.cookie = `${cookieName}=${cookieValue}; max-age=31536000; SameSite=Strict; secure`;

            buttonCallback();
        });

        this.packed = false;
    }

    public getDiv(): HTMLDivElement {
        AutoFormalisationValidator.ensureExists(this.div, "The welcome div is null or undefined.");

        if (!this.packed) {
            this.pack();
        }

        return this.div;
    }

    public hide(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot hide: the welcome div is null or undefined.");

        if (this.div.hidden) {
            console.log("The welcome div is already hidden.");
        }
        else if (this.packed) {
            this.div.hidden = true;
        }
        else {
            throw new TypeError("Cannot hide: the welcome div is not packed.");
        }
    }

    public show(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot show: the welcome div is null or undefined.");

        if (!this.div.hidden) {
            console.log("The welcome div is already shown.");
        }
        else if (this.packed) {
            this.div.hidden = false;
        }
        else {
            throw new TypeError("Cannot show: the welcome div is not packed.");
        }
    }

    public isHidden(): boolean {
        return !!this.div.hidden;
    }

    public pack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot pack: the welcome div is null or undefined.");

        if (this.packed) {
            console.log("The welcome div is already packed.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot pack: the welcome div must be hidden before packing.");
        }

        AutoFormalisationValidator.ensureExists(this.messageParagraph, "Cannot pack: the message paragraph is null or undefined.");
        AutoFormalisationValidator.ensureExists(this.closeButton, "Cannot pack: the close button is null or undefined.");

        this.div.appendChild(this.messageParagraph);
        this.div.appendChild(this.closeButton);

        this.packed = true;
    }

    public unpack(): void {
        AutoFormalisationValidator.ensureExists(this.div, "Cannot unpack: the welcome div is null or undefined.");

        if (!this.packed) {
            console.log("The welcome div is already unpacked.");

            return;
        }

        if (!this.div.hidden) {
            throw new TypeError("Cannot unpack: the welcome div must be hidden before unpacking.");
        }

        AutoFormalisationHTMLUtils.clearElementChildren(this.div);

        this.packed = false;
    }

    public isPacked(): boolean {
        return this.packed;
    }
}
