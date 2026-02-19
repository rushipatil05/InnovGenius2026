import { ApplicationData } from './CreditCardTypes';
import { motion } from 'framer-motion';
import { MapPin, Home, Building, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

export default function StepAddressDetails({ data, updateData }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="text-dimWhite font-medium flex items-center space-x-2">
                    <MapPin className="text-secondary w-5 h-5" />
                    <span>Current Residential Address</span>
                </label>
                <textarea
                    value={data.currentAddress}
                    onChange={(e) => updateData({ currentAddress: e.target.value })}
                    placeholder="Flat No, Building, Street, Area, City, Pincode"
                    rows={3}
                    className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>Residence Type</span>
                    </label>
                    <select
                        value={data.residenceType}
                        onChange={(e) => updateData({ residenceType: e.target.value })}
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition appearance-none"
                    >
                        <option value="">Select Type</option>
                        <option value="Owned">Owned by Self/Spouse</option>
                        <option value="Rented">Rented</option>
                        <option value="Company Provided">Company Provided</option>
                        <option value="Parental">Parental</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-dimWhite text-sm font-medium flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Years at Current Address</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={data.yearsAtAddress}
                        onChange={(e) => updateData({ yearsAtAddress: e.target.value })}
                        placeholder="Years (e.g. 5)"
                        className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-dimWhite/10">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => updateData({ isPermanentSame: !data.isPermanentSame })}>
                    <span className="text-white font-medium">Is Permanent Address same as Current Address?</span>
                    {data.isPermanentSame ? (
                        <ToggleRight className="w-10 h-10 text-secondary transition" />
                    ) : (
                        <ToggleLeft className="w-10 h-10 text-dimWhite transition" />
                    )}
                </div>

                {!data.isPermanentSame && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden"
                    >
                        <label className="text-dimWhite font-medium flex items-center space-x-2 mb-2">
                            <Building className="text-secondary w-5 h-5" />
                            <span>Permanent Address</span>
                        </label>
                        <textarea
                            value={data.permanentAddress}
                            onChange={(e) => updateData({ permanentAddress: e.target.value })}
                            placeholder="Flat No, Building, Street, Area, City, Pincode"
                            rows={3}
                            className="w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition resize-none"
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
