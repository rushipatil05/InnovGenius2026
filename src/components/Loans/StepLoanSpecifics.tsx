import { LoanFormData } from './LoanTypes';
import { User, Home, Car, Briefcase, GraduationCap, DollarSign, Calendar } from 'lucide-react';
// import { motion } from 'framer-motion';

interface StepProps {
    data: LoanFormData;
    updateData: (updates: Partial<LoanFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepLoanSpecifics({ data, updateData }: StepProps) {
    // if (!data.loanType) return null; // Logic handled in renderSpecifics

    const renderSpecifics = () => {
        switch (data.loanType) {
            case 'Personal':
                return (
                    <div className="space-y-4 animate-fade-in-down">
                        <div className="flex items-center gap-2 text-secondary mb-2">
                            <User className="w-5 h-5" />
                            <h4 className="font-semibold">Personal Loan Details</h4>
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">Purpose of Loan</label>
                            <select
                                value={data.loanPurpose}
                                onChange={(e) => updateData({ loanPurpose: e.target.value })}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="">Select Purpose</option>
                                <option value="Medical">Medical Emergency</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Travel">Travel</option>
                                <option value="Renovation">Home Renovation</option>
                                <option value="Consolidation">Debt Consolidation</option>
                            </select>
                        </div>
                    </div>
                );
            case 'Home':
                return (
                    <div className="space-y-4 animate-fade-in-down">
                        <div className="flex items-center gap-2 text-secondary mb-2">
                            <Home className="w-5 h-5" />
                            <h4 className="font-semibold">Home Loan Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Property Value</label>
                                <input
                                    type="number"
                                    value={data.propertyValue}
                                    onChange={(e) => updateData({ propertyValue: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 5000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Down Payment Amount</label>
                                <input
                                    type="number"
                                    value={data.downPayment}
                                    onChange={(e) => updateData({ downPayment: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. 1000000"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Property Address</label>
                                <textarea
                                    value={data.propertyAddress}
                                    onChange={(e) => updateData({ propertyAddress: e.target.value })}
                                    className={`${inputClass} min-h-[60px]`}
                                    placeholder="Address of property being purchased"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'Vehicle':
                return (
                    <div className="space-y-4 animate-fade-in-down">
                        <div className="flex items-center gap-2 text-secondary mb-2">
                            <Car className="w-5 h-5" />
                            <h4 className="font-semibold">Vehicle Loan Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Car Model</label>
                                <input
                                    type="text"
                                    value={data.vehicleModel}
                                    onChange={(e) => updateData({ vehicleModel: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. Tata Nexon EV"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Ex-Showroom Price</label>
                                <input
                                    type="number"
                                    value={data.vehiclePrice}
                                    onChange={(e) => updateData({ vehiclePrice: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Dealer Name</label>
                                <input
                                    type="text"
                                    value={data.dealerName}
                                    onChange={(e) => updateData({ dealerName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'Business':
                return (
                    <div className="space-y-4 animate-fade-in-down">
                        <div className="flex items-center gap-2 text-secondary mb-2">
                            <Briefcase className="w-5 h-5" />
                            <h4 className="font-semibold">Business Loan Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">GSTIN</label>
                                <input
                                    type="text"
                                    value={data.gstin}
                                    onChange={(e) => updateData({ gstin: e.target.value })}
                                    className={inputClass}
                                    placeholder="GSTIN Number"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Business Vintage (Years)</label>
                                <input
                                    type="number"
                                    value={data.businessVintage}
                                    onChange={(e) => updateData({ businessVintage: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'Education':
                return (
                    <div className="space-y-4 animate-fade-in-down">
                        <div className="flex items-center gap-2 text-secondary mb-2">
                            <GraduationCap className="w-5 h-5" />
                            <h4 className="font-semibold">Education Loan Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">College/University Name</label>
                                <input
                                    type="text"
                                    value={data.collegeName}
                                    onChange={(e) => updateData({ collegeName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-dimWhite font-medium text-sm">Course Name</label>
                                <input
                                    type="text"
                                    value={data.courseName}
                                    onChange={(e) => updateData({ courseName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm">
                        Please select a loan type in Step 1 to add specific details.
                    </div>
                );
        }
    };


    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">Loan Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span>Required Loan Amount</span>
                    </label>
                    <input
                        type="number"
                        value={data.loanAmount}
                        onChange={(e) => updateData({ loanAmount: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 500000"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>Tenure (Months)</span>
                    </label>
                    <input
                        type="number"
                        value={data.loanTenure}
                        onChange={(e) => updateData({ loanTenure: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 24"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-dimWhite/10">
                {renderSpecifics()}
            </div>
        </div>
    );
}
