import { useEffect } from 'react';
import { CheckCircle, User, Calendar, Heart, Users, Globe } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface PersonalDetailsFillerProps {
    /** Full name of the applicant */
    fullName?: string;
    /** Date of birth in YYYY-MM-DD format */
    dob?: string;
    /** Gender: male | female | other */
    gender?: 'male' | 'female' | 'other';
    /** Marital status: single | married | divorced | widowed */
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
    /** Father's or Mother's full name */
    parentsName?: string;
    /** Nationality, defaults to Indian */
    nationality?: string;
    /** Optional direct callback (used when rendered outside Tambo) */
    onApply?: (data: {
        fullName?: string;
        dob?: string;
        gender?: string;
        maritalStatus?: string;
        parentsName?: string;
        nationality?: string;
    }) => void;
}

export default function PersonalDetailsFormFiller({
    fullName,
    dob,
    gender,
    maritalStatus,
    parentsName,
    nationality = 'Indian',
    onApply,
}: PersonalDetailsFillerProps) {

    // Auto-fill the form as soon as Tambo renders this component.
    // Uses the global bridge so it works even when Tambo renders the
    // component directly (without prop injection).
    useEffect(() => {
        const data = { fullName, dob, gender, maritalStatus, parentsName, nationality };
        // Try direct callback first (legacy path), then bridge
        if (onApply) {
            onApply(data);
        } else {
            formFillBridge.fill(data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullName, dob, gender, maritalStatus, parentsName, nationality, onApply]);

    const fields = [
        { icon: <User className="w-4 h-4" />, label: 'Full Name', value: fullName || '—' },
        { icon: <Calendar className="w-4 h-4" />, label: 'Date of Birth', value: dob || '—' },
        { icon: <Users className="w-4 h-4" />, label: 'Gender', value: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—' },
        { icon: <Heart className="w-4 h-4" />, label: 'Marital Status', value: maritalStatus ? maritalStatus.charAt(0).toUpperCase() + maritalStatus.slice(1) : '—' },
        { icon: <User className="w-4 h-4" />, label: "Father's / Mother's Name", value: parentsName || '—' },
        { icon: <Globe className="w-4 h-4" />, label: 'Nationality', value: nationality },
    ];

    return (
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400 font-poppins">
                    Personal Details — Auto-filled ✨
                </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {fields.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-400/70 mt-0.5 shrink-0">{f.icon}</span>
                        <span className="text-gray-400 font-poppins w-36 shrink-0">{f.label}:</span>
                        <span className="text-white font-poppins font-medium">{f.value}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Form fields updated! Review and click <strong>Next</strong> to continue.
            </p>
        </div>
    );
}
