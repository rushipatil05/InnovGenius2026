/**
 * Global singleton bridge for form filling triggered by Tambo AI.
 * Handles race conditions by queuing fill requests until the form component registers.
 */

type FillData = {
    // Personal Details
    fullName?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
    parentsName?: string;
    nationality?: string;

    // Contact Information
    mobileNumber?: string;
    email?: string;
    currentAddress?: string;
    permanentAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    permanentAddressSame?: boolean;

    // KYC Details (Step 3)
    panNumber?: string;
    aadhaarNumber?: string;
    passportNumber?: string;

    // Account Details (Step 4)
    accountType?: string;
    branchPreference?: string;
    modeOfOperation?: string; // 'self' | 'joint'
    initialDeposit?: string; // string or number, bridge usually handles basic types but string is safe

    // Joint Account Details
    jointHolderName?: string;
    jointHolderRelation?: string;
    jointHolderDob?: string;
    jointHolderMobile?: string;

    // Financial Details (Step 5)
    employment?: string;
    employerName?: string;
    annualIncome?: string;
    sourceOfFunds?: string;

    // Nominee Details (Step 6)
    nomineeName?: string;
    nomineeRelation?: string;
    nomineeDob?: string;
    nomineeAddress?: string;

    // Services (Step 7)
    debitCard?: boolean;
    netBanking?: boolean;
    mobileBanking?: boolean;
    chequeBook?: boolean;
    smsAlerts?: boolean;
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
