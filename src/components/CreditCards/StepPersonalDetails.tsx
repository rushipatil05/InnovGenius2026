import { ApplicationData } from './CreditCardTypes';
import { User, Calendar, Smartphone, Mail, CreditCard, Heart } from 'lucide-react';

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

export default function StepPersonalDetails({ data, updateData }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Full Name (as per PAN)</span>
                    </label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => updateData({ fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                    />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date of Birth</span>
                    </label>
                    <input
                        type="date"
                        value={data.dob}
                        onChange={(e) => updateData({ dob: e.target.value })}
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                    />
                </div>

                {/* PAN Number */}
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>PAN Number</span>
                    </label>
                    <input
                        type="text"
                        value={data.pan}
                        onChange={(e) => updateData({ pan: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition uppercase"
                    />
                </div>

                {/* Marital Status */}
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <Heart className="w-4 h-4" />
                        <span>Marital Status</span>
                    </label>
                    <select
                        value={data.maritalStatus}
                        onChange={(e) => updateData({ maritalStatus: e.target.value })}
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition appearance-none"
                    >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Mobile Number</span>
                    </label>
                    <input
                        type="tel"
                        value={data.mobile}
                        onChange={(e) => updateData({ mobile: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData({ email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                    />
                </div>
            </div>
        </div>
    );
}
