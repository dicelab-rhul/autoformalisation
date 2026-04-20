export class AutoFormalisationAboutDiv {
    private readonly div: HTMLDivElement;

    public constructor() {
        this.div = document.createElement("div");
        this.div.id = "about-page-div";
        this.build();
    }

    private build(): void {
        const section = document.createElement("div");
        section.className = "home-section";

        const h2 = document.createElement("h2");
        h2.textContent = "What is autoformalization?";
        section.appendChild(h2);

        const p1 = document.createElement("p");
        p1.textContent = "Autoformalization is the automatic transformation of informal or semi-formal language into a formal language that supports automated reasoning or verification. Although the term originated in the formalization of mathematics with interactive theorem provers, it can more broadly be seen as a form of semantic parsing in which the output is a formal, machine-interpretable representation.";
        section.appendChild(p1);

        const p2 = document.createElement("p");
        p2.textContent = "In this sense, autoformalization refers to the translation of such language into any machine-executable formal language used for knowledge representation and reasoning.";
        section.appendChild(p2);

        const exampleBlock = document.createElement("div");
        exampleBlock.className = "example-block";

        const exampleLabel = document.createElement("span");
        exampleLabel.className = "bold-text";
        exampleLabel.textContent = "Example:";
        exampleBlock.appendChild(exampleLabel);
        exampleBlock.appendChild(document.createElement("br"));
        exampleBlock.appendChild(document.createTextNode("From"));
        exampleBlock.appendChild(document.createElement("br"));

        const em = document.createElement("em");
        em.textContent = '"All humans are mortal. Socrates is a human. Therefore, Socrates is mortal."';
        exampleBlock.appendChild(em);

        const code = document.createElement("code");
        code.textContent = "∀x (Human(x) → Mortal(x)), Human(Socrates), Mortal(Socrates).";
        exampleBlock.appendChild(code);
        exampleBlock.appendChild(document.createElement("br"));
        exampleBlock.appendChild(document.createTextNode("A formal reasoner can then verify that the conclusion follows."));

        section.appendChild(exampleBlock);
        this.div.appendChild(section);
    }

    public getDiv(): HTMLDivElement {
        return this.div;
    }

    public show(): void { this.div.hidden = false; }
    public hide(): void { this.div.hidden = true; }
}
