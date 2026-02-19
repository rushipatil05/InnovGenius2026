export interface TaxFormData {
    // 1. Basic Details
    fullName: string;
    pan: string;
    aadhaar: string;
    dob: string;
    residentialStatus: 'Resident' | 'NRI';
    refundBankAccount: string;

    // 2. Income Sources
    salaryIncome: string;
    businessIncome: string;
    interestIncome: string;
    capitalGains: string;
    rentalIncome: string;

    // 3. Deductions
    section80C: string; // Max 1.5L
    section80D: string; // Health Insurance
    homeLoanInterest: string; // Max 2L
    donations80G: string;

    // 4. Tax Credits
    tdsPaid: string;
    advanceTaxPaid: string;
}

export const initialTaxData: TaxFormData = {
    fullName: '',
    pan: '',
    aadhaar: '',
    dob: '',
    residentialStatus: 'Resident',
    refundBankAccount: '',
    salaryIncome: '',
    businessIncome: '',
    interestIncome: '',
    capitalGains: '',
    rentalIncome: '',
    section80C: '',
    section80D: '',
    homeLoanInterest: '',
    donations80G: '',
    tdsPaid: '',
    advanceTaxPaid: '',
};
