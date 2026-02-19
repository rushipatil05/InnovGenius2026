import { InsuranceFormData, PolicyType } from './InsuranceTypes';
import { ShieldCheck, HeartPulse, Stethoscope, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: InsuranceFormData;
    updateData: (updates: Partial<InsuranceFormData>) => void;
}

const policyOptions = [
    {
        id: 'Life',
        title: 'Life Insurance',
        description: 'Comprehensive coverage for your family\'s future.',
        icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
        color: 'border-blue-500/50 bg-blue-500/10'
    },
    {
        id: 'Term',
        title: 'Term Insurance',
        description: 'Affordable protection for a fixed term.',
        icon: <Activity className="w-8 h-8 text-green-400" />,
        color: 'border-green-500/50 bg-green-500/10'
    },
    {
        id: 'Health',
        title: 'Health Insurance',
        description: 'Coverage for medical expenses and hospitalization.',
        icon: <HeartPulse className="w-8 h-8 text-red-400" />,
        color: 'border-red-500/50 bg-red-500/10'
    },
    {
        id: 'FamilyFloater',
        title: 'Family Floater',
        description: 'One plan for your entire family\'s health needs.',
        icon: <Users className="w-8 h-8 text-purple-400" />,
        color: 'border-purple-500/50 bg-purple-500/10'
    },
    {
        id: 'CriticalIllness',
        title: 'Critical Illness',
        description: 'Lump sum payout for serious illnesses.',
        icon: <Stethoscope className="w-8 h-8 text-yellow-400" />,
        color: 'border-yellow-500/50 bg-yellow-500/10'
    }
];

export default function StepPolicySelection({ data, updateData }: StepProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policyOptions.map((option) => (
                <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ policyType: option.id as PolicyType })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-4
                        ${data.policyType === option.id
                            ? option.color + ' ring-2 ring-offset-2 ring-offset-black ring-white'
                            : 'border-dimWhite/10 bg-white/5 hover:bg-white/10'
                        }
                    `}
                >
                    <div className="p-4 bg-white/10 rounded-full">{option.icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                        <p className="text-sm text-dimWhite">{option.description}</p>
                    </div>
                    {data.policyType === option.id && (
                        <span className="bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full uppercase mt-2">
                            Selected
                        </span>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
