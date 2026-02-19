export type PolicyType = 'Life' | 'Term' | 'Health' | 'FamilyFloater' | 'CriticalIllness' | null;
export type ResidenceType = 'Owned' | 'Rented' | 'CompanyProvided' | 'Parental';
export type EmploymentType = 'Salaried' | 'Self-Employed';
export type PaymentFrequency = 'Monthly' | 'Yearly';

export interface FamilyMember {
    name: string;
    age: string;
    relation: string;
    medicalHistory: string;
}

export interface Nominee {
    name: string;
    relation: string;
    dob: string;
    contact: string;
}

export interface InsuranceFormData {
    // 1. Policy Selection
    policyType: PolicyType;

    // 2. Personal Details
    fullName: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    maritalStatus: 'Single' | 'Married' | 'Other';
    mobile: string;
    email: string;
    occupation: string;
    pan: string;

    // 3. Address Details
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    residenceType: ResidenceType;
    yearsAtAddress: string;

    // 4. Health & Lifestyle
    height: string; // cm
    weight: string; // kg
    isSmoker: boolean;
    alcoholConsumption: 'None' | 'Occasional' | 'Regular';
    hasMedicalHistory: boolean;
    medicalHistoryDetails: string; // If hasMedicalHistory is true
    familyMedicalHistory: string;
    currentMedications: string;
    previousSurgeries: string;

    // 5. Employment & Financial
    employmentType: EmploymentType;
    annualIncome: string; // Also in user step 2, but logically fits here for underwriting
    companyName: string; // If salaried
    designation: string; // If salaried
    workExperience: string; // If salaried
    businessType: string; // If self-employed
    annualTurnover: string; // If self-employed

    // 6. Policy Specific
    coverageAmount: string;
    policyTenure: string; // For Life/Term
    roomRentPreference: 'Standard' | 'Semi-Private' | 'Private'; // For Health
    illnessCoverageType: string; // For Critical
    waitingPeriod: string; // For Critical
    medicalTestRequired: boolean; // Flag
    familyMembers: FamilyMember[]; // For Family Floater

    // 7. Nominee
    nominee: Nominee;

    // 8. Payment
    paymentFrequency: PaymentFrequency;
    paymentMethod: string;
    autoDebitConsent: boolean;

    // 9. KYC & Compliance
    isKYCVerified: boolean;
    kycMethod: 'DigiLocker' | 'Video' | null;
    healthDeclaration: boolean;
    pepDeclaration: boolean; // Politically Exposed Person
    taxResidencyDeclaration: boolean;
    termsAccepted: boolean;
}

export const initialInsuranceData: InsuranceFormData = {
    policyType: null,
    fullName: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    mobile: '',
    email: '',
    occupation: '',
    pan: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    residenceType: 'Owned',
    yearsAtAddress: '',
    height: '',
    weight: '',
    isSmoker: false,
    alcoholConsumption: 'None',
    hasMedicalHistory: false,
    medicalHistoryDetails: '',
    familyMedicalHistory: '',
    currentMedications: '',
    previousSurgeries: '',
    employmentType: 'Salaried',
    annualIncome: '',
    companyName: '',
    designation: '',
    workExperience: '',
    businessType: '',
    annualTurnover: '',
    coverageAmount: '',
    policyTenure: '',
    roomRentPreference: 'Standard',
    illnessCoverageType: '',
    waitingPeriod: '',
    medicalTestRequired: false,
    familyMembers: [],
    nominee: {
        name: '',
        relation: '',
        dob: '',
        contact: ''
    },
    paymentFrequency: 'Yearly',
    paymentMethod: 'UPI',
    autoDebitConsent: false,
    isKYCVerified: false,
    kycMethod: null,
    healthDeclaration: false,
    pepDeclaration: false,
    taxResidencyDeclaration: false,
    termsAccepted: false
};
