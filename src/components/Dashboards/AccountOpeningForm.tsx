import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { calculateRisk } from '../../utils/riskEngine';
import { Application } from '../../types';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Upload } from 'lucide-react';

interface AccountOpeningFormProps {
    onSuccess: () => void;
}

export default function AccountOpeningForm({ onSuccess }: AccountOpeningFormProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Application>>({
        // Personal
        dob: '',
        gender: 'male',
        maritalStatus: 'single',
        parentsName: '',
        nationality: 'Indian',

        // Contact
        mobileNumber: '',
        email: user?.email || '',
        currentAddress: '',
        permanentAddress: '',
        city: '',
        state: '',
        pincode: '',

        // KYC
        panNumber: '',
        aadhaarNumber: '',
        passportNumber: '',

        // Account
        accountType: 'savings',
        branchPreference: '',
        modeOfOperation: 'self',
        initialDeposit: 0,

        // Financial
        employment: 'Salaried',
        employerName: '',
        annualIncome: '',
        sourceOfFunds: 'Salary',
        monthlyTxn: 0,

        // Nominee
        nomineeName: '',
        nomineeRelation: '',
        nomineeDob: '',
        nomineeAddress: '',

        // Services
        services: {
            debitCard: true,
            netBanking: true,
            mobileBanking: true,
            chequeBook: false,
            smsAlerts: true,
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, string> = {};

        switch (currentStep) {
            case 1: // Personal
                if (!formData.dob) newErrors.dob = 'Date of Birth is required';
                if (!formData.parentsName) newErrors.parentsName = "Father's/Mother's Name is required";
                break;
            case 2: // Contact
                if (!formData.mobileNumber || !/^[0-9]{10}$/.test(formData.mobileNumber || '')) newErrors.mobileNumber = 'Valid 10-digit Mobile Number is required';
                if (!formData.currentAddress) newErrors.currentAddress = 'Current Address is required';
                if (!formData.city) newErrors.city = 'City is required';
                if (!formData.state) newErrors.state = 'State is required';
                if (!formData.pincode) newErrors.pincode = 'PIN Code is required';
                break;
            case 3: // KYC
                if (!formData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber || '')) newErrors.panNumber = 'Valid PAN Number is required';
                if (!formData.aadhaarNumber || !/^[0-9]{12}$/.test(formData.aadhaarNumber || '')) newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar Number is required';
                break;
            case 4: // Account
                if (!formData.branchPreference) newErrors.branchPreference = 'Branch Preference is required';
                if (!formData.initialDeposit || formData.initialDeposit < 500) newErrors.initialDeposit = 'Minimum deposit of ₹500 is required';
                break;
            case 5: // Financial
                if (formData.employment !== 'Student' && !formData.annualIncome) newErrors.annualIncome = 'Annual Income is required';
                break;
            // Nominee and Services are optional or have defaults
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleChange = (field: keyof Application | string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // Clear error
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        if (!validateStep(step)) return;

        // Final calculations
        const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber || '');
        const isAadhaarValid = /^[0-9]{12}$/.test(formData.aadhaarNumber || '');

        const riskResult = calculateRisk({
            monthlyTxn: formData.monthlyTxn || 0,
            employment: formData.employment || 'Salaried',
            isPanValid,
            isAadhaarValid,
        });

        const application: Application = {
            ...formData as Application, // Cast because we know we filled required fields or defaults
            id: Date.now().toString(),
            userId: user!.id,
            userName: user!.name,
            userEmail: user!.email,
            employment: formData.employment || 'Salaried',
            isPanValid,
            isAadhaarValid,
            status: 'pending',
            riskScore: riskResult.score,
            riskCategory: riskResult.category,
            riskReasons: riskResult.reasons,
            submittedAt: new Date().toISOString(),
        };

        storage.addApplication(application);
        storage.addAuditLog({
            id: Date.now().toString(),
            action: 'APPLICATION_SUBMITTED',
            userId: user!.id,
            userName: user!.name,
            details: `Account Opening Application submitted`,
            timestamp: new Date().toISOString(),
            applicationId: application.id,
        });

        onSuccess();
    };

    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                    <div
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300
              ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                        {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                <span>Personal</span>
                <span>Contact</span>
                <span>KYC</span>
                <span>Account</span>
                <span>Finance</span>
                <span>Nominee</span>
                <span>Services</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Account Opening Form</h2>
                <p className="opacity-90">Please fill in your details correctly to open your account.</p>
            </div>

            <div className="p-8">
                {renderStepIndicator()}

                <div className="min-h-[400px]">
                    {/* Step 1: Personal Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">1. Personal Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" value={user?.name} disabled className="w-full px-4 py-2 bg-gray-100 border rounded-lg cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={e => handleChange('dob', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => handleChange('gender', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                    <select
                                        value={formData.maritalStatus}
                                        onChange={e => handleChange('maritalStatus', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                        <option value="widowed">Widowed</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's / Mother's Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.parentsName}
                                        onChange={e => handleChange('parentsName', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.parentsName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter full name"
                                    />
                                    {errors.parentsName && <p className="text-red-500 text-xs mt-1">{errors.parentsName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                    <input type="text" value={formData.nationality} onChange={e => handleChange('nationality', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact Information */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">2. Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={e => handleChange('mobileNumber', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                                        maxLength={10}
                                        placeholder="9876543210"
                                    />
                                    {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                    <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={formData.currentAddress}
                                        onChange={e => handleChange('currentAddress', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.currentAddress ? 'border-red-500' : 'border-gray-300'}`}
                                        rows={3}
                                    ></textarea>
                                    {errors.currentAddress && <p className="text-red-500 text-xs mt-1">{errors.currentAddress}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) handleChange('permanentAddress', formData.currentAddress);
                                                else handleChange('permanentAddress', '');
                                            }}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Permanent Address same as Current Address</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                                    <textarea
                                        value={formData.permanentAddress}
                                        onChange={e => handleChange('permanentAddress', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        rows={3}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.city} onChange={e => handleChange('city', e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.state} onChange={e => handleChange('state', e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.pincode} onChange={e => handleChange('pincode', e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Identity & KYC Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">3. Identity & KYC Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number <span className="text-red-500">*</span></label>
                                    <div className="relative" title="Upload Document">
                                        <input
                                            type="text"
                                            value={formData.panNumber}
                                            onChange={e => handleChange('panNumber', e.target.value.toUpperCase())}
                                            className={`w-full px-4 py-2 border rounded-lg uppercase ${errors.panNumber ? 'border-red-500' : 'border-gray-300'}`}
                                            maxLength={10}
                                            placeholder="ABCDE1234F"
                                        />
                                        <div className="absolute right-3 top-2 text-gray-400">
                                            <Upload className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                                        </div>
                                    </div>
                                    {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number <span className="text-red-500">*</span></label>
                                    <div className="relative" title="Upload Document">
                                        <input
                                            type="text"
                                            value={formData.aadhaarNumber}
                                            onChange={e => handleChange('aadhaarNumber', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg ${errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'}`}
                                            maxLength={12}
                                        />
                                        <div className="absolute right-3 top-2 text-gray-400">
                                            <Upload className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                                        </div>
                                    </div>
                                    {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number (Optional)</label>
                                    <input type="text" value={formData.passportNumber} onChange={e => handleChange('passportNumber', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photograph</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center h-[100px]">
                                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload photo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Account Details */}
                    {step === 4 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">4. Account Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type of Account</label>
                                    <select
                                        value={formData.accountType}
                                        onChange={e => handleChange('accountType', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="savings">Savings Account</option>
                                        <option value="current">Current Account</option>
                                        <option value="salary">Salary Account</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Preference <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.branchPreference}
                                        onChange={e => handleChange('branchPreference', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg ${errors.branchPreference ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="e.g. Mumbai Main Branch"
                                    />
                                    {errors.branchPreference && <p className="text-red-500 text-xs mt-1">{errors.branchPreference}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Operation</label>
                                    <select
                                        value={formData.modeOfOperation}
                                        onChange={e => handleChange('modeOfOperation', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="self">Self</option>
                                        <option value="joint">Joint</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit Amount (₹) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={formData.initialDeposit}
                                        onChange={e => handleChange('initialDeposit', parseFloat(e.target.value))}
                                        className={`w-full px-4 py-2 border rounded-lg ${errors.initialDeposit ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Min 500"
                                    />
                                    {errors.initialDeposit && <p className="text-red-500 text-xs mt-1">{errors.initialDeposit}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Employment & Financial Info */}
                    {step === 5 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">5. Employment & Financial Info</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                    <select
                                        value={formData.employment}
                                        onChange={e => handleChange('employment', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Salaried">Salaried</option>
                                        <option value="Self-Employed">Self-Employed</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer/Company Name</label>
                                    <input type="text" value={formData.employerName} onChange={e => handleChange('employerName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income Range <span className="text-red-500">*</span></label>
                                    <select
                                        value={formData.annualIncome}
                                        onChange={e => handleChange('annualIncome', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none bg-white ${errors.annualIncome ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select Range</option>
                                        <option value="<1L">Less than 1 Lakh</option>
                                        <option value="1L-5L">1 Lakh - 5 Lakhs</option>
                                        <option value="5L-10L">5 Lakhs - 10 Lakhs</option>
                                        <option value=">10L">More than 10 Lakhs</option>
                                    </select>
                                    {errors.annualIncome && <p className="text-red-500 text-xs mt-1">{errors.annualIncome}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Source of Funds</label>
                                    <input type="text" value={formData.sourceOfFunds} onChange={e => handleChange('sourceOfFunds', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Transactions (Approx) (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.monthlyTxn}
                                        onChange={e => handleChange('monthlyTxn', parseFloat(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Estimated monthly usage"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Nominee Details */}
                    {step === 6 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">6. Nominee Details (Optional)</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Name</label>
                                    <input type="text" value={formData.nomineeName} onChange={e => handleChange('nomineeName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                    <input type="text" value={formData.nomineeRelation} onChange={e => handleChange('nomineeRelation', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominee DOB</label>
                                    <input type="date" value={formData.nomineeDob} onChange={e => handleChange('nomineeDob', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Address</label>
                                    <textarea value={formData.nomineeAddress} onChange={e => handleChange('nomineeAddress', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Services Selection */}
                    {step === 7 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">7. Services Selection</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'debitCard', label: 'Debit Card' },
                                    { id: 'netBanking', label: 'Net Banking' },
                                    { id: 'mobileBanking', label: 'Mobile Banking' },
                                    { id: 'chequeBook', label: 'Cheque Book' },
                                    { id: 'smsAlerts', label: 'SMS Alerts' },
                                ].map(service => (
                                    <div key={service.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => handleChange(`services.${service.id}`, !formData.services?.[service.id as keyof typeof formData.services])}>
                                        <span className="font-medium text-gray-700">{service.label}</span>
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.services?.[service.id as keyof typeof formData.services] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                            {formData.services?.[service.id as keyof typeof formData.services] && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    By clicking "Submit Application", I hereby declare that the information provided is true and correct. I accept the Terms & Conditions of the bank.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition
              ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    {step < 7 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center space-x-2 px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg transform hover:scale-105"
                        >
                            <Save className="w-4 h-4" />
                            <span>Submit Application</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
