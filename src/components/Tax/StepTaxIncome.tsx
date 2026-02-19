import { TaxFormData } from './TaxTypes';
import { Briefcase, TrendingUp, Home, PieChart, Wallet } from 'lucide-react';

interface StepProps {
    data: TaxFormData;
    updateData: (updates: Partial<TaxFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepTaxIncome({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">Income Sources (FY 2025-26)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span>Income from Salary</span>
                    </label>
                    <input
                        type="number"
                        value={data.salaryIncome}
                        onChange={(e) => updateData({ salaryIncome: e.target.value })}
                        className={inputClass}
                        placeholder="Gross Salary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-green-400" />
                        <span>Income from Business/Profession</span>
                    </label>
                    <input
                        type="number"
                        value={data.businessIncome}
                        onChange={(e) => updateData({ businessIncome: e.target.value })}
                        className={inputClass}
                        placeholder="Net Profit"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Home className="w-4 h-4 text-red-400" />
                        <span>Income from House Property</span>
                    </label>
                    <input
                        type="number"
                        value={data.rentalIncome}
                        onChange={(e) => updateData({ rentalIncome: e.target.value })}
                        className={inputClass}
                        placeholder="Rent Received"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span>Capital Gains</span>
                    </label>
                    <input
                        type="number"
                        value={data.capitalGains}
                        onChange={(e) => updateData({ capitalGains: e.target.value })}
                        className={inputClass}
                        placeholder="STCG + LTCG"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <PieChart className="w-4 h-4 text-yellow-400" />
                        <span>Income from Other Sources</span>
                    </label>
                    <input
                        type="number"
                        value={data.interestIncome}
                        onChange={(e) => updateData({ interestIncome: e.target.value })}
                        className={inputClass}
                        placeholder="Interest, Dividends, etc."
                    />
                </div>
            </div>
        </div>
    );
}
