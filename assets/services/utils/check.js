/**
 * @throws {Error} Not a string
 */
export const checkString = (o) => {
    if (!o || typeof o !== "string") {
        throw new Error(`The type of ${o} is ${typeof o} which is not string.`);
    }
}

/**
 * @throws {Error} Not a number
 */
export const checkNumber = (o) => {
    if (o == null || typeof o !== "number") {
        throw new Error(`The type of ${o} is ${typeof o} which is not number.`);
    }
}

/**
 * @throws {Error} Not a function
 */
export const checkFunction = (o) => {
    if (!o || typeof o !== "function") {
        throw new Error(`The type of ${o} is ${typeof o} which is not function.`);
    }
}

/**
 * @throws {Error} Not a object
 */
export const checkObject = (o) => {
    if (!o || typeof o !== "object") {
        throw new Error(`The type of ${o} is ${typeof o} which is not object.`);
    }
}

/**
 * @throws {Error} Not a array
 */
export const checkArray = (o) => {
    if (!o || !Array.isArray(o)) {
        throw new Error(`The type of ${o} is ${typeof o} which is not array.`);
    }
}

/**
 * @throws {Error} Not a component
 */
export const checkComponent = (o) => {
    if (!o || typeof o !== "function" && typeof o !== "object") {
        throw new Error(`The type of ${o} is ${typeof o} which is not component.`);
    }
}

/**
 * @throws {Error} Not a position
 */
export const checkPosition = (o) => {
    if (o == null || typeof o !== "number" || o < 1) {
        throw new Error(`The type of ${o} is ${typeof o} which is not position or < 1.`);
    }
}
