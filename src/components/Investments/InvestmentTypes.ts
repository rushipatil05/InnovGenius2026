export type InvestmentType = 'MutualFunds' | 'FD' | 'Stocks' | 'Bonds' | null;
export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive' | null;

export interface InvestmentFormData {
    // 1. Basic KYC
    fullName: string;
    pan: string;
    dob: string;
    contact: string;
    email: string;
    address: string;

    // 2. Risk Profiling
    goal: string; // e.g. Retirement, Wealth Creation
    timeHorizon: string; // Years
    riskTolerance: string; // Low, Medium, High
    experience: string; // Beginner, Intermediate, Expert
    incomeStability: string; // Stable, Fluctuating

    // Calculated Risk Profile
    riskProfile: RiskProfile;

    // 3. Financial Details
    annualIncome: string;
    netWorth: string;
    liabilities: string; // Loans etc
    monthlySavings: string;

    // 4. Bank & Mandate
    bankAccount: string;
    ifsc: string;
    autoDebit: boolean;

    // 5. Investment Preferences
    investmentType: InvestmentType;
    sipAmount: string; // Mutual Funds
    lumpSumAmount: string; // Mutual Funds / Stocks
    fdTenure: string; // FD
    fdPayout: string; // FD (Monthly/Quarterly/Maturity)
    dematAccount: boolean; // Stocks
}

export const initialInvestmentData: InvestmentFormData = {
    fullName: '',
    pan: '',
    dob: '',
    contact: '',
    email: '',
    address: '',
    goal: 'Wealth Creation',
    timeHorizon: '5',
    riskTolerance: 'Medium',
    experience: 'Beginner',
    incomeStability: 'Stable',
    riskProfile: null,
    annualIncome: '',
    netWorth: '',
    liabilities: '',
    monthlySavings: '',
    bankAccount: '',
    ifsc: '',
    autoDebit: false,
    investmentType: null,
    sipAmount: '',
    lumpSumAmount: '',
    fdTenure: '',
    fdPayout: 'Maturity',
    dematAccount: false,
};
