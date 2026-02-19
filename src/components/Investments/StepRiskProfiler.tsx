import { InvestmentFormData } from './InvestmentTypes';
import { Target, Clock, TrendingUp, ShieldCheck, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: InvestmentFormData;
    updateData: (updates: Partial<InvestmentFormData>) => void;
}

const optionClass = (selected: boolean) =>
    `p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-start space-y-2
    ${selected ? 'bg-secondary text-primary border-secondary ring-2 ring-offset-2 ring-offset-black' : 'border-dimWhite/10 bg-white/5 hover:bg-white/10 text-dimWhite'}
    `;

export default function StepRiskProfiler({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-2">Build Your Investor Profile</h3>
            <p className="text-sm text-dimWhite mb-6">Answer these questions to help Aurora AI tailor the perfect portfolio for you.</p>

            {/* Goal */}
            <div className="space-y-4">
                <label className="text-white font-medium flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    1. What is your primary investment goal?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Wealth Creation', 'Retirement', 'Save for House/Car', 'Emergency Fund'].map((opt) => (
                        <div
                            key={opt}
                            onClick={() => updateData({ goal: opt })}
                            className={optionClass(data.goal === opt)}
                        >
                            <span className="font-semibold">{opt}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Horizon */}
            <div className="space-y-4 pt-6 border-t border-dimWhite/10">
                <label className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    2. How long do you plan to invest?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['< 1 Year', '1-3 Years', '3-5 Years', '5+ Years'].map((opt) => (
                        <div
                            key={opt}
                            onClick={() => updateData({ timeHorizon: opt })}
                            className={optionClass(data.timeHorizon === opt)}
                        >
                            <span className="font-semibold">{opt}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk Tolerance */}
            <div className="space-y-4 pt-6 border-t border-dimWhite/10">
                <label className="text-white font-medium flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    3. How do you react to market drops?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        onClick={() => updateData({ riskTolerance: 'Low' })}
                        className={optionClass(data.riskTolerance === 'Low')}
                    >
                        <span className="font-semibold">Panic & Sell</span>
                        <span className="text-xs opacity-70">Focus on safety</span>
                    </div>
                    <div
                        onClick={() => updateData({ riskTolerance: 'Medium' })}
                        className={optionClass(data.riskTolerance === 'Medium')}
                    >
                        <span className="font-semibold">Wait it out</span>
                        <span className="text-xs opacity-70">Balance growth & safety</span>
                    </div>
                    <div
                        onClick={() => updateData({ riskTolerance: 'High' })}
                        className={optionClass(data.riskTolerance === 'High')}
                    >
                        <span className="font-semibold">Buy more</span>
                        <span className="text-xs opacity-70">Seeking maximum returns</span>
                    </div>
                </div>
            </div>

            {/* Experience */}
            <div className="space-y-4 pt-6 md:col-span-2 border-t border-dimWhite/10">
                <label className="text-white font-medium flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-yellow-400" />
                    4. Investment Experience
                </label>
                <div className="flex gap-4">
                    {['Beginner', 'Intermediate', 'Expert'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => updateData({ experience: opt })}
                            className={`px-6 py-2 rounded-full border transition ${data.experience === opt ? 'bg-secondary text-primary border-secondary font-bold' : 'border-dimWhite/20 text-dimWhite hover:bg-white/5'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Income Stability */}
            <div className="space-y-4 pt-6 md:col-span-2 border-t border-dimWhite/10">
                <label className="text-white font-medium flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    5. Income Stability
                </label>
                <div className="flex gap-4">
                    {['Stable', 'Fluctuating'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => updateData({ incomeStability: opt })}
                            className={`px-6 py-2 rounded-full border transition ${data.incomeStability === opt ? 'bg-secondary text-primary border-secondary font-bold' : 'border-dimWhite/20 text-dimWhite hover:bg-white/5'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
