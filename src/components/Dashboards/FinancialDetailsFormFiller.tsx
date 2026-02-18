import { useEffect } from 'react';
import { CheckCircle, Briefcase, IndianRupee, Building } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface FinancialDetailsProps {
    employment?: string;
    employerName?: string;
    annualIncome?: string;
    sourceOfFunds?: string;
}

export default function FinancialDetailsFormFiller({
    employment,
    employerName,
    annualIncome,
    sourceOfFunds
}: FinancialDetailsProps) {

    useEffect(() => {
        formFillBridge.fill({
            employment,
            employerName,
            annualIncome,
            sourceOfFunds
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employment, employerName, annualIncome, sourceOfFunds]);

    return (
        <div className="rounded-xl border border-teal-400/30 bg-teal-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-semibold text-teal-400 font-poppins">Financial Details — Auto-filled ✨</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                    <Briefcase className="w-4 h-4 text-teal-400/70" />
                    <span>Occupation: <span className="font-medium text-white">{employment || '—'}</span></span>
                </div>
                {employerName && (
                    <div className="flex items-center gap-2 text-white/80">
                        <Building className="w-4 h-4 text-teal-400/70" />
                        <span>Employer: <span className="font-medium text-white">{employerName}</span></span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-white/80">
                    <IndianRupee className="w-4 h-4 text-teal-400/70" />
                    <span>Income: <span className="font-medium text-white">{annualIncome || '—'}</span></span>
                </div>
            </div>
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Done! Click <strong>Next</strong> to proceed.
            </p>
        </div>
    );
}
