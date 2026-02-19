export type LoanType = 'Personal' | 'Home' | 'Vehicle' | 'Business' | 'Education' | null;
export type EmploymentType = 'Salaried' | 'Self-Employed' | 'Student';
export type ResidenceType = 'Owned' | 'Rented' | 'CompanyProvided' | 'Parental';

export interface LoanFormData {
    // 1. Loan Selection
    loanType: LoanType;

    // 2. Personal Details
    fullName: string;
    dob: string;
    pan: string;
    mobile: string;
    email: string;
    maritalStatus: 'Single' | 'Married' | 'Other';
    dependents: string;

    // 3. Address Details
    currentAddress: string;
    residenceType: ResidenceType;
    yearsAtAddress: string;

    // 4. Employment & Financial
    employmentType: EmploymentType;
    employerName: string; // If salaried
    designation: string; // If salaried
    workExperience: string; // If salaried
    monthlyIncome: string; // If salaried
    businessName: string; // If self-employed
    industry: string; // If self-employed
    annualTurnover: string; // If self-employed
    businessVintage: string; // If self-employed

    // 5. Financials
    existingEmis: string;
    creditScore: string; // Mock input or calculated

    // 6. Loan Specifics
    loanAmount: string;
    loanTenure: string; // Months
    loanPurpose: string;
    propertyValue: string; // Home
    downPayment: string; // Home
    propertyAddress: string; // Home
    vehicleModel: string; // Vehicle
    vehiclePrice: string; // Vehicle
    dealerName: string; // Vehicle
    gstin: string; // Business
    collegeName: string; // Education
    courseName: string; // Education
}

export const initialLoanData: LoanFormData = {
    loanType: null,
    fullName: '',
    dob: '',
    pan: '',
    mobile: '',
    email: '',
    maritalStatus: 'Single',
    dependents: '0',
    currentAddress: '',
    residenceType: 'Rented',
    yearsAtAddress: '',
    employmentType: 'Salaried',
    employerName: '',
    designation: '',
    workExperience: '',
    monthlyIncome: '',
    businessName: '',
    industry: '',
    annualTurnover: '',
    businessVintage: '',
    existingEmis: '',
    creditScore: '',
    loanAmount: '',
    loanTenure: '',
    loanPurpose: '',
    propertyValue: '',
    downPayment: '',
    propertyAddress: '',
    vehicleModel: '',
    vehiclePrice: '',
    dealerName: '',
    gstin: '',
    collegeName: '',
    courseName: '',
};
