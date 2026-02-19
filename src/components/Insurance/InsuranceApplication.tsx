import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import styles from '../../styles';

import { InsuranceFormData, initialInsuranceData } from './InsuranceTypes';
import StepPolicySelection from './StepPolicySelection';
import StepPersonalDetails from './StepPersonalDetails';
import StepHealthLifestyle from './StepHealthLifestyle';
import StepEmployment from './StepEmployment';
import StepPolicyDetails from './StepPolicyDetails';
import ReviewPolicy from './ReviewPolicy';
import StepKYC from '../CreditCards/StepKYC'; // Reusing KYC component

const steps = [
    { id: 1, title: 'Select Plan', shortTitle: 'Plan' },
    { id: 2, title: 'Personal Info', shortTitle: 'Personal' },
    { id: 3, title: 'Employment', shortTitle: 'Work' },
    { id: 4, title: 'Health', shortTitle: 'Health' }, // Swapped to match flow better
    { id: 5, title: 'Policy Details', shortTitle: 'Details' },
    { id: 6, title: 'KYC', shortTitle: 'KYC' },
    { id: 7, title: 'Review', shortTitle: 'Review' },
];

export default function InsuranceApplication({ onBack }: { onBack: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<InsuranceFormData>(initialInsuranceData);
    const [riskScore, setRiskScore] = useState<number>(0);

    const updateFormData = (updates: Partial<InsuranceFormData>) => {
        const newData = { ...formData, ...updates };
        setFormData(newData);
        calculateRiskScore(newData);
    };

    // Aurora Engine Risk Logic
    const calculateRiskScore = (data: InsuranceFormData) => {
        let score = 10; // Base Score

        // Age Factor
        const age = new Date().getFullYear() - new Date(data.dob).getFullYear();
        if (age > 45) score += 15;
        else if (age > 30) score += 5;

        // BMI Factor
        if (data.height && data.weight) {
            const h = Number(data.height) / 100;
            const bmi = Number(data.weight) / (h * h);
            if (bmi > 30 || bmi < 18.5) score += 10;
        }

        // Lifestyle Factors
        if (data.isSmoker) score += 25; // High impact
        if (data.alcoholConsumption === 'Regular') score += 10;

        // Medical History
        if (data.hasMedicalHistory) score += 20;
        if (data.familyMedicalHistory?.length > 5) score += 5;

        // Coverage vs Income Ratio (Financial Risk)
        if (data.coverageAmount && data.annualIncome) {
            const coverage = Number(data.coverageAmount);
            const income = Number(data.annualIncome);
            if (coverage > income * 20) score += 15; // Over-insurance risk
        }

        setRiskScore(Math.min(100, score));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepPolicySelection data={formData} updateData={updateFormData} />;
            case 2: return <StepPersonalDetails data={formData} updateData={updateFormData} />;
            case 3: return <StepEmployment data={formData} updateData={updateFormData} />;
            case 4: return <StepHealthLifestyle data={formData} updateData={updateFormData} />;
            case 5: return <StepPolicyDetails data={formData} updateData={updateFormData} />;
            case 6: return <StepKYC data={formData as any} updateData={updateFormData as any} />; // Casting because Types might slightly differ but are compatible for KYC fields
            case 7: return <ReviewPolicy data={formData} riskScore={riskScore} />;
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
                    <h2 className={styles.heading2}>Insurance Application</h2>
                    <p className={`${styles.paragraph} text-dimWhite text-sm`}>
                        Secure your future with our AI-driven plans.
                    </p>
                </div>

                {/* Risk Score Widget (visible after relevant steps) */}
                {currentStep > 4 && (
                    <div className="ml-auto bg-black-gradient p-3 rounded-xl border border-dimWhite/10 items-center space-x-3 hidden sm:flex">
                        <div className="text-right">
                            <p className="text-xs text-dimWhite">Aurora Risk Score</p>
                            <p className={`font-bold ${riskScore < 30 ? 'text-green-400' : riskScore < 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {riskScore < 30 ? 'Low Risk' : riskScore < 60 ? 'Medium Risk' : 'High Risk'}
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
                                    stroke={riskScore < 30 ? '#4ade80' : riskScore < 60 ? '#facc15' : '#f87171'}
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
                                onClick={() => alert("Policy Application Submitted!")}
                                className="bg-green-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>Submit Policy</span>
                                <ShieldCheck className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
