import { InvestmentFormData } from './InvestmentTypes';
import { User, Calendar, Smartphone, Mail, MapPin, CreditCard, Home } from 'lucide-react';

interface StepProps {
    data: InvestmentFormData;
    updateData: (updates: Partial<InvestmentFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepInvestPersonal({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            {/* Personal Info */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dimWhite/10 pb-2">Investor KYC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Name as per PAN</span>
                        </label>
                        <input
                            type="text"
                            value={data.fullName}
                            onChange={(e) => updateData({ fullName: e.target.value })}
                            className={inputClass}
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <CreditCard className="w-4 h-4" />
                            <span>PAN Number</span>
                        </label>
                        <input
                            type="text"
                            value={data.pan}
                            onChange={(e) => updateData({ pan: e.target.value.toUpperCase() })}
                            className={inputClass}
                            maxLength={10}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Date of Birth</span>
                        </label>
                        <input
                            type="date"
                            value={data.dob}
                            onChange={(e) => updateData({ dob: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Smartphone className="w-4 h-4" />
                            <span>Mobile</span>
                        </label>
                        <input
                            type="tel"
                            value={data.contact}
                            onChange={(e) => updateData({ contact: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Correspondence Address</span>
                        </label>
                        <textarea
                            value={data.address}
                            onChange={(e) => updateData({ address: e.target.value })}
                            className={`${inputClass} min-h-[80px]`}
                        />
                    </div>
                </div>
            </div>

            {/* Financials (Quick access) */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dimWhite/10 pb-2">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Annual Income</label>
                        <input
                            type="number"
                            value={data.annualIncome}
                            onChange={(e) => updateData({ annualIncome: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Target Monthly Savings</label>
                        <input
                            type="number"
                            value={data.monthlySavings}
                            onChange={(e) => updateData({ monthlySavings: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
