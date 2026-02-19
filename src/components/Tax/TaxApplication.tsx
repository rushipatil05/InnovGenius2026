import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronRight, FileCheck } from 'lucide-react';
import styles from '../../styles';

import { TaxFormData, initialTaxData } from './TaxTypes';
import StepTaxBasic from './StepTaxBasic';
import StepTaxIncome from './StepTaxIncome';
import StepTaxDeductions from './StepTaxDeductions';
// Summary component inline or simple

const steps = [
    { id: 1, title: 'Filer Info', shortTitle: 'Basic' },
    { id: 2, title: 'Income Sources', shortTitle: 'Income' },
    { id: 3, title: 'Deductions', shortTitle: 'Tax Breaks' },
    { id: 4, title: 'Review & File', shortTitle: 'Review' },
];

export default function TaxApplication({ onBack }: { onBack: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<TaxFormData>(initialTaxData);
    const [taxSummary, setTaxSummary] = useState({
        grossIncome: 0,
        totalDeductions: 0,
        taxableIncome: 0,
        taxPayable: 0,
        netTax: 0 // +ve for Payable, -ve for Refund
    });

    const updateFormData = (updates: Partial<TaxFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        calculateTax();
    }, [formData]);

    const calculateTax = () => {
        const salary = Number(formData.salaryIncome) || 0;
        const business = Number(formData.businessIncome) || 0;
        const rental = Number(formData.rentalIncome) || 0;
        const gains = Number(formData.capitalGains) || 0;
        const other = Number(formData.interestIncome) || 0;

        const gross = salary + business + rental + gains + other;

        const d80c = Math.min(Number(formData.section80C) || 0, 150000);
        const d80d = Math.min(Number(formData.section80D) || 0, 50000); // simplified cap
        const dHome = Math.min(Number(formData.homeLoanInterest) || 0, 200000);
        const d80g = Number(formData.donations80G) || 0;

        const deductions = d80c + d80d + dHome + d80g;
        const taxable = Math.max(0, gross - deductions);

        // Simplified New Regime Slabs (Approx for estimation)
        let tax = 0;
        if (taxable > 300000) {
            if (taxable <= 600000) {
                tax += (taxable - 300000) * 0.05;
            } else {
                tax += 300000 * 0.05; // 3-6L
                if (taxable <= 900000) {
                    tax += (taxable - 600000) * 0.10;
                } else {
                    tax += 300000 * 0.10; // 6-9L
                    if (taxable <= 1200000) {
                        tax += (taxable - 900000) * 0.15;
                    } else {
                        tax += 300000 * 0.15; // 9-12L
                        if (taxable <= 1500000) {
                            tax += (taxable - 1200000) * 0.20;
                        } else {
                            tax += 300000 * 0.20; // 12-15L
                            tax += (taxable - 1500000) * 0.30;
                        }
                    }
                }
            }
        }

        // Cess 4%
        tax = tax * 1.04;

        const paid = (Number(formData.tdsPaid) || 0) + (Number(formData.advanceTaxPaid) || 0);
        const net = tax - paid;

        setTaxSummary({
            grossIncome: gross,
            totalDeductions: deductions,
            taxableIncome: taxable,
            taxPayable: tax,
            netTax: net
        });
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderSummary = () => (
        <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-4">Tax Calculation Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-dimWhite/10 flex justify-between">
                    <span className="text-dimWhite">Gross Income</span>
                    <span className="text-white font-bold">₹{taxSummary.grossIncome.toLocaleString()}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-dimWhite/10 flex justify-between">
                    <span className="text-dimWhite">Total Deductions</span>
                    <span className="text-white font-bold">- ₹{taxSummary.totalDeductions.toLocaleString()}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-dimWhite/10 flex justify-between">
                    <span className="text-dimWhite">Taxable Income</span>
                    <span className="text-white font-bold">₹{taxSummary.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-dimWhite/10 flex justify-between">
                    <span className="text-dimWhite">Total Tax Liability</span>
                    <span className="text-white font-bold">₹{taxSummary.taxPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
            </div>

            <div className={`mt-8 p-6 rounded-xl text-center border ${taxSummary.netTax > 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-green-500/10 border-green-500/50'}`}>
                <h4 className="text-lg font-bold text-white mb-2">
                    {taxSummary.netTax > 0 ? 'Tax Payable' : 'Refund Amount'}
                </h4>
                <p className={`text-4xl font-bold ${taxSummary.netTax > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    ₹{Math.abs(taxSummary.netTax).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-dimWhite mt-2">
                    {taxSummary.netTax > 0 ? 'Please pay the remaining tax to file ITR.' : 'This amount will be credited to your bank account.'}
                </p>
            </div>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepTaxBasic data={formData} updateData={updateFormData} />;
            case 2: return <StepTaxIncome data={formData} updateData={updateFormData} />;
            case 3: return <StepTaxDeductions data={formData} updateData={updateFormData} />;
            case 4: return renderSummary();
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
                    <h2 className={styles.heading2}>Tax Filing</h2>
                    <p className={`${styles.paragraph} text-dimWhite text-sm`}>
                        Simplified ITR filing and Tax Planning.
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
                                className="bg-blue-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>Next Step</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => alert("Proceeding to File ITR...")}
                                className="bg-green-gradient text-primary px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:opacity-90 transition"
                            >
                                <span>File ITR Now</span>
                                <FileCheck className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
