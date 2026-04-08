export interface Paper {
    entrytype: string;
    id: string;
    title: string;
    author?: string;
    journal?: string;
    topic?: string;
    year?: number | string;
    llm?: string;
    language?: string;
    type?: string;
    goal?: string;
    domain?: string;
    url?: string;
    repository?: string;
    custom?: { [key: string]: any; };
}
