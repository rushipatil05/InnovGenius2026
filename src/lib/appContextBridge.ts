/**
 * Global bridge to provide app context to Tambo tools.
 * Components update this state so the AI knows where the user is.
 */

interface AppContext {
    currentStep: number;
    stepName: string;
    requiredFields: string[];
    optionalFields: string[];
    notes?: string;
    view?: string; // e.g. 'home', 'account-opening'
}

let _context: AppContext = {
    currentStep: 0,
    stepName: 'Home',
    requiredFields: [],
    optionalFields: [],
    view: 'home',
};

export const appContextBridge = {
    update(ctx: Partial<AppContext>) {
        _context = { ..._context, ...ctx };
    },
    get() {
        return _context;
    },

    // Navigation support
    _navHandler: null as ((action: 'next' | 'back' | 'goto', step?: number) => void) | null,

    registerNavigation(handler: (action: 'next' | 'back' | 'goto', step?: number) => void) {
        this._navHandler = handler;
    },

    navigate(action: 'next' | 'back' | 'goto', step?: number) {
        if (this._navHandler) {
            this._navHandler(action, step);
            return true;
        }
        return false;
    }
};
