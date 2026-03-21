import { AutoFormalisationHideable } from "./AutoFormalisationHideable";
import { AutoFormalisationPackable } from "./AutoformalisationPackable";

export interface AutoFormalisationDiv extends AutoFormalisationPackable, AutoFormalisationHideable {
    getDiv(): HTMLDivElement;
}
