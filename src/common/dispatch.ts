export function dispatch(event = "", data = null) {
    window.dispatchEvent(
        new CustomEvent(event, {
            detail: data,
            bubbles: true,
            cancelable: true
        })
    );
}
