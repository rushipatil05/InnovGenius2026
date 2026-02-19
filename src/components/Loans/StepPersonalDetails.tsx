import { LoanFormData, ResidenceType } from './LoanTypes';
import { User, Calendar, Smartphone, Mail, MapPin, Building, Home, Users } from 'lucide-react';

interface StepProps {
    data: LoanFormData;
    updateData: (updates: Partial<LoanFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepPersonalDetails({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            {/* Personal Info */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dimWhite/10 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Full Name</span>
                        </label>
                        <input
                            type="text"
                            value={data.fullName}
                            onChange={(e) => updateData({ fullName: e.target.value })}
                            className={inputClass}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Date of Birth</span>
                        </label>
                        <input
                            type="date"
                            value={data.dob}
                            onChange={(e) => updateData({ dob: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Smartphone className="w-4 h-4" />
                            <span>Mobile</span>
                        </label>
                        <input
                            type="tel"
                            value={data.mobile}
                            onChange={(e) => updateData({ mobile: e.target.value })}
                            className={inputClass}
                            placeholder="+91 9876543210"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            className={inputClass}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm">Marital Status</label>
                        <select
                            value={data.maritalStatus}
                            onChange={(e) => updateData({ maritalStatus: e.target.value as any })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Dependents</span>
                        </label>
                        <input
                            type="number"
                            value={data.dependents}
                            onChange={(e) => updateData({ dependents: e.target.value })}
                            className={inputClass}
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dimWhite/10 pb-2">Current Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Full Address</span>
                        </label>
                        <textarea
                            value={data.currentAddress}
                            onChange={(e) => updateData({ currentAddress: e.target.value })}
                            className={`${inputClass} min-h-[80px]`}
                            placeholder="Flat No, Building, Street, City, Pincode"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Home className="w-4 h-4" />
                            <span>Residence Type</span>
                        </label>
                        <select
                            value={data.residenceType}
                            onChange={(e) => updateData({ residenceType: e.target.value as ResidenceType })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="Owned">Owned</option>
                            <option value="Rented">Rented</option>
                            <option value="CompanyProvided">Company Provided</option>
                            <option value="Parental">Parental</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>Years at Address</span>
                        </label>
                        <input
                            type="number"
                            value={data.yearsAtAddress}
                            onChange={(e) => updateData({ yearsAtAddress: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
