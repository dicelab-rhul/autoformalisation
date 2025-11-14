export class AutoFormalisationValidator {
    private constructor() {} // prevent instantiation

    /** Returns true if value is null or undefined */
    public static isNil(value: unknown): value is null | undefined {
        return value == null;
    }

    /** Ensures a value exists (not null or undefined) */
    public static ensureExists<T>(value: T | null | undefined, message = "Value is null or undefined"): T {
        if (this.isNil(value)) {
            throw new TypeError(message);
        }
        else {
            return value;
        }
    }

    /** Ensures that all given arguments exist */
    public static ensureAllExist(values: Iterable<unknown>, message = "One or more values are null or undefined"): void {
        for (const v of values) {
            if (this.isNil(v)) {
                throw new TypeError(message);
            }
            else {
                continue;
            }
        }
    }

    /** Ensures a number exists, is a number, and is within the given range (inclusive). */
    public static ensureNumberInRange(value: unknown, min: number, max: number, message = "Number is out of bounds"): number {
        if (this.isNil(value)) {
            throw new TypeError("Value is null or undefined");
        }
        else if (typeof value !== "number") {
            throw new TypeError("Value is not a number");
        }
        else if (value < min || value > max) {
            throw new RangeError(message);
        }
        else {
            return value;
        }
    }
}
