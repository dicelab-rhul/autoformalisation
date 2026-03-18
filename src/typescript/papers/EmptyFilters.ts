import { Filters } from "./Filters";

export class EmptyFilters implements Filters {
    public llm: string = "";
    public language: string = "";
    public type: string = "";
    public dataset: string = "";
    public domain: string = "";
    public search: string = "";
}
