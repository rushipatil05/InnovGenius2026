interface ProfileData {
  monthlyTxn: number;
  employment: string;
  isPanValid: boolean;
  isAadhaarValid: boolean;
}

interface RiskResult {
  score: number;
  category: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
}

export function calculateRisk(profileData: ProfileData): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  if (profileData.monthlyTxn > 200000) {
    score += 30;
    reasons.push('Monthly transactions exceed ₹2L (+30 points)');
  }

  if (profileData.employment === 'Self-Employed') {
    score += 15;
    reasons.push('Self-employed status (+15 points)');
  }

  if (!profileData.isPanValid) {
    score += 25;
    reasons.push('Invalid PAN number (+25 points)');
  }

  if (!profileData.isAadhaarValid) {
    score += 20;
    reasons.push('Invalid Aadhaar number (+20 points)');
  }

  let category: 'LOW' | 'MEDIUM' | 'HIGH';
  if (score < 30) {
    category = 'LOW';
  } else if (score >= 30 && score <= 60) {
    category = 'MEDIUM';
  } else {
    category = 'HIGH';
  }

  if (reasons.length === 0) {
    reasons.push('All checks passed - low risk profile');
  }

  return {
    score,
    category,
    reasons,
  };
}
