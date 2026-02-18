/**
 * Global singleton bridge for form filling triggered by Tambo AI.
 * Handles race conditions by queuing fill requests until the form component registers.
 */

type FillData = {
    fullName?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
    parentsName?: string;
    nationality?: string;
};

type FillFn = (data: FillData) => void;

let _fillFn: FillFn | null = null;
let _queue: FillData[] = [];

export const formFillBridge = {
    register(fn: FillFn) {
        _fillFn = fn;
        // Process any queued fill requests
        while (_queue.length > 0) {
            const data = _queue.shift();
            if (data) fn(data);
        }
    },
    unregister() {
        _fillFn = null;
    },
    fill(data: FillData) {
        if (_fillFn) {
            _fillFn(data);
        } else {
            console.log('[formFillBridge] Queueing form update:', data);
            _queue.push(data);
        }
    },
    isReady() {
        return !!_fillFn;
    }
};
