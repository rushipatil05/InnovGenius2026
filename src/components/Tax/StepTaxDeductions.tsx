import { TaxFormData } from './TaxTypes';
import { PiggyBank, Heart, Home, Gift, FileText, Banknote } from 'lucide-react';

interface StepProps {
    data: TaxFormData;
    updateData: (updates: Partial<TaxFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepTaxDeductions({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            {/* Deductions */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 border-b border-dimWhite/10 pb-2">Deductions (Chapter VI-A)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <PiggyBank className="w-4 h-4 text-pink-400" />
                            <span>80C (PPF, LIC, ELSS, etc.)</span>
                        </label>
                        <input
                            type="number"
                            value={data.section80C}
                            onChange={(e) => updateData({ section80C: e.target.value })}
                            className={inputClass}
                            placeholder="Max 1,50,000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span>80D (Health Insurance)</span>
                        </label>
                        <input
                            type="number"
                            value={data.section80D}
                            onChange={(e) => updateData({ section80D: e.target.value })}
                            className={inputClass}
                            placeholder="Max 25000 / 50000 (Seniors)"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Home className="w-4 h-4 text-blue-400" />
                            <span>interest on Home Loan (Sec 24)</span>
                        </label>
                        <input
                            type="number"
                            value={data.homeLoanInterest}
                            onChange={(e) => updateData({ homeLoanInterest: e.target.value })}
                            className={inputClass}
                            placeholder="Max 2,00,000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Gift className="w-4 h-4 text-yellow-400" />
                            <span>80G (Donations)</span>
                        </label>
                        <input
                            type="number"
                            value={data.donations80G}
                            onChange={(e) => updateData({ donations80G: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* Taxes Paid */}
            <div className="pt-4">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-dimWhite/10 pb-2">Taxes Already Paid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>TDS deducted by Employer/Bank</span>
                        </label>
                        <input
                            type="number"
                            value={data.tdsPaid}
                            onChange={(e) => updateData({ tdsPaid: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Banknote className="w-4 h-4 text-green-400" />
                            <span>Advance Tax Paid</span>
                        </label>
                        <input
                            type="number"
                            value={data.advanceTaxPaid}
                            onChange={(e) => updateData({ advanceTaxPaid: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
