export class DomManipulation {
    public static createParagraph(text: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement("p");

        p.textContent = text;

        return p;
    }

    public static createBoldLabel(label: string, value: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement("p");
        const b: HTMLElement = document.createElement("b");

        b.textContent = label + ": ";

        p.appendChild(b);
        p.appendChild(document.createTextNode(value));

        return p;
    }

    public static createLink(url: string, label: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement("p");
        const a: HTMLAnchorElement = document.createElement("a");

        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = label;

        p.appendChild(a);

        return p;
    }

    public static getElementByIdOrThrowError<T extends HTMLElement>(id: string): T {
        const el: HTMLElement | null = document.getElementById(id);
    
        if (el) {
            return el as T;
        }
        else {
            throw new Error(`Element #${id} not found`);
        }
    }

    public static clearElementChildren(element: HTMLElement): void {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    }
}
