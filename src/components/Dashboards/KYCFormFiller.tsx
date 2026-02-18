import { useEffect } from 'react';
import { CheckCircle, Fingerprint, FileText } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface KYCFillerProps {
    panNumber?: string;
    aadhaarNumber?: string;
    passportNumber?: string;
}

export default function KYCFormFiller({ panNumber, aadhaarNumber, passportNumber }: KYCFillerProps) {
    useEffect(() => {
        formFillBridge.fill({ panNumber, aadhaarNumber, passportNumber });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panNumber, aadhaarNumber, passportNumber]);

    return (
        <div className="rounded-xl border border-purple-400/30 bg-purple-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400 font-poppins">KYC Details — Auto-filled ✨</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                    <FileText className="w-4 h-4 text-purple-400/70" />
                    <span>PAN: <span className="font-mono text-white">{panNumber || '—'}</span></span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                    <Fingerprint className="w-4 h-4 text-purple-400/70" />
                    <span>Aadhaar: <span className="font-mono text-white">{aadhaarNumber || '—'}</span></span>
                </div>
                {passportNumber && (
                    <div className="flex items-center gap-2 text-white/80">
                        <FileText className="w-4 h-4 text-purple-400/70" />
                        <span>Passport: <span className="font-mono text-white">{passportNumber}</span></span>
                    </div>
                )}
            </div>
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Done! Click <strong>Next</strong> to proceed.
            </p>
        </div>
    );
}
