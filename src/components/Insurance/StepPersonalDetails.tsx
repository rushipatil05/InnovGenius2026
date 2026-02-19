import { InsuranceFormData } from './InsuranceTypes';
import { User, Calendar, Mail, Smartphone, CreditCard, Heart, MapPin, Home, Building } from 'lucide-react';

interface StepProps {
    data: InsuranceFormData;
    updateData: (updates: Partial<InsuranceFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepPersonalDetails({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            {/* Personal Section */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dimWhite/10 pb-2">Basic Info</h3>
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
                        <label className="text-dimWhite font-medium text-sm">Gender</label>
                        <select
                            value={data.gender}
                            onChange={(e) => updateData({ gender: e.target.value as any })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Heart className="w-4 h-4" />
                            <span>Marital Status</span>
                        </label>
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
                            <Smartphone className="w-4 h-4" />
                            <span>Mobile Number</span>
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
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <CreditCard className="w-4 h-4" />
                            <span>PAN Number</span>
                        </label>
                        <input
                            type="text"
                            value={data.pan}
                            onChange={(e) => updateData({ pan: e.target.value.toUpperCase() })}
                            className={inputClass}
                            placeholder="ABCDE1234F"
                            maxLength={10}
                        />
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dimWhite/10 pb-2">Address</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>Address Line 1</span>
                            </label>
                            <input
                                type="text"
                                value={data.addressLine1}
                                onChange={(e) => updateData({ addressLine1: e.target.value })}
                                className={inputClass}
                                placeholder="Flat No, Building Name"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-dimWhite font-medium text-sm">Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                value={data.addressLine2}
                                onChange={(e) => updateData({ addressLine2: e.target.value })}
                                className={inputClass}
                                placeholder="Street, Landmark"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">City</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => updateData({ city: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">State</label>
                            <input
                                type="text"
                                value={data.state}
                                onChange={(e) => updateData({ state: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm">Pincode</label>
                            <input
                                type="text"
                                value={data.pincode}
                                onChange={(e) => updateData({ pincode: e.target.value })}
                                className={inputClass}
                                maxLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                                <Home className="w-4 h-4" />
                                <span>Residence Type</span>
                            </label>
                            <select
                                value={data.residenceType}
                                onChange={(e) => updateData({ residenceType: e.target.value as any })}
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
        </div>
    );
}
