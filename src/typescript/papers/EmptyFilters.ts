import { Filters } from "./Filters";

export class EmptyFilters implements Filters {
    public llm: string = "";
    public language: string = "";
    public type: string = "";
    public goal: string = "";
    public domain: string = "";
    public repository: string = "";
    public search: string = "";
}
