import { useEffect } from 'react';
import { CheckCircle, Phone, Mail, MapPin, Building, Home, Map } from 'lucide-react';
import { formFillBridge } from '../../lib/formFillBridge';

export interface ContactDetailsFillerProps {
    mobileNumber?: string;
    email?: string;
    currentAddress?: string;
    permanentAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    permanentAddressSame?: boolean;
}

export default function ContactDetailsFormFiller({
    mobileNumber,
    email,
    currentAddress,
    permanentAddress,
    city,
    state,
    pincode,
    permanentAddressSame,
}: ContactDetailsFillerProps) {

    useEffect(() => {
        const data = {
            mobileNumber,
            email,
            currentAddress,
            permanentAddress,
            city,
            state,
            pincode,
            permanentAddressSame
        };
        formFillBridge.fill(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobileNumber, email, currentAddress, permanentAddress, city, state, pincode, permanentAddressSame]);

    const fields = [
        { icon: <Phone className="w-4 h-4" />, label: 'Mobile', value: mobileNumber || '—' },
        { icon: <Mail className="w-4 h-4" />, label: 'Email', value: email || '—' },
        { icon: <MapPin className="w-4 h-4" />, label: 'Current Address', value: currentAddress || '—' },
        { icon: <Home className="w-4 h-4" />, label: 'Permanent', value: permanentAddressSame ? 'Same as Current' : (permanentAddress || '—') },
        { icon: <Building className="w-4 h-4" />, label: 'City', value: city || '—' },
        { icon: <Map className="w-4 h-4" />, label: 'State', value: state || '—' },
        { icon: <MapPin className="w-4 h-4" />, label: 'PIN Code', value: pincode || '—' },
    ];

    return (
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-4 space-y-3 my-2">
            <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400 font-poppins">
                    Contact Details — Auto-filled ✨
                </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {fields.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-400/70 mt-0.5 shrink-0">{f.icon}</span>
                        <span className="text-gray-400 font-poppins w-32 shrink-0">{f.label}:</span>
                        <span className="text-white font-poppins font-medium break-words w-48">{f.value}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-green-400 font-poppins pt-1 font-medium">
                ✅ Updated! Verify and click <strong>Next</strong>.
            </p>
        </div>
    );
}
