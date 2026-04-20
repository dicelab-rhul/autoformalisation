import { Filters } from "./Filters";

export class EmptyFilters implements Filters {
    public language: string = "";
    public type: string = "";
    public goal: string = "";
    public area: string = "";
    public repository: string = "";
    public search: string = "";
}
