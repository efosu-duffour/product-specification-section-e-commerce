export function createCustomMouseEvent(type: string, event: MouseEvent, options?: customEventOptions) {
    return new CustomEvent(type, {
        detail: {
            mouseEvent: event,
            ...options?.details
        },
        bubbles: options?.bubbles ?? event.bubbles,
        composed: options?.composed ?? event.composed,
        cancelable: options?.cancelable ?? event.cancelable
    })
}


export type customEventOptions = {
    composed?: boolean;
    bubbles?: boolean;
    cancelable?: boolean;
    details?: Record<string, any>;
}