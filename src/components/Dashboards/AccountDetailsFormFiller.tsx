import { useEffect } from 'react';
import { CheckCircle, Landmark, Wallet, Layers, Users } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface AccountDetailsProps {
    accountType?: string;
    branchPreference?: string;
    modeOfOperation?: string;
    initialDeposit?: string;
}

export default function AccountDetailsFormFiller({
    accountType,
    branchPreference,
    modeOfOperation,
    initialDeposit
}: AccountDetailsProps) {

    useEffect(() => {
        formFillBridge.fill({
            accountType,
            branchPreference,
            modeOfOperation,
            initialDeposit
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountType, branchPreference, modeOfOperation, initialDeposit]);

    const fields = [
        { icon: <Layers className="w-4 h-4" />, label: 'Type', value: accountType?.toUpperCase().replace('-', ' ') || 'Savings' },
        { icon: <Landmark className="w-4 h-4" />, label: 'Branch', value: branchPreference || '—' },
        { icon: <Users className="w-4 h-4" />, label: 'Mode', value: modeOfOperation === 'joint' ? 'Joint' : 'Self' },
        { icon: <Wallet className="w-4 h-4" />, label: 'Deposit', value: `₹${initialDeposit || '0'}` },
    ];

    return (
        <div className="rounded-xl border border-blue-400/30 bg-blue-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400 font-poppins">Account Setup — Auto-filled ✨</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                {fields.map((f, i) => (
                    <div key={i} className="flex flex-col gap-1 p-2 rounded bg-white/5">
                        <div className="flex items-center gap-1.5 text-blue-300/80 text-xs">
                            {f.icon} {f.label}
                        </div>
                        <div className="text-white font-medium pl-0.5">{f.value}</div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Updated! Click <strong>Next</strong> to proceed.
            </p>
        </div>
    );
}
