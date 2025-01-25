export class Signal {
    _callbacks = [];

    constructor() {
        this.dispatch = this.dispatch.bind(this);
    }

    add(callback) {
        this._callbacks.push(callback);
    }

    unsubscribe(callback) {
        const index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    dispatch(context, ...args) {
        for (const callback of this._callbacks) {
            callback.call(context, ...args);
        }
    }
}
