import { motion } from 'framer-motion';
import { ApplicationData, CardType } from './CreditCardTypes';
import { CreditCard, Rocket, ShieldCheck, Briefcase } from 'lucide-react';

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

const cardOptions = [
    {
        id: 'Entry',
        title: 'Entry / Secured',
        icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
        features: ['No Annual Fee', 'Build Credit Score', 'Low Interest Rate'],
        eligibility: 'Income < ₹2.5L or Students',
        color: 'border-blue-500/50 bg-blue-500/10'
    },
    {
        id: 'Rewards',
        title: 'Rewards Plus',
        icon: <Rocket className="w-8 h-8 text-purple-400" />,
        features: ['5X Rewards on Dining', 'Movie Ticket BOGO', 'Fuel Surcharge Waiver'],
        eligibility: 'Income > ₹5L',
        color: 'border-purple-500/50 bg-purple-500/10'
    },
    {
        id: 'Premium',
        title: 'Premium Elite',
        icon: <CreditCard className="w-8 h-8 text-yellow-400" />,
        features: ['Airport Lounge Access', 'Golf Lessons', 'Concierge Service'],
        eligibility: 'Income > ₹15L',
        color: 'border-yellow-500/50 bg-yellow-500/10'
    },
    {
        id: 'Business',
        title: 'Business Corp',
        icon: <Briefcase className="w-8 h-8 text-green-400" />,
        features: ['Expense Management', 'GST Invoicing', 'High Credit Limit'],
        eligibility: 'Business Owners Only',
        color: 'border-green-500/50 bg-green-500/10'
    }
];

export default function StepCardSelection({ data, updateData }: StepProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-stretch">
            {cardOptions.map((card) => (
                <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ cardType: card.id as CardType })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between
            ${data.cardType === card.id ? card.color + ' ring-2 ring-offset-2 ring-offset-black ring-white' : 'border-dimWhite/10 bg-white/5 hover:bg-white/10'}
          `}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/10 rounded-full">{card.icon}</div>
                        {data.cardType === card.id && (
                            <span className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded-full uppercase">Selected</span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>

                    <ul className="space-y-2 mb-4">
                        {card.features.map((feat, i) => (
                            <li key={i} className="text-sm text-dimWhite flex items-center">
                                <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                                {feat}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-dimWhite/10">
                        <p className="text-xs text-dimWhite/60 uppercase tracking-widest font-semibold mb-1">Recommended for</p>
                        <p className="text-sm text-dimWhite">{card.eligibility}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
