import { LoanFormData } from './LoanTypes';
import { Briefcase, Building, Wallet, TrendingUp, CreditCard, Activity } from 'lucide-react';

interface StepProps {
    data: LoanFormData;
    updateData: (updates: Partial<LoanFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepLoanEmployment({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-4 mb-6 border-b border-dimWhite/10 pb-4">
                {['Salaried', 'Self-Employed', 'Student'].map((type) => (
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
                        <span>Monthly Income (INR)</span>
                    </label>
                    <input
                        type="number"
                        value={data.monthlyIncome}
                        onChange={(e) => updateData({ monthlyIncome: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 50000"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-red-400" />
                        <span>Existing Monthly EMIs</span>
                    </label>
                    <input
                        type="number"
                        value={data.existingEmis}
                        onChange={(e) => updateData({ existingEmis: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 15000"
                    />
                </div>


                {data.employmentType === 'Salaried' ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Building className="w-4 h-4" />
                                <span>Employer Name</span>
                            </label>
                            <input
                                type="text"
                                value={data.employerName}
                                onChange={(e) => updateData({ employerName: e.target.value })}
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
                            <label className="text-dimWhite font-medium text-sm">Experience (Years)</label>
                            <input
                                type="number"
                                value={data.workExperience}
                                onChange={(e) => updateData({ workExperience: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </>
                ) : data.employmentType === 'Self-Employed' ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">Business Name</label>
                            <input
                                type="text"
                                value={data.businessName}
                                onChange={(e) => updateData({ businessName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">Industry</label>
                            <input
                                type="text"
                                value={data.industry}
                                onChange={(e) => updateData({ industry: e.target.value })}
                                className={inputClass}
                            />
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
                ) : null}

                <div className="space-y-2 pt-4 md:col-span-2 border-t border-dimWhite/10">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <span>Credit Score (Self-Declared)</span>
                    </label>
                    <input
                        type="number"
                        value={data.creditScore}
                        onChange={(e) => updateData({ creditScore: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 750"
                        max="900"
                    />
                    <p className="text-xs text-dimWhite ml-1">We will fetch the official score during processing.</p>
                </div>
            </div>
        </div>
    );
}
