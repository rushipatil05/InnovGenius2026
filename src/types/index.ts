export type UserRole = 'user' | 'officer' | 'auditor';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt: string;
  language?: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;

  // 1. Personal Details
  dob: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  parentsName: string;
  nationality: string;

  // 2. Contact Information
  mobileNumber: string;
  email: string; // redundant with userEmail but good for form state
  currentAddress: string;
  permanentAddress: string;
  city: string;
  state: string;
  pincode: string;

  // 3. Identity & KYC
  panNumber: string;
  isPanValid: boolean;
  aadhaarNumber: string;
  isAadhaarValid: boolean;
  passportNumber?: string;
  drivingLicense?: string;
  voterId?: string;

  // 4. Account Details
  accountType: 'savings' | 'current' | 'salary';
  branchPreference: string;
  modeOfOperation: 'self' | 'joint';
  initialDeposit: number;

  // 5. Employment & Financial
  employment: string;
  employerName?: string;
  annualIncome: string;
  sourceOfFunds: string;
  monthlyTxn: number; // kept for compatibility

  // 6. Nominee Details (Optional)
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeDob?: string;
  nomineeAddress?: string;

  // 7. Services
  services: {
    debitCard: boolean;
    netBanking: boolean;
    mobileBanking: boolean;
    chequeBook: boolean;
    smsAlerts: boolean;
  };

  status: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  riskReasons: string[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
  applicationId?: string;
}
