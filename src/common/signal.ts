type CallbackFunction<T extends any> = (...args: T[]) => void;

interface CallbackEntry<T extends any[]> {
    callback: CallbackFunction<T>;
    context: any;
}

export class Signal<T extends any> {
    private _callbacks: CallbackEntry<T>[] = [];

    constructor() {
        this.dispatch = this.dispatch.bind(this);
    }

    add(callback: CallbackFunction<T>, context: any): void {
        this._callbacks.push({ callback, context });
    }

    unsubscribe(callback: CallbackFunction<T>): void {
        const index = this._callbacks.findIndex(entry => entry.callback === callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    dispatch(...args: T[]): void {
        for (const entry of this._callbacks) {
            entry.callback.call(entry.context, ...args);
        }
    }
}
