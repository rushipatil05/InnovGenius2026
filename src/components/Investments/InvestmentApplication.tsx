import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronRight, PieChart } from 'lucide-react';
import styles from '../../styles';

import { InvestmentFormData, initialInvestmentData, RiskProfile } from './InvestmentTypes';
import StepRiskProfiler from './StepRiskProfiler';
import StepInvestPersonal from './StepInvestPersonal';
import StepInvestDetails from './StepInvestDetails';
import ReviewInvestment from './ReviewInvestment';

const steps = [
    { id: 1, title: 'Risk Profile', shortTitle: 'Profile' },
    { id: 2, title: 'KYC & Info', shortTitle: 'KYC' },
    { id: 3, title: 'Invest', shortTitle: 'Product' },
    { id: 4, title: 'Review', shortTitle: 'Summary' },
];

export default function InvestmentApplication({ onBack }: { onBack: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<InvestmentFormData>(initialInvestmentData);
    const [riskProfile, setRiskProfile] = useState<RiskProfile>(null);

    const updateFormData = (updates: Partial<InvestmentFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Calculate Risk Profile
    useEffect(() => {
        let score = 0;

        // Time Horizon
        if (formData.timeHorizon === '5+ Years') score += 3;
        else if (formData.timeHorizon === '3-5 Years') score += 2;
        else score += 1;

        // Risk Tolerance
        if (formData.riskTolerance === 'High') score += 3;
        else if (formData.riskTolerance === 'Medium') score += 2;
        else score += 1;

        // Expert bonus
        if (formData.experience === 'Expert') score += 1;

        // Determine Profile
        if (score >= 6) setRiskProfile('Aggressive');
        else if (score >= 4) setRiskProfile('Moderate');
        else setRiskProfile('Conservative');

    }, [formData.timeHorizon, formData.riskTolerance, formData.experience]);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepRiskProfiler data={formData} updateData={updateFormData} />;
            case 2: return <StepInvestPersonal data={formData} updateData={updateFormData} />;
            case 3: return <StepInvestDetails data={formData} updateData={updateFormData} />;
            case 4: return <ReviewInvestment data={formData} riskProfile={riskProfile} />;
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
                    <h2 className={styles.heading2}>Investment Portfolio</h2>
                    <p className={`${styles.paragraph} text-dimWhite text-sm`}>
                        Start your wealth creation journey with Aurora AI.
                    </p>
                </div>

                {/* Risk Profile Badge */}
                {riskProfile && currentStep > 1 && (
                    <div className="ml-auto bg-black-gradient p-2 px-4 rounded-xl border border-dimWhite/10 items-center space-x-3 hidden sm:flex">
                        <div className="text-right">
                            <p className="text-xs text-dimWhite uppercase tracking-wide">Your Profile</p>
                            <p className={`font-bold ${riskProfile === 'Aggressive' ? 'text-red-400' : riskProfile === 'Moderate' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                {riskProfile}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stepper UI */}
            <div className="hidden md:flex justify-between items-start w-full mb-12 px-2 relative">
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

            {/* Mobile Stepper */}
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
                                onClick={() => alert("Investment Account Opening Initiated!")}
                                className="bg-green-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>Complete KYC</span>
                                <PieChart className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
