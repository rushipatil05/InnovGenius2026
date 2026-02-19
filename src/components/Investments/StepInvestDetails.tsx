import { InvestmentFormData, InvestmentType } from './InvestmentTypes';
import { TrendingUp, Lock, BarChart2, DollarSign, Calendar, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: InvestmentFormData;
    updateData: (updates: Partial<InvestmentFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepInvestDetails({ data, updateData }: StepProps) {

    const renderProductDetails = () => {
        switch (data.investmentType) {
            case 'MutualFunds':
                return (
                    <div className="space-y-4 animate-fade-in-down mt-6 p-4 rounded-xl bg-white/5 border border-dimWhite/10">
                        <h4 className="font-semibold text-secondary flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Configure Mutual Fund
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">SIP Amount (Monthly)</label>
                                <input
                                    type="number"
                                    value={data.sipAmount}
                                    onChange={(e) => updateData({ sipAmount: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 5000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Lump Sum Amount (One-time)</label>
                                <input
                                    type="number"
                                    value={data.lumpSumAmount}
                                    onChange={(e) => updateData({ lumpSumAmount: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 50000"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'FD':
                return (
                    <div className="space-y-4 animate-fade-in-down mt-6 p-4 rounded-xl bg-white/5 border border-dimWhite/10">
                        <h4 className="font-semibold text-secondary flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Fixed Deposit Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Investment Amount</label>
                                <input
                                    type="number"
                                    value={data.lumpSumAmount}
                                    onChange={(e) => updateData({ lumpSumAmount: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 100000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Tenure (Months)</label>
                                <input
                                    type="number"
                                    value={data.fdTenure}
                                    onChange={(e) => updateData({ fdTenure: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 12"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-dimWhite font-medium text-sm">Payout Frequency</label>
                                <select
                                    value={data.fdPayout}
                                    onChange={(e) => updateData({ fdPayout: e.target.value })}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="Maturity">On Maturity (Compounding)</option>
                                    <option value="Monthly">Monthly Interest</option>
                                    <option value="Quarterly">Quarterly Interest</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Stocks':
                return (
                    <div className="space-y-4 animate-fade-in-down mt-6 p-4 rounded-xl bg-white/5 border border-dimWhite/10">
                        <h4 className="font-semibold text-secondary flex items-center gap-2">
                            <BarChart2 className="w-5 h-5" />
                            Stock Market Investment
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Initial Investment Amount</label>
                                <input
                                    type="number"
                                    value={data.lumpSumAmount}
                                    onChange={(e) => updateData({ lumpSumAmount: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 25000"
                                />
                            </div>
                            <div className="flex items-center justify-between border-t border-dimWhite/10 pt-4">
                                <label className="text-white font-medium">Do you have an existing Demat Account?</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateData({ dematAccount: true })}
                                        className={`px-4 py-1 rounded-md text-sm border transition ${data.dematAccount ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'border-dimWhite/20 text-dimWhite'}`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => updateData({ dematAccount: false })}
                                        className={`px-4 py-1 rounded-md text-sm border transition ${!data.dematAccount ? 'bg-secondary text-primary border-primary' : 'border-dimWhite/20 text-dimWhite'}`}
                                    >
                                        No, Open New
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">Choose Investment Product</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'MutualFunds', title: 'Mutual Funds', icon: <TrendingUp className="w-6 h-6 text-blue-400" />, desc: 'Expert managed portfolios.' },
                    { id: 'FD', title: 'Fixed Deposit', icon: <Lock className="w-6 h-6 text-green-400" />, desc: 'Guaranteed returns.' },
                    { id: 'Stocks', title: 'Stocks', icon: <BarChart2 className="w-6 h-6 text-red-400" />, desc: 'Direct equity exposure.' },
                ].map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateData({ investmentType: option.id as InvestmentType })}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3
                            ${data.investmentType === option.id
                                ? 'border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(51,187,207,0.3)]'
                                : 'border-dimWhite/10 bg-white/5 hover:bg-white/10'
                            }
                        `}
                    >
                        <div className="p-3 bg-white/10 rounded-full">{option.icon}</div>
                        <div>
                            <h4 className="font-bold text-white">{option.title}</h4>
                            <p className="text-xs text-dimWhite mt-1">{option.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {renderProductDetails()}

            {/* Bank & Mandate Section - Common for all */}
            {data.investmentType && (
                <div className="pt-8 border-t border-dimWhite/10 space-y-4 animate-fade-in-up">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-yellow-400" />
                        Bank Details for Auto-Debit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">Account Number</label>
                            <input
                                type="text"
                                value={data.bankAccount}
                                onChange={(e) => updateData({ bankAccount: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">IFSC Code</label>
                            <input
                                type="text"
                                value={data.ifsc}
                                onChange={(e) => updateData({ ifsc: e.target.value.toUpperCase() })}
                                className={inputClass}
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-dimWhite/10">
                            <input
                                type="checkbox"
                                checked={data.autoDebit}
                                onChange={(e) => updateData({ autoDebit: e.target.checked })}
                                className="w-5 h-5 accent-secondary"
                            />
                            <span className="text-sm text-dimWhite">
                                I authorize Aurora Financial to set up an auto-debit mandate for my SIPs/Investments.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
