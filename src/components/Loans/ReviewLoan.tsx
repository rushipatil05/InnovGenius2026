import { LoanFormData } from './LoanTypes';
import { User, Briefcase, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: LoanFormData;
    riskScore: { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' };
}

export default function ReviewLoan({ data, riskScore }: StepProps) {
    const sections = [
        {
            title: 'Loan Details',
            icon: <FileText className="w-5 h-5 text-blue-400" />,
            items: [
                { label: 'Type', value: data.loanType },
                { label: 'Amount', value: `₹${data.loanAmount}` },
                { label: 'Tenure', value: `${data.loanTenure} Months` },
            ]
        },
        {
            title: 'Personal Info',
            icon: <User className="w-5 h-5 text-purple-400" />,
            items: [
                { label: 'Name', value: data.fullName },
                { label: 'Mobile', value: data.mobile },
                { label: 'PAN', value: data.pan },
            ]
        },
        {
            title: 'Employment',
            icon: <Briefcase className="w-5 h-5 text-yellow-400" />,
            items: [
                { label: 'Type', value: data.employmentType },
                { label: 'Income', value: `₹${data.monthlyIncome}/mo` },
                { label: 'Score', value: data.creditScore },
            ]
        },
    ];

    const getRiskColor = (level: string) => {
        if (level === 'LOW') return 'text-green-400';
        if (level === 'MEDIUM') return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Review Loan Application</h3>

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

            {/* Aurora Engine Risk Assessment */}
            <div className="mt-8 bg-black-gradient-2 p-6 rounded-xl border border-dimWhite/10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

                <h4 className="text-lg font-bold text-white mb-2 relative z-10">Creditworthiness Assessment</h4>

                <div className="flex justify-center items-center gap-6 my-4 relative z-10">
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Probability of Approval</p>
                        <p className={`text-4xl font-bold ${getRiskColor(riskScore.level)}`}>{riskScore.score}%</p>
                    </div>
                    <div className="h-10 w-[1px] bg-dimWhite/20" />
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Risk Level</p>
                        <p className={`text-xl font-bold ${getRiskColor(riskScore.level)}`}>{riskScore.level}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-dimWhite text-sm mt-4">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span>Analysed by Aurora AI</span>
                </div>
            </div>
            <div className="text-xs text-dimWhite/50 text-center mt-4">
                This is a preliminary assessment. Final approval subject to verification.
            </div>
        </div>
    );
}
