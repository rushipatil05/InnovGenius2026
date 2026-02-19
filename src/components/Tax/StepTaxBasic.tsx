import { TaxFormData } from './TaxTypes';
import { User, CreditCard, Fingerprint, Calendar, Globe, Building } from 'lucide-react';

interface StepProps {
    data: TaxFormData;
    updateData: (updates: Partial<TaxFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepTaxBasic({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">Tax Filer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Full Name</span>
                    </label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => updateData({ fullName: e.target.value })}
                        className={inputClass}
                        placeholder="As per PAN"
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
                        <CreditCard className="w-4 h-4 text-blue-400" />
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
                        <Fingerprint className="w-4 h-4 text-orange-400" />
                        <span>Aadhaar Number</span>
                    </label>
                    <input
                        type="text"
                        value={data.aadhaar}
                        onChange={(e) => updateData({ aadhaar: e.target.value })}
                        className={inputClass}
                        maxLength={12}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-green-400" />
                        <span>Residential Status</span>
                    </label>
                    <select
                        value={data.residentialStatus}
                        onChange={(e) => updateData({ residentialStatus: e.target.value as any })}
                        className={`${inputClass} appearance-none`}
                    >
                        <option value="Resident">Resident</option>
                        <option value="NRI">Non-Resident Indian (NRI)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Building className="w-4 h-4 text-yellow-400" />
                        <span>Refund Bank Account No.</span>
                    </label>
                    <input
                        type="text"
                        value={data.refundBankAccount}
                        onChange={(e) => updateData({ refundBankAccount: e.target.value })}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    );
}
