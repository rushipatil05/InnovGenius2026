import { useEffect } from 'react';
import { CheckCircle, Heart, UserPlus, MapPin, Calendar } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface NomineeDetailsProps {
    nomineeName?: string;
    nomineeRelation?: string;
    nomineeDob?: string;
    nomineeAddress?: string;
}

export default function NomineeDetailsFormFiller({
    nomineeName,
    nomineeRelation,
    nomineeDob,
    nomineeAddress
}: NomineeDetailsProps) {

    useEffect(() => {
        formFillBridge.fill({
            nomineeName,
            nomineeRelation,
            nomineeDob,
            nomineeAddress
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nomineeName, nomineeRelation, nomineeDob, nomineeAddress]);

    return (
        <div className="rounded-xl border border-pink-400/30 bg-pink-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-semibold text-pink-400 font-poppins">Nominee Details — Auto-filled ✨</span>
            </div>
            {nomineeName ? (
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                        <UserPlus className="w-4 h-4 text-pink-400/70" />
                        <span>Name: <span className="font-medium text-white">{nomineeName}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                        <Heart className="w-4 h-4 text-pink-400/70" />
                        <span>Relation: <span className="font-medium text-white">{nomineeRelation || '—'}</span></span>
                    </div>
                    {nomineeDob && (
                        <div className="flex items-center gap-2 text-white/80">
                            <Calendar className="w-4 h-4 text-pink-400/70" />
                            <span>DOB: <span className="font-medium text-white">{nomineeDob}</span></span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-sm text-gray-400 italic">No nominee added (optional).</div>
            )}
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Updated! Click <strong>Next</strong> to continue.
            </p>
        </div>
    );
}
