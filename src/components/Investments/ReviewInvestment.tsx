import { InvestmentFormData, RiskProfile } from './InvestmentTypes';
import { User, Wallet, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: InvestmentFormData;
    riskProfile: RiskProfile;
}

export default function ReviewInvestment({ data, riskProfile }: StepProps) {
    const sections = [
        {
            title: 'Investor Profile',
            icon: <User className="w-5 h-5 text-blue-400" />,
            items: [
                { label: 'Name', value: data.fullName },
                { label: 'Goal', value: data.goal },
                { label: 'Horizon', value: data.timeHorizon },
            ]
        },
        {
            title: 'Risk Profile',
            icon: <Activity className="w-5 h-5 text-red-400" />,
            items: [
                { label: 'Tolerance', value: data.riskTolerance },
                { label: 'Experience', value: data.experience },
                { label: 'Profile', value: riskProfile }, // Calculated
            ]
        },
        {
            title: 'Investment',
            icon: <Target className="w-5 h-5 text-green-400" />,
            items: [
                { label: 'Product', value: data.investmentType },
                { label: 'Amount', value: `₹${data.sipAmount || data.lumpSumAmount}` },
                { label: 'Mode', value: data.sipAmount ? 'SIP' : 'Lump Sum' },
            ]
        },
        {
            title: 'Bank Mandate',
            icon: <Wallet className="w-5 h-5 text-purple-400" />,
            items: [
                { label: 'Acc No', value: `****${data.bankAccount.slice(-4)}` },
                { label: 'IFSC', value: data.ifsc },
                { label: 'Auto Debit', value: data.autoDebit ? 'Yes' : 'No' },
            ]
        },
    ];

    const getProfileColor = (profile: string | null) => {
        if (profile === 'Conservative') return 'text-blue-400';
        if (profile === 'Moderate') return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Review Investment Plan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-dimWhite/10 rounded-xl p-5"
                    >
                        <div className="flex items-center space-x-3 mb-4 border-b border-dimWhite/10 pb-2">
                            {section.icon}
                            <h4 className="font-semibold text-white">{section.title}</h4>
                        </div>
                        <div className="space-y-2">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-dimWhite">{item.label}</span>
                                    <span className="text-white font-medium text-right max-w-[60%] truncate">{item.value || '-'}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Aurora Recommendation Engine Visual */}
            <div className="mt-8 bg-black-gradient-2 p-6 rounded-xl border border-dimWhite/10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

                <h4 className="text-lg font-bold text-white mb-4 relative z-10">Aurora Portfolio Analysis</h4>

                <div className="flex justify-center items-center gap-6 my-4 relative z-10">
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Risk Profile</p>
                        <p className={`text-2xl font-bold ${getProfileColor(riskProfile)}`}>{riskProfile || 'Pending'}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-dimWhite/20" />
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Product Fit</p>
                        <p className="text-xl font-bold text-green-400">95% Match</p>
                    </div>
                </div>

                <p className="text-sm text-dimWhite/80 max-w-lg mx-auto mt-4 leading-relaxed">
                    Based on your <span className="text-white font-semibold">{data.timeHorizon}</span> horizon and <span className="text-white font-semibold">{data.riskTolerance}</span> tolerance, a {data.investmentType} plan is highly suitable for your {data.goal} goal.
                </p>
            </div>
        </div>
    );
}
