import { LoanFormData, LoanType } from './LoanTypes';
import { User, Home, Car, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: LoanFormData;
    updateData: (updates: Partial<LoanFormData>) => void;
}

const loanOptions = [
    {
        id: 'Personal',
        title: 'Personal Loan',
        description: 'Instant funds for any personal need.',
        icon: <User className="w-8 h-8 text-blue-400" />,
        color: 'border-blue-500/50 bg-blue-500/10'
    },
    {
        id: 'Home',
        title: 'Home Loan',
        description: 'Buy or construct your dream home.',
        icon: <Home className="w-8 h-8 text-green-400" />,
        color: 'border-green-500/50 bg-green-500/10'
    },
    {
        id: 'Vehicle',
        title: 'Vehicle Loan',
        description: 'Get your dream car or bike today.',
        icon: <Car className="w-8 h-8 text-red-400" />,
        color: 'border-red-500/50 bg-red-500/10'
    },
    {
        id: 'Business',
        title: 'Business Loan',
        description: 'Expand your business operations.',
        icon: <Briefcase className="w-8 h-8 text-purple-400" />,
        color: 'border-purple-500/50 bg-purple-500/10'
    },
    {
        id: 'Education',
        title: 'Education Loan',
        description: 'Fund your higher education.',
        icon: <GraduationCap className="w-8 h-8 text-yellow-400" />,
        color: 'border-yellow-500/50 bg-yellow-500/10'
    }
];

export default function StepLoanSelection({ data, updateData }: StepProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanOptions.map((option) => (
                <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ loanType: option.id as LoanType })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-4
                        ${data.loanType === option.id
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
                    {data.loanType === option.id && (
                        <span className="bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full uppercase mt-2">
                            Selected
                        </span>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
