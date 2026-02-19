import { InsuranceFormData } from './InsuranceTypes';
import { Briefcase, Building, Wallet, TrendingUp } from 'lucide-react';

interface StepProps {
    data: InsuranceFormData;
    updateData: (updates: Partial<InsuranceFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepEmployment({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-4 mb-6 border-b border-dimWhite/10 pb-4">
                {['Salaried', 'Self-Employed'].map((type) => (
                    <button
                        key={type}
                        onClick={() => updateData({ employmentType: type as any })}
                        className={`px-4 py-2 rounded-full font-medium transition ${data.employmentType === type
                            ? 'bg-secondary text-primary'
                            : 'bg-white/5 text-dimWhite hover:bg-white/10'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-green-400" />
                        <span>Annual Income (INR)</span>
                    </label>
                    <input
                        type="number"
                        value={data.annualIncome}
                        onChange={(e) => updateData({ annualIncome: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 1200000"
                    />
                </div>

                {data.employmentType === 'Salaried' ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Building className="w-4 h-4" />
                                <span>Company Name</span>
                            </label>
                            <input
                                type="text"
                                value={data.companyName}
                                onChange={(e) => updateData({ companyName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Briefcase className="w-4 h-4" />
                                <span>Designation</span>
                            </label>
                            <input
                                type="text"
                                value={data.designation}
                                onChange={(e) => updateData({ designation: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">Work Experience (Years)</label>
                            <input
                                type="number"
                                value={data.workExperience}
                                onChange={(e) => updateData({ workExperience: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Briefcase className="w-4 h-4" />
                                <span>Business Type</span>
                            </label>
                            <select
                                value={data.businessType}
                                onChange={(e) => updateData({ businessType: e.target.value })}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="">Select Type</option>
                                <option value="Retail">Retail</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Services">Services</option>
                                <option value="IT">IT/Consulting</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4" />
                                <span>Annual Turnover</span>
                            </label>
                            <input
                                type="number"
                                value={data.annualTurnover}
                                onChange={(e) => updateData({ annualTurnover: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
