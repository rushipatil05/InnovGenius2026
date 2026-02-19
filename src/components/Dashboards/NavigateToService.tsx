import { useEffect, useState } from 'react';
import { ArrowRight, FileText, BadgeDollarSign, CreditCard, PieChart, ShieldCheck, Landmark } from 'lucide-react';
import { navBridge } from '../../lib/navBridge';

export type ServiceKey = 'account' | 'loans' | 'cards' | 'invest' | 'insurance' | 'tax';

export interface NavigateToServiceProps {
    service: ServiceKey;
    title?: string;
    description?: string;
}

const SERVICE_META: Record<ServiceKey, { label: string; description: string; icon: JSX.Element; available: boolean }> = {
    account: {
        label: 'Account Opening',
        description: 'Open a new savings or current account digitally.',
        icon: <FileText className="w-6 h-6 text-cyan-400" />,
        available: true,
    },
    loans: {
        label: 'Loans',
        description: 'Personal, home, and vehicle loans.',
        icon: <BadgeDollarSign className="w-6 h-6 text-yellow-400" />,
        available: false,
    },
    cards: {
        label: 'Cards',
        description: 'Credit cards with exclusive rewards.',
        icon: <CreditCard className="w-6 h-6 text-purple-400" />,
        available: false,
    },
    invest: {
        label: 'Invest',
        description: 'Mutual funds, FDs, and stocks.',
        icon: <PieChart className="w-6 h-6 text-green-400" />,
        available: false,
    },
    insurance: {
        label: 'Insurance',
        description: 'Life and health insurance plans.',
        icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
        available: false,
    },
    tax: {
        label: 'Tax',
        description: 'Easy tax filing services.',
        icon: <Landmark className="w-6 h-6 text-orange-400" />,
        available: false,
    },
};

export default function NavigateToService({ service, title, description }: NavigateToServiceProps) {
    const meta = SERVICE_META[service] ?? SERVICE_META.account;
    const displayTitle = title ?? meta.label;
    const displayDesc = description ?? meta.description;
    const [navigated, setNavigated] = useState(false);

    useEffect(() => {
        if (meta.available) {
            // Just call navigate -> Bridge will queue if not ready
            navBridge.navigate(service);
            setNavigated(true);
        }
    }, [service]); // Added dependency

    return (
        <div className="rounded-xl border border-indigo-400/30 bg-indigo-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    {meta.icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white font-poppins">{displayTitle}</p>
                    <p className="text-xs text-gray-400 font-poppins">{displayDesc}</p>
                </div>
            </div>

            {meta.available ? (
                navigated ? (
                    <div className="flex items-center gap-2 text-green-400 text-xs font-poppins font-medium">
                        ✅ Navigating...
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-poppins font-medium">
                        <ArrowRight className="w-3 h-3 animate-pulse" />
                        Opening...
                    </div>
                )
            ) : (
                <p className="text-xs text-yellow-400 font-poppins">
                    ⚠️ Only <strong>Account Opening</strong> is available right now.
                </p>
            )}
        </div>
    );
}
