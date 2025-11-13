export class AutoFormalisationValidator {
    private constructor() {}

    public static isNullOrUndefined(value: any): boolean {
        // This method returns true if the given value is null or undefined, false otherwise.
        return value === null || value === undefined;
    }

    public static allArgumentsExist(...obj: any[]): boolean {
        return !AutoFormalisationValidator.isNullOrUndefined(obj) && obj.every((value: any) => !AutoFormalisationValidator.isNullOrUndefined(value));
    }

    public static allValuesExist(obj: Iterable<any>): boolean {
        return !AutoFormalisationValidator.isNullOrUndefined(obj) && AutoFormalisationValidator.allArgumentsExist(...Array.from(obj));
    }

    public static validateExistence<T>(obj: T, errorMessage?: string): T {
        if (AutoFormalisationValidator.allArgumentsExist(obj)) {
            return obj;
        }
        else {
            throw new Error(errorMessage || "The object is null or undefined.");
        }
    }

    public static validateAllExistence<T>(obj: T[], errorMessage?: string): T[] {
        if (AutoFormalisationValidator.allValuesExist(obj)) {
            return obj;
        }
        else {
            throw new Error(errorMessage || "The object is null or undefined.");
        }
    }

    public static validateNumber(value: number, lowerBoundInclusive: number, upperBoundInclusive: number, errorMessage?: string): number {
        if (!AutoFormalisationValidator.allArgumentsExist(value, lowerBoundInclusive, upperBoundInclusive)) {
            throw new Error(errorMessage || "The value is null or undefined.");
        }
        else if (typeof value !== "number" || typeof lowerBoundInclusive !== "number" || typeof upperBoundInclusive !== "number") {
            throw new TypeError(errorMessage || "The value is not a number.");
        }
        else if (value < lowerBoundInclusive || value > upperBoundInclusive) {
            throw new Error(errorMessage || "The value is out of bounds.");
        }
        else {
            return value;
        }
    }
}
