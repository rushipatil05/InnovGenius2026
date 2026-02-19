import { useState } from 'react';
// Imports verified
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import styles from '../../styles';
import StepCardSelection from './StepCardSelection';
import StepPersonalDetails from './StepPersonalDetails';
import StepAddressDetails from './StepAddressDetails';
import StepEmployment from './StepEmployment';
import StepFinancial from './StepFinancial';
import StepKYC from './StepKYC';
import StepPreferences from './StepPreferences';
import ReviewApplication from './ReviewApplication';

import { ApplicationData } from './CreditCardTypes';

// Remaining logic...


const initialData: ApplicationData = {
    cardType: null,
    fullName: '',
    dob: '',
    pan: '',
    mobile: '',
    email: '',
    maritalStatus: '',
    currentAddress: '',
    residenceType: '',
    yearsAtAddress: '',
    isPermanentSame: true,
    permanentAddress: '',
    employmentType: 'Salaried',
    companyName: '',
    designation: '',
    workExperience: '',
    businessName: '',
    industry: '',
    annualTurnover: '',
    businessVintage: '',
    collegeName: '',
    graduationYear: '',
    monthlyIncome: '',
    existingEmis: '',
    existingCreditCards: false,
    requestedLimit: '',
    otherIncome: '',
    isKYCVerified: false,
    kycMethod: null,
    billingCycle: '1st of month',
    addOnCard: false,
    deliveryAddress: 'Current',
    spendingPreferences: [],
};

const steps = [
    { id: 1, title: 'Select Card', shortTitle: 'Card' },
    { id: 2, title: 'Personal Info', shortTitle: 'Personal' },
    { id: 3, title: 'Address', shortTitle: 'Address' },
    { id: 4, title: 'Employment', shortTitle: 'Work' },
    { id: 5, title: 'Financial', shortTitle: 'Finance' },
    { id: 6, title: 'KYC', shortTitle: 'KYC' },
    { id: 7, title: 'Preferences', shortTitle: 'Services' },
    { id: 8, title: 'Review', shortTitle: 'Review' },
];

export default function CreditCardApplication({ onBack }: { onBack: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ApplicationData>(initialData);
    const [riskScore, setRiskScore] = useState<number | null>(null);

    const updateFormData = (updates: Partial<ApplicationData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
        calculateRiskScore({ ...formData, ...updates });
    };

    const calculateRiskScore = (data: ApplicationData) => {
        // Simple mock logic for dynamic risk score updates
        let score = 50;
        if (data.monthlyIncome && parseInt(data.monthlyIncome) > 50000) score += 20;
        if (data.existingCreditCards) score += 10;
        if (data.employmentType === 'Salaried') score += 10;
        if (data.residenceType === 'Owned') score += 10;

        setRiskScore(Math.min(100, score));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepCardSelection data={formData} updateData={updateFormData} />;
            case 2: return <StepPersonalDetails data={formData} updateData={updateFormData} />;
            case 3: return <StepAddressDetails data={formData} updateData={updateFormData} />;
            case 4: return <StepEmployment data={formData} updateData={updateFormData} />;
            case 5: return <StepFinancial data={formData} updateData={updateFormData} />;
            case 6: return <StepKYC data={formData} updateData={updateFormData} />;
            case 7: return <StepPreferences data={formData} updateData={updateFormData} />;
            case 8: return <ReviewApplication data={formData} riskScore={riskScore} />;
            default: return null;
        }
    };

    return (
        <div className="w-full text-white">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className={styles.heading2}>details</h2>
                    <p className={`${styles.paragraph} text-dimWhite text-sm`}>
                        Please fill the form below to receive your card.
                    </p>
                </div>

                {/* Risk Score Widget (visible after step 4) */}
                {currentStep > 4 && riskScore !== null && (
                    <div className="ml-auto bg-black-gradient p-3 rounded-xl border border-dimWhite/10 flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-xs text-dimWhite">Estimated Approval Chance</p>
                            <p className={`font-bold ${riskScore > 70 ? 'text-green-400' : riskScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {riskScore > 70 ? 'Excellent' : riskScore > 40 ? 'Good' : 'Fair'}
                            </p>
                        </div>
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#444"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={riskScore > 70 ? '#4ade80' : riskScore > 40 ? '#facc15' : '#f87171'}
                                    strokeWidth="3"
                                    strokeDasharray={`${riskScore}, 100`}
                                />
                            </svg>
                            <span className="absolute text-[10px] font-bold">{riskScore}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Stepper UI */}
            <div className="hidden md:flex justify-between items-start w-full mb-12 px-2 relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 w-full px-8">
                    <div className="h-[2px] w-full bg-[#2e2343]" />
                    <motion.div
                        className="h-[2px] bg-[#33bbcf] absolute top-0 left-8"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div
                            key={step.id}
                            className="flex flex-col items-center relative z-10 cursor-pointer group"
                            onClick={() => isCompleted && setCurrentStep(step.id)}
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isActive ? '#33bbcf' : '#1a103d',
                                    borderColor: isActive ? '#33bbcf' : '#3d2c6e',
                                    boxShadow: isActive ? '0 0 20px rgba(51, 187, 207, 0.6)' : 'none'
                                }}
                                className={`w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm mb-3 border-2 transition-colors duration-300
                                    ${isCompleted ? 'text-[#33bbcf] border-[#33bbcf]' : 'text-white'}
                                    ${isActive ? 'text-primary' : ''}
                                `}
                            >
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
                            </motion.div>
                            <span className={`text-xs font-semibold tracking-wide uppercase transition-colors duration-300
                                ${isActive ? 'text-[#33bbcf] drop-shadow-[0_0_5px_rgba(51,187,207,0.5)]' : isCompleted ? 'text-[#33bbcf]/80' : 'text-dimWhite'}
                            `}>
                                {step.shortTitle}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Mobile Stepper (Simple Text) */}
            <div className="md:hidden flex justify-between items-center mb-6 bg-[#1a103d] p-4 rounded-xl border border-[#3d2c6e]">
                <span className="text-[#33bbcf] font-bold">Step {currentStep}</span>
                <span className="text-white text-sm">{steps[currentStep - 1].shortTitle}</span>
                <span className="text-dimWhite text-xs">of {steps.length}</span>
            </div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-black-gradient rounded-[20px] p-6 sm:p-10 border border-dimWhite/10 shadow-lg min-h-[400px]"
                >
                    {renderStep()}

                    <div className="flex justify-between mt-8 pt-6 border-t border-dimWhite/10">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-6 py-2 rounded-lg font-medium transition ${currentStep === 1
                                ? 'text-dimWhite cursor-not-allowed'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            Back
                        </button>

                        {currentStep < steps.length ? (
                            <button
                                onClick={nextStep}
                                className="bg-blue-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>Next Step</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => alert("Application Submitted!")}
                                className="bg-green-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>Submit Application</span>
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
