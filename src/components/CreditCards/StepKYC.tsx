import { useState } from 'react';
import { ApplicationData } from './CreditCardTypes';
import { CheckCircle, Loader2, Camera, ShieldCheck, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

export default function StepKYC({ data, updateData }: StepProps) {
    const [verifying, setVerifying] = useState<string | null>(null);

    const simulateVerification = (method: 'DigiLocker' | 'Video') => {
        setVerifying(method);
        setTimeout(() => {
            updateData({ isKYCVerified: true, kycMethod: method });
            setVerifying(null);
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white/5 border border-dimWhite/10 rounded-xl p-6 text-center">
                <ShieldCheck className={`w-12 h-12 mx-auto mb-4 ${data.isKYCVerified ? 'text-green-400' : 'text-dimWhite'}`} />
                <h3 className="text-xl font-bold text-white mb-2">
                    {data.isKYCVerified ? 'KYC Verified Successfully' : 'Complete Your KYC'}
                </h3>
                <p className="text-dimWhite text-sm max-w-md mx-auto">
                    {data.isKYCVerified
                        ? 'Your identity has been verified. You can proceed to the next step.'
                        : 'Choose a method to verify your identity instantly. This is required for credit card approval.'}
                </p>
            </div>

            {!data.isKYCVerified && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* DigiLocker */}
                    <button
                        onClick={() => simulateVerification('DigiLocker')}
                        disabled={!!verifying}
                        className="group relative p-6 rounded-xl border border-dimWhite/10 bg-white/5 hover:bg-white/10 transition flex flex-col items-center disabled:opacity-50"
                    >
                        <FileCheck className="w-10 h-10 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-white mb-1">Via DigiLocker</h4>
                        <p className="text-xs text-dimWhite">Fetch Aadhaar & Pan instantly</p>
                        {verifying === 'DigiLocker' && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                            </div>
                        )}
                    </button>

                    {/* Video KYC */}
                    <button
                        onClick={() => simulateVerification('Video')}
                        disabled={!!verifying}
                        className="group relative p-6 rounded-xl border border-dimWhite/10 bg-white/5 hover:bg-white/10 transition flex flex-col items-center disabled:opacity-50"
                    >
                        <Camera className="w-10 h-10 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-white mb-1">Video KYC</h4>
                        <p className="text-xs text-dimWhite">Quick video call with agent</p>
                        {verifying === 'Video' && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                            </div>
                        )}
                    </button>
                </div>
            )}

            {data.isKYCVerified && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center space-x-3"
                >
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                        <p className="text-white font-medium">Verification Complete</p>
                        <p className="text-xs text-green-200">
                            Verified via {data.kycMethod} on {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
