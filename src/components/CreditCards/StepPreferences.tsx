import { ApplicationData } from './CreditCardTypes';
import { Calendar, ShoppingBag, Truck, Users, Tag } from 'lucide-react';

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepPreferences({ data, updateData }: StepProps) {
    const togglePreference = (pref: string) => {
        const current = data.spendingPreferences;
        if (current.includes(pref)) {
            updateData({ spendingPreferences: current.filter(p => p !== pref) });
        } else {
            updateData({ spendingPreferences: [...current, pref] });
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Billing Cycle */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Preferred Billing Cycle</span>
                    </label>
                    <select
                        value={data.billingCycle}
                        onChange={(e) => updateData({ billingCycle: e.target.value })}
                        className={inputClass + ' appearance-none'}
                    >
                        <option value="1st of month">1st of every month</option>
                        <option value="15th of month">15th of every month</option>
                        <option value="20th of month">20th of every month</option>
                    </select>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium flex items-center space-x-2">
                        <Truck className="w-4 h-4" />
                        <span>Card Delivery Address</span>
                    </label>
                    <select
                        value={data.deliveryAddress}
                        onChange={(e) => updateData({ deliveryAddress: e.target.value })}
                        className={inputClass + ' appearance-none'}
                    >
                        <option value="Current">Current: {data.currentAddress.slice(0, 20)}...</option>
                        {data.permanentAddress && (
                            <option value="Permanent">Permanent: {data.permanentAddress.slice(0, 20)}...</option>
                        )}
                        <option value="Office">Office Address</option>
                    </select>
                </div>
            </div>

            {/* Add-on Card */}
            <div
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-dimWhite/10 cursor-pointer hover:bg-white/10 transition"
                onClick={() => updateData({ addOnCard: !data.addOnCard })}
            >
                <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-purple-400" />
                    <div>
                        <p className="text-white font-medium">Request Add-on Card</p>
                        <p className="text-xs text-dimWhite">Free add-on card for family members</p>
                    </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition ${data.addOnCard ? 'bg-secondary' : 'bg-dimWhite/30'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${data.addOnCard ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
            </div>

            {/* Spending Preferences */}
            <div className="space-y-4">
                <label className="text-dimWhite font-medium flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Spending Preferences (Select up to 3)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {['Travel', 'Dining', 'Shopping', 'Fuel', 'Groceries', 'Entertainment', 'Electronics'].map((pref) => (
                        <button
                            key={pref}
                            onClick={() => togglePreference(pref)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center space-x-2 ${data.spendingPreferences.includes(pref)
                                ? 'bg-blue-gradient text-primary shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 text-dimWhite border border-dimWhite/10 hover:bg-white/10'
                                }`}
                        >
                            {pref === 'Shopping' && <ShoppingBag className="w-3 h-3" />}
                            <span>{pref}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
