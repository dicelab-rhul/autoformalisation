export interface AutoFormalisationPackable {
    pack(): void;

    unpack(): void;

    isPacked(): boolean;
}
