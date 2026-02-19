import { ApplicationData } from './CreditCardTypes';
import { DollarSign, ShieldAlert, CreditCard, TrendingUp } from 'lucide-react';

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

export default function StepFinancial({ data, updateData }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Monthly Income */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Monthly Income (In Hand)</span>
                    </label>
                    <input
                        type="number"
                        value={data.monthlyIncome}
                        onChange={(e) => updateData({ monthlyIncome: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 75000"
                    />
                </div>

                {/* Other Income Sources */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Other Annual Income</span>
                    </label>
                    <input
                        type="number"
                        value={data.otherIncome}
                        onChange={(e) => updateData({ otherIncome: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 50000"
                    />
                </div>

                {/* Existing EMIs */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Total Existing Monthly EMIs</span>
                    </label>
                    <input
                        type="number"
                        value={data.existingEmis}
                        onChange={(e) => updateData({ existingEmis: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 15000"
                    />
                </div>

                {/* Requested Limit */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-secondary" />
                        <span>Requested Credit Limit</span>
                    </label>
                    <input
                        type="number"
                        value={data.requestedLimit}
                        onChange={(e) => updateData({ requestedLimit: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 200000"
                    />
                </div>
            </div>

            {/* Existing Credit Cards Toggle */}
            <div className="pt-4 border-t border-dimWhite/10">
                <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-dimWhite/10 cursor-pointer hover:bg-white/10 transition"
                    onClick={() => updateData({ existingCreditCards: !data.existingCreditCards })}
                >
                    <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-secondary" />
                        <span className="text-white font-medium">Do you hold any other Credit Cards?</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${data.existingCreditCards ? 'border-secondary bg-secondary' : 'border-dimWhite'}`}>
                        {data.existingCreditCards && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
