export function getRandomIndex<T>(arr: T[]) {
    return Math.floor(Math.random() * arr.length);
}

export function getRandomArrayElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomNumberFromTo(min = 0, max = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomInt(min = 0, max = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBool() {
    return getRandomInt(1, 100) > 50 ? true : false;
}
