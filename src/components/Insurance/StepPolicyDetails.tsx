import { InsuranceFormData } from './InsuranceTypes';
import { DollarSign, Shield, Calendar, Users, HeartPulse, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: InsuranceFormData;
    updateData: (updates: Partial<InsuranceFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepPolicyDetails({ data, updateData }: StepProps) {
    const isLifeOrTerm = data.policyType === 'Life' || data.policyType === 'Term';
    const isHealth = data.policyType === 'Health';
    const isFloater = data.policyType === 'FamilyFloater';
    const isCritical = data.policyType === 'CriticalIllness';

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">Configure Your {data.policyType} Plan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Field: Coverage Amount */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span>Coverage Amount (Sum Insured)</span>
                    </label>
                    <select
                        value={data.coverageAmount}
                        onChange={(e) => updateData({ coverageAmount: e.target.value })}
                        className={`${inputClass} appearance-none`}
                    >
                        <option value="">Select Amount</option>
                        <option value="500000">₹5 Lakhs</option>
                        <option value="1000000">₹10 Lakhs</option>
                        <option value="2500000">₹25 Lakhs</option>
                        <option value="5000000">₹50 Lakhs</option>
                        <option value="10000000">₹1 Crore</option>
                        <option value="20000000">₹2 Crores</option>
                    </select>
                </div>

                {/* Life / Term Specific */}
                {isLifeOrTerm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>Policy Tenure</span>
                        </label>
                        <select
                            value={data.policyTenure}
                            onChange={(e) => updateData({ policyTenure: e.target.value })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="10">10 Years</option>
                            <option value="20">20 Years</option>
                            <option value="30">30 Years</option>
                            <option value="Till60">Till Age 60</option>
                            <option value="Till85">Till Age 85</option>
                            <option value="Till99">Whole Life (99 Years)</option>
                        </select>
                    </motion.div>
                )}

                {/* Health Specific */}
                {(isHealth || isFloater) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-red-400" />
                            <span>Room Rent Preference</span>
                        </label>
                        <select
                            value={data.roomRentPreference}
                            onChange={(e) => updateData({ roomRentPreference: e.target.value as any })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="Standard">Standard (Shared)</option>
                            <option value="Semi-Private">Semi-Private Single</option>
                            <option value="Private">Private Suite</option>
                        </select>
                    </motion.div>
                )}

                {/* Critical Illness Specific */}
                {isCritical && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Stethoscope className="w-4 h-4 text-yellow-400" />
                                <span>Illness Coverage Type</span>
                            </label>
                            <select
                                value={data.illnessCoverageType}
                                onChange={(e) => updateData({ illnessCoverageType: e.target.value })}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="Basic">Basic (Cancer, Heart Attack, Stroke)</option>
                                <option value="Comprehensive">Comprehensive (30+ Illnesses)</option>
                                <option value="Premium">Premium All-Inclusive (50+ Illnesses)</option>
                            </select>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-yellow-400" />
                                <span>Waiting Period Preference</span>
                            </label>
                            <select
                                value={data.waitingPeriod}
                                onChange={(e) => updateData({ waitingPeriod: e.target.value })}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="90Days">Standard (90 Days)</option>
                                <option value="30Days">Accelerated (30 Days) - Higher Premium</option>
                            </select>
                        </motion.div>
                    </>
                )}
            </div>

            {/* Family Floater - Member Details */}
            {isFloater && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 border-t border-dimWhite/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Family Members to Cover
                    </h4>
                    {/* Add dynamic member logic here for fuller implementation. For now, simple mock */}
                    <p className="text-dimWhite text-sm italic">
                        (Dynamic form to add spouse and children would appear here.)
                    </p>
                </motion.div>
            )}

            {/* Nominee Details - For all policies */}
            <div className="pt-8 border-t border-dimWhite/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-pink-400" />
                    Nominee Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Nominee Name</label>
                        <input
                            type="text"
                            value={data.nominee.name}
                            onChange={(e) => updateData({ nominee: { ...data.nominee, name: e.target.value } })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Relationship</label>
                        <select
                            value={data.nominee.relation}
                            onChange={(e) => updateData({ nominee: { ...data.nominee, relation: e.target.value } })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="">Select Relation</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Parent">Parent</option>
                            <option value="Child">Child</option>
                            <option value="Sibling">Sibling</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Nominee DOB</label>
                        <input
                            type="date"
                            value={data.nominee.dob}
                            onChange={(e) => updateData({ nominee: { ...data.nominee, dob: e.target.value } })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Nominee Contact</label>
                        <input
                            type="tel"
                            value={data.nominee.contact}
                            onChange={(e) => updateData({ nominee: { ...data.nominee, contact: e.target.value } })}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
