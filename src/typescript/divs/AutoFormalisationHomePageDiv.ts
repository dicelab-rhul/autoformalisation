export class AutoFormalisationHomePageDiv {
    private readonly div: HTMLDivElement;

    public constructor() {
        this.div = document.createElement("div");
        this.div.id = "home-page-div";
        this.build();
    }

    private build(): void {
        const hero = document.createElement("div");
        hero.id = "hero-placeholder";
        hero.textContent = "Autoformalization Papers";
        this.div.appendChild(hero);

        this.div.appendChild(this.buildWhatIsSection());
        this.div.appendChild(this.buildWhySection());
        this.div.appendChild(this.buildRepositorySection());
        this.div.appendChild(this.buildContributeSection());
    }

    private createSection(title: string): HTMLDivElement {
        const section = document.createElement("div");
        section.className = "home-section";
        const h2 = document.createElement("h2");
        h2.textContent = title;
        section.appendChild(h2);
        return section;
    }

    private buildWhatIsSection(): HTMLDivElement {
        const section = this.createSection("What is autoformalization?");

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
        return section;
    }

    private buildWhySection(): HTMLDivElement {
        const section = this.createSection("Why does it matter?");

        const p = document.createElement("p");
        p.textContent = "Autoformalization helps connect human language and machine verification. It matters because it can:";
        section.appendChild(p);

        const ul = document.createElement("ul");
        for (const item of [
            "bridge informal mathematical text and formal proofs",
            "make AI-generated reasoning more reliable and checkable",
            "enable systems that combine language understanding with symbolic verification"
        ]) {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        }
        section.appendChild(ul);

        const p2 = document.createElement("p");
        p2.textContent = "As AI systems become more capable but remain error-prone, autoformalization offers a path toward reasoning that is both flexible and verifiable.";
        section.appendChild(p2);

        return section;
    }

    private buildRepositorySection(): HTMLDivElement {
        const section = this.createSection("What is this repository?");

        for (const text of [
            "This repository is a structured, community-driven collection of research papers on autoformalization.",
            "It covers work across formal mathematics, logical reasoning, planning, and knowledge representation, with metadata for domain, target languages and repositories.",
            "This repository is curated but not exhaustive."
        ]) {
            const p = document.createElement("p");
            p.textContent = text;
            section.appendChild(p);
        }

        return section;
    }

    private buildContributeSection(): HTMLDivElement {
        const section = this.createSection("How can I contribute?");

        const p = document.createElement("p");
        p.textContent = "Help us improve coverage and metadata across the field. You can:";
        section.appendChild(p);

        const ul = document.createElement("ul");
        for (const item of [
            "suggest a paper",
            "open a pull request",
            "fix links or metadata",
            "propose new tags or categories"
        ]) {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        }
        section.appendChild(ul);

        return section;
    }

    public getDiv(): HTMLDivElement {
        return this.div;
    }

    public show(): void { this.div.hidden = false; }
    public hide(): void { this.div.hidden = true; }
}
