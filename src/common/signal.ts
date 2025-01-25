export class Signal {
    _callbacks = [];

    constructor() {
        this.dispatch = this.dispatch.bind(this);
    }

    // @ts-ignore
    add(callback) {
        // @ts-ignore
        this._callbacks.push(callback);
    }

    // @ts-ignore
    unsubscribe(callback) {
        // @ts-ignore
        const index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    // @ts-ignore
    dispatch(context, ...args) {
        for (const callback of this._callbacks) {
            // @ts-ignore
            callback.call(context, ...args);
        }
    }
}
