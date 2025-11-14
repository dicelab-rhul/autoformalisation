import { AutoFormalisationValidator } from "./AutoFormalisationValidator";

type ClassList = readonly string[];

export class AutoFormalisationHTMLUtils {
    private constructor() {}

    private static addClassesIfAny(element: HTMLElement, classes?: ClassList): void {
        if (!AutoFormalisationValidator.isNil(classes)) {
            element.classList.add(...classes);
        }
    }

    public static createParagraph(text: string, classes?: ClassList): HTMLParagraphElement {
        const p = document.createElement("p");
        p.textContent = text;
        AutoFormalisationHTMLUtils.addClassesIfAny(p, classes);
        return p;
    }

    public static createBoldLabel(label: string, value: string, classes?: ClassList): HTMLParagraphElement {
        const p = document.createElement("p");
        const b = document.createElement("b");

        b.textContent = label + ": ";
        p.appendChild(b);
        p.appendChild(document.createTextNode(value));

        AutoFormalisationHTMLUtils.addClassesIfAny(p, classes);

        return p;
    }

    public static createLink(url: string, label: string, classes?: ClassList): HTMLParagraphElement {
        const p = document.createElement("p");
        const a = document.createElement("a");

        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = label;

        AutoFormalisationHTMLUtils.addClassesIfAny(p, classes);

        p.appendChild(a);

        return p;
    }

    public static createDivWithLabel(divID: string, labelFor: string, labelText: string, classes?: ClassList, classesForLabel?: ClassList): HTMLDivElement {
        const div = document.createElement("div");
        div.id = divID;

        AutoFormalisationHTMLUtils.addClassesIfAny(div, classes);

        const label = AutoFormalisationHTMLUtils.createLabel(labelFor, labelText, classesForLabel);
        div.appendChild(label);

        return div;
    }

    public static createLabel(labelFor: string, labelText: string, classes?: ClassList): HTMLLabelElement {
        const label = document.createElement("label");
        label.htmlFor = labelFor;
        label.textContent = labelText;
        AutoFormalisationHTMLUtils.addClassesIfAny(label, classes);
        return label;
    }

    // CHECKBOX OVERLOADS
    public static createCheckbox(checkboxID: string): HTMLInputElement;
    public static createCheckbox(checkboxID: string, checked: boolean): HTMLInputElement;
    public static createCheckbox(checkboxID: string, checked: boolean, classes: ClassList): HTMLInputElement;
    public static createCheckbox(checkboxID: string, checked?: boolean, classes?: ClassList): HTMLInputElement {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = checkboxID;
        checkbox.checked = AutoFormalisationValidator.isNil(checked) ? false : checked;
        AutoFormalisationHTMLUtils.addClassesIfAny(checkbox, classes);
        return checkbox;
    }

    public static createFileInput(fileInputID: string, accept?: string, classes?: ClassList): HTMLInputElement {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = fileInputID;
        fileInput.accept = AutoFormalisationValidator.isNil(accept) ? "" : accept;
        AutoFormalisationHTMLUtils.addClassesIfAny(fileInput, classes);
        return fileInput;
    }

    public static createNumberInputsDivs(numberInputsTexts: string[], numberInputsIDsDivSuffix: string, numberInputsIDsSuffix: string, classesForAllDivs?: ClassList, classesForAllLabels?: ClassList): HTMLDivElement[] {
        const numberInputsDivs: HTMLDivElement[] = [];

        for (const text of numberInputsTexts) {
            const lower = text.toLowerCase();
            const numberInputID = lower + numberInputsIDsSuffix;
            const numberInputDivID = lower + numberInputsIDsDivSuffix;

            const numberInput = AutoFormalisationHTMLUtils.createNumberInput(numberInputID);
            const numberInputDiv = AutoFormalisationHTMLUtils.createDivWithLabel(numberInputDivID, numberInputID, text, classesForAllDivs, classesForAllLabels);

            numberInputDiv.appendChild(numberInput);
            numberInputsDivs.push(numberInputDiv);
        }

        return numberInputsDivs;
    }

    // NUMBER INPUT STRONG OVERLOADS
    public static createNumberInput(numberInputID: string): HTMLInputElement;
    public static createNumberInput(numberInputID: string, classes: ClassList): HTMLInputElement;
    public static createNumberInput(numberInputID: string, classes: ClassList, min: number, max: number): HTMLInputElement;
    public static createNumberInput(numberInputID: string, classes: ClassList, min: number, max: number, step: number): HTMLInputElement;
    public static createNumberInput(numberInputID: string, classes: ClassList, min: number, max: number, step: number, value: number): HTMLInputElement;
    public static createNumberInput(numberInputID: string, classes?: ClassList, min?: number, max?: number, step?: number, value?: number): HTMLInputElement {
        const numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.id = numberInputID;
        numberInput.min = AutoFormalisationValidator.isNil(min) ? "" : min.toString();
        numberInput.max = AutoFormalisationValidator.isNil(max) ? "" : max.toString();
        numberInput.step = AutoFormalisationValidator.isNil(step) ? "" : step.toString();
        numberInput.value = AutoFormalisationValidator.isNil(value) ? "" : value.toString();

        AutoFormalisationHTMLUtils.addClassesIfAny(numberInput, classes);

        return numberInput;
    }

    public static createOptionElement<T extends string>(optionID: T, optionValue: T, optionText: string, classes?: ClassList): HTMLOptionElement {
        const option = document.createElement("option");
        option.id = optionID;
        option.value = optionValue;
        option.textContent = optionText;
        AutoFormalisationHTMLUtils.addClassesIfAny(option, classes);
        return option;
    }

    public static createSelectElement<T extends string>(selectID: string, optionsValues: readonly T[]): HTMLSelectElement;
    public static createSelectElement<T extends string>(selectID: string, optionsValues: readonly T[], option_id_prefix: string): HTMLSelectElement;
    public static createSelectElement<T extends string>(selectID: string, optionsValues: readonly T[], option_id_prefix: string, classes: ClassList): HTMLSelectElement;
    public static createSelectElement<T extends string>(selectID: string, optionsValues: readonly T[], option_id_prefix?: string, classes?: ClassList): HTMLSelectElement {
        const select = document.createElement("select");
        select.id = selectID;
        AutoFormalisationHTMLUtils.addClassesIfAny(select, classes);

        for (const value of optionsValues) {
            const optionID = AutoFormalisationValidator.isNil(option_id_prefix) ? value : option_id_prefix + value;
            const option = AutoFormalisationHTMLUtils.createOptionElement(optionID as T, value, value);
            select.appendChild(option);
        }

        return select;
    }

    public static getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
        const el = document.getElementById(id);
        if (el) {
            return el as T;
        }
        else {
            throw new TypeError(`Element with ID "${id}" not found.`);
        }
    }

    public static clearElementChildren(element: HTMLElement): void {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    }
}
