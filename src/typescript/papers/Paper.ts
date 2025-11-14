export interface Paper {
    ENTRYTYPE?: string;
    ID?: string;
    title: string;
    author?: string;
    journal?: string;
    topic?: string;
    year?: number | string;
    llm?: string;
    language?: string;
    type?: string;
    url?: string;
    repository?: string;
}
