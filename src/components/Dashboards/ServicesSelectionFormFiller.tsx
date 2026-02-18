import { useEffect } from 'react';
import { CheckCircle, CreditCard, Laptop, Smartphone, Mail, FileText } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface ServicesProps {
    debitCard?: boolean;
    netBanking?: boolean;
    mobileBanking?: boolean;
    chequeBook?: boolean;
    smsAlerts?: boolean;
}

export default function ServicesSelectionFormFiller({
    debitCard,
    netBanking,
    mobileBanking,
    chequeBook,
    smsAlerts
}: ServicesProps) {

    useEffect(() => {
        formFillBridge.fill({
            debitCard,
            netBanking,
            mobileBanking,
            chequeBook,
            smsAlerts
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debitCard, netBanking, mobileBanking, chequeBook, smsAlerts]);

    const activeServices = [
        { key: debitCard, label: 'Debit Card', icon: <CreditCard className="w-3 h-3" /> },
        { key: netBanking, label: 'Net Banking', icon: <Laptop className="w-3 h-3" /> },
        { key: mobileBanking, label: 'Mobile Banking', icon: <Smartphone className="w-3 h-3" /> },
        { key: chequeBook, label: 'Cheque Book', icon: <FileText className="w-3 h-3" /> },
        { key: smsAlerts, label: 'SMS', icon: <Mail className="w-3 h-3" /> },
    ].filter(s => s.key);

    return (
        <div className="rounded-xl border border-orange-400/30 bg-orange-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-400 font-poppins">Services Selected — Auto-filled ✨</span>
            </div>
            {activeServices.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-xs">
                    {activeServices.map((s, i) => (
                        <span key={i} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-white font-medium">
                            {s.icon} {s.label}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-gray-400 italic">No services selected.</div>
            )}
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Done! Click <strong>Submit Application</strong>.
            </p>
        </div>
    );
}
