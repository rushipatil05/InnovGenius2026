import { ApplicationData } from './CreditCardTypes';
import { User, MapPin, Briefcase, DollarSign, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: ApplicationData;
    riskScore: number | null;
}

export default function ReviewApplication({ data, riskScore }: StepProps) {
    const sections = [
        {
            title: 'Personal Details',
            icon: <User className="w-5 h-5 text-blue-400" />,
            items: [
                { label: 'Name', value: data.fullName },
                { label: 'Email', value: data.email },
                { label: 'Mobile', value: data.mobile },
                { label: 'PAN', value: data.pan },
            ]
        },
        {
            title: 'Address',
            icon: <MapPin className="w-5 h-5 text-purple-400" />,
            items: [
                { label: 'Current Address', value: data.currentAddress },
                { label: 'Residence Type', value: data.residenceType },
                { label: 'Years at Address', value: data.yearsAtAddress },
            ]
        },
        {
            title: 'Employment',
            icon: <Briefcase className="w-5 h-5 text-yellow-400" />,
            items: [
                { label: 'Type', value: data.employmentType },
                { label: 'Company/Business', value: data.companyName || data.businessName || data.collegeName },
                { label: 'Income', value: `₹${data.monthlyIncome} / month` },
            ]
        },
        {
            title: 'Financials',
            icon: <DollarSign className="w-5 h-5 text-green-400" />,
            items: [
                { label: 'Existing EMIs', value: `₹${data.existingEmis}` },
                { label: 'Requested Limit', value: `₹${data.requestedLimit}` },
                { label: 'Other Cards', value: data.existingCreditCards ? 'Yes' : 'No' },
            ]
        },
        {
            title: 'Preferences',
            icon: <CreditCard className="w-5 h-5 text-pink-400" />,
            items: [
                { label: 'Card Type', value: data.cardType },
                { label: 'Billing Cycle', value: data.billingCycle },
                { label: 'Delivery', value: data.deliveryAddress },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Review Application</h3>

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

            {/* Risk Score Summary */}
            {riskScore !== null && (
                <div className="mt-8 bg-black-gradient-2 p-6 rounded-xl border border-dimWhite/10 text-center">
                    <p className="text-dimWhite mb-2">Final Risk Assessment Score</p>
                    <div className="text-4xl font-bold text-white mb-2">
                        <span className={riskScore > 70 ? 'text-green-400' : riskScore > 40 ? 'text-yellow-400' : 'text-red-400'}>
                            {riskScore}
                        </span>
                        <span className="text-lg text-dimWhite"> / 100</span>
                    </div>
                    <p className="text-sm text-dimWhite/70">
                        Based on your profile, your application has a
                        <span className="font-bold text-white"> {riskScore > 70 ? 'High' : riskScore > 40 ? 'Moderate' : 'Low'} </span>
                        probability of approval.
                    </p>
                </div>
            )}
        </div>
    );
}
