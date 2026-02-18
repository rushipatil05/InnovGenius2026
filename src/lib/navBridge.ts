/**
 * Global singleton bridge for navigation triggered by Tambo AI.
 * Handles race conditions by queuing requests until a listener registers.
 */

type NavFn = (service: string) => void;

let _navFn: NavFn | null = null;
let _queue: string[] = [];

export const navBridge = {
    register(fn: NavFn) {
        _navFn = fn;
        // Process any queued navigation requests immediately
        while (_queue.length > 0) {
            const service = _queue.shift();
            if (service) fn(service);
        }
    },
    unregister() {
        _navFn = null;
    },
    navigate(service: string) {
        if (_navFn) {
            _navFn(service);
        } else {
            console.log('[navBridge] Queueing navigation to:', service);
            _queue.push(service);
        }
    },
    // Helper to check status
    isReady() {
        return !!_navFn;
    }
};
