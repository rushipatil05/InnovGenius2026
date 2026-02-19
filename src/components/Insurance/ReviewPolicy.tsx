import { InsuranceFormData } from './InsuranceTypes';
import { User, Shield, Briefcase, HeartPulse, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: InsuranceFormData;
    riskScore: number;
}

export default function ReviewPolicy({ data, riskScore }: StepProps) {
    const sections = [
        {
            title: 'Policy Details',
            icon: <Shield className="w-5 h-5 text-blue-400" />,
            items: [
                { label: 'Type', value: data.policyType },
                { label: 'Coverage', value: `₹${data.coverageAmount}` },
                { label: 'Tenure', value: data.policyTenure ? `${data.policyTenure} Years` : 'Annual' },
            ]
        },
        {
            title: 'Personal Info',
            icon: <User className="w-5 h-5 text-purple-400" />,
            items: [
                { label: 'Name', value: data.fullName },
                { label: 'Age', value: `${new Date().getFullYear() - new Date(data.dob).getFullYear()} Years` },
                { label: 'Contact', value: data.mobile },
            ]
        },
        {
            title: 'Health Profile',
            icon: <HeartPulse className="w-5 h-5 text-red-400" />,
            items: [
                { label: 'Smoker', value: data.isSmoker ? 'Yes' : 'No' },
                { label: 'BMI', value: (Number(data.weight) / ((Number(data.height) / 100) ** 2)).toFixed(1) },
                { label: 'Medical History', value: data.hasMedicalHistory ? 'Yes' : 'None' },
            ]
        },
        {
            title: 'Employment',
            icon: <Briefcase className="w-5 h-5 text-yellow-400" />,
            items: [
                { label: 'Type', value: data.employmentType },
                { label: 'Income', value: `₹${data.annualIncome}` },
            ]
        },
    ];

    const getRiskLabel = (score: number) => {
        if (score < 30) return { label: 'Low Risk', color: 'text-green-400', premium: 'Standard' };
        if (score < 60) return { label: 'Medium Risk', color: 'text-yellow-400', premium: '+15% Loading' };
        return { label: 'High Risk', color: 'text-red-400', premium: 'Medical Test Required' };
    };

    const risk = getRiskLabel(riskScore);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Review Your Application</h3>

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
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

                <h4 className="text-lg font-bold text-white mb-2 relative z-10">Aurora Risk Engine Assessment</h4>
                <div className="flex justify-center items-center gap-4 my-4 relative z-10">
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Risk Score</p>
                        <p className={`text-4xl font-bold ${risk.color}`}>{riskScore}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-dimWhite/20" />
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Category</p>
                        <p className={`text-xl font-bold ${risk.color}`}>{risk.label}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-dimWhite/20" />
                    <div className="text-center">
                        <p className="text-dimWhite text-xs uppercase tracking-wider">Premium Impact</p>
                        <p className="text-white font-bold">{risk.premium}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-dimWhite text-sm mt-4">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>AI Analysis Complete</span>
                </div>
            </div>

            <div className="text-xs text-dimWhite/50 text-center mt-4">
                By submitting, you agree to the Terms & Conditions and declare that all information provided is true.
            </div>
        </div>
    );
}
