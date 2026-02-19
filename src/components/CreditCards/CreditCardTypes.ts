export type CardType = 'Entry' | 'Rewards' | 'Premium' | 'Business';
export type EmploymentType = 'Salaried' | 'Self-Employed' | 'Student';
export type MaritalStatus = 'Single' | 'Married' | 'Other';

export interface ApplicationData {
    cardType: CardType | null;

    // Personal
    fullName: string;
    dob: string;
    pan: string;
    mobile: string;
    email: string;
    maritalStatus: string; // Use string or specific type if preferred, but existing code uses string in interface

    // Address
    currentAddress: string;
    residenceType: string;
    yearsAtAddress: string;
    isPermanentSame: boolean;
    permanentAddress: string;

    // Employment
    employmentType: EmploymentType;
    companyName: string;
    designation: string;
    workExperience: string;
    businessName: string;
    industry: string;
    annualTurnover: string;
    businessVintage: string;
    collegeName: string;
    graduationYear: string;

    // Financial
    monthlyIncome: string;
    existingEmis: string;
    existingCreditCards: boolean;
    requestedLimit: string;
    otherIncome: string;

    // KYC
    isKYCVerified: boolean;
    kycMethod: 'DigiLocker' | 'Video' | null;

    // Preferences
    billingCycle: string;
    addOnCard: boolean;
    deliveryAddress: string;
    spendingPreferences: string[];
}
