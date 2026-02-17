export type UserRole = 'user' | 'officer' | 'auditor';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  monthlyTxn: number;
  employment: string;
  panNumber: string;
  isPanValid: boolean;
  aadhaarNumber: string;
  isAadhaarValid: boolean;
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
