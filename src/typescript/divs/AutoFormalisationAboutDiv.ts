export class AutoFormalisationAboutDiv {
    private readonly div: HTMLDivElement;

    public constructor() {
        this.div = document.createElement("div");
        this.div.id = "about-page-div";
        this.build();
    }

    private build(): void{
        this.addSection("What is autoformalization?", `
            <p>Autoformalization is the automatic transformation of informal or semi-formal language into a formal language that supports automated reasoning or verification. Although the term originated in the formalization of mathematics with interactive theorem provers, it can more broadly be seen as a form of semantic parsing in which the output is a formal, machine-interpretable representation.</p>
            <p>In this sense, autoformalization refers to the translation of such language into any machine-executable formal language used for knowledge representation and reasoning.</p>
            <div class="example-block">
                <strong>Example:</strong><br/>
                From<br/>
                <em>"All humans are mortal. Socrates is a human. Therefore, Socrates is mortal."</em>
                <code>∀x (Human(x) → Mortal(x)), Human(Socrates), Mortal(Socrates).</code>
                <br/>A formal reasoner can then verify that the conclusion follows.
            </div>
        `);
    }
    private addSection(title: string, html: string): void {
        const section = document.createElement("div");
        section.className = "home-section";
        section.innerHTML = `<h2>${title}</h2>${html}`;
        this.div.appendChild(section);
    }

    public getDiv(): HTMLDivElement {
        return this.div;
    }

    public show(): void { this.div.hidden = false; }
    public hide(): void { this.div.hidden = true; }
}