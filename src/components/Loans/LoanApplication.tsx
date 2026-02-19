import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronRight, Calculator } from 'lucide-react';
import styles from '../../styles';

import { LoanFormData, initialLoanData } from './LoanTypes';
import StepLoanSelection from './StepLoanSelection';
import StepPersonalDetails from './StepPersonalDetails';
import StepLoanEmployment from './StepLoanEmployment';
import StepLoanSpecifics from './StepLoanSpecifics';
import ReviewLoan from './ReviewLoan';

const steps = [
    { id: 1, title: 'Type', shortTitle: 'Type' },
    { id: 2, title: 'Personal', shortTitle: 'Info' },
    { id: 3, title: 'Employment', shortTitle: 'Work' },
    { id: 4, title: 'Details', shortTitle: 'Loan' },
    { id: 5, title: 'Review', shortTitle: 'Review' },
];

export default function LoanApplication({ onBack }: { onBack: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<LoanFormData>(initialLoanData);
    const [riskAnalysis, setRiskAnalysis] = useState<{ score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' }>({ score: 0, level: 'HIGH' });

    const updateFormData = (updates: Partial<LoanFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Calculate Risk whenever relevant data changes
    useEffect(() => {
        calculateRisk();
    }, [formData.monthlyIncome, formData.existingEmis, formData.creditScore, formData.loanAmount, formData.propertyValue]);

    const calculateRisk = () => {
        let probability = 50; // Base probability

        // 1. Credit Score Impact (Most significant)
        const cibil = Number(formData.creditScore);
        if (cibil > 750) probability += 30;
        else if (cibil > 650) probability += 10;
        else if (cibil > 0) probability -= 20;

        // 2. Debt-to-Income Ratio (DTI)
        const income = Number(formData.monthlyIncome);
        const emis = Number(formData.existingEmis);
        if (income > 0) {
            const dti = (emis / income) * 100;
            if (dti < 30) probability += 20;
            else if (dti > 50) probability -= 20;
        }

        // 3. Loan-To-Value (LTV) for Secured Loans
        if ((formData.loanType === 'Home' || formData.loanType === 'Vehicle') && formData.loanAmount) {
            const amount = Number(formData.loanAmount);
            const value = Number(formData.propertyValue || formData.vehiclePrice);
            if (value > 0) {
                const ltv = (amount / value) * 100;
                if (ltv < 80) probability += 10;
                else if (ltv > 90) probability -= 10;
            }
        }

        // 4. Employment Stability
        if (Number(formData.workExperience) > 3) probability += 10;

        // Clamp 0-99
        probability = Math.min(99, Math.max(1, probability));

        let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
        if (probability > 80) level = 'LOW'; // Low Risk = High Probability
        else if (probability > 50) level = 'MEDIUM';

        setRiskAnalysis({ score: probability, level });
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepLoanSelection data={formData} updateData={updateFormData} />;
            case 2: return <StepPersonalDetails data={formData} updateData={updateFormData} />;
            case 3: return <StepLoanEmployment data={formData} updateData={updateFormData} />;
            case 4: return <StepLoanSpecifics data={formData} updateData={updateFormData} />;
            case 5: return <ReviewLoan data={formData} riskScore={riskAnalysis} />;
            default: return null;
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: // Loan Type
                return !!formData.loanType;
            case 2: // Personal
                return !!formData.fullName && !!formData.mobile && !!formData.email;
            case 3: // Employment
                return !!formData.monthlyIncome;
            case 4: // Details
                return !!formData.loanAmount && !!formData.loanTenure;
            default:
                return true;
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
                    <h2 className={styles.heading2}>Loan Application</h2>
                    <p className={`${styles.paragraph} text-dimWhite text-sm`}>
                        Get instant approval with AI-powered assessment.
                    </p>
                </div>
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
                                disabled={!isStepValid()}
                                className={`px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition
                                    ${isStepValid()
                                        ? 'bg-blue-gradient text-primary hover:opacity-90'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}
                                `}
                            >
                                <span>Next Step</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => alert("Loan Application Submitted!")}
                                className="bg-green-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>Submit Application</span>
                                <Calculator className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
