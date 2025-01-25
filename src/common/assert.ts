export function assert(message = "", condition = true) {
    if (condition) {
        // biome-ignore lint/suspicious/noDebugger: <explanation>
        debugger;
        throw new Error(message);
    }
}
