import { useEffect } from 'react';
import { CheckCircle, User, Calendar, Heart, Users, Globe } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';
import { useLanguage } from '../../contexts/LanguageContext';

export interface PersonalDetailsFillerProps {
    fullName?: string;
    dob?: string;
    gender?: 'male' | 'female' | 'other';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
    parentsName?: string;
    nationality?: string;
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
    nationality = 'indian',
    onApply,
}: PersonalDetailsFillerProps) {
    const { t } = useLanguage();

    useEffect(() => {
        const data = { fullName, dob, gender, maritalStatus, parentsName, nationality };
        onApply ? onApply(data) : formFillBridge.fill(data);
    }, [fullName, dob, gender, maritalStatus, parentsName, nationality, onApply]);


    const fields = [
        {
            icon: <User className="w-4 h-4" />,
            label: t('labelFullName'),
            value: fullName || '—'
        },
        {
            icon: <Calendar className="w-4 h-4" />,
            label: t('labelDOB'),
            value: dob || '—'
        },
        {
            icon: <Users className="w-4 h-4" />,
            label: t('labelGender'),
            // FIX: Convert prop to lowercase to match the translation key
            value: gender ? t(gender.toLowerCase()) : '—'
        },
        {
            icon: <Heart className="w-4 h-4" />,
            label: t('labelMaritalStatus'),
            // FIX: Convert prop to lowercase to match the translation key
            value: maritalStatus ? t(maritalStatus.toLowerCase()) : '—'
        },
        {
            icon: <User className="w-4 h-4" />,
            label: t('labelParentsName'),
            value: parentsName || '—'
        },
        {
            icon: <Globe className="w-4 h-4" />,
            label: t('labelNationality'),
            // FIX: Convert prop to lowercase to match the translation key
            value: nationality ? t(nationality.toLowerCase()) : '—'
        },
    ];

    return (
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400 font-poppins">
                    {t('personalDetailsAutoFilled')}
                </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {fields.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-400/70 mt-0.5 shrink-0">{f.icon}</span>
                        <span className="text-gray-400 font-poppins w-40 shrink-0">{f.label}:</span>
                        <span className="text-white font-poppins font-medium">{f.value}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ {t('formUpdatedReview').replace('Next', t('next'))}
            </p>
        </div>
    );
}