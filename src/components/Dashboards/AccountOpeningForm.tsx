import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { calculateRisk } from '../../utils/riskEngine';
import { Application } from '../../types';
import { ChevronRight, ChevronLeft, Save, CheckCircle, FileX2, FileCheck2, Paperclip } from 'lucide-react';


interface AccountOpeningFormProps {
    onSuccess: () => void;
}

interface AttachmentMap {
    pan?: File;
    aadhaar?: File;
    passport?: File;
    photo?: File;
    [key: string]: File | undefined;
}

export default function AccountOpeningForm({ onSuccess }: AccountOpeningFormProps) {
    const { user } = useAuth();
    const [attachments, setAttachments] = useState<AttachmentMap>({});
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const handleFileChange = (key: string, file: File | null) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowed.includes(file.type)) {
            alert('Only JPG, PNG, or PDF files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be under 5MB.');
            return;
        }
        setAttachments(prev => ({ ...prev, [key]: file }));
    };

    const removeFile = (key: string) => {
        setAttachments(prev => { const n = { ...prev }; delete n[key]; return n; });
        if (fileInputRefs.current[key]) fileInputRefs.current[key]!.value = '';
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const FileUploadBox = ({ docKey, label, accept = 'image/*,application/pdf', hint = 'JPG, PNG or PDF · Max 5MB' }: { docKey: string; label: string; accept?: string; hint?: string }) => {
        const file = attachments[docKey];
        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium text-dimWhite mb-2 font-poppins">{label}</label>
                {file ? (
                    <div className="flex items-center justify-between px-4 py-3 bg-cyan-400/10 border border-cyan-400/40 rounded-lg">
                        <div className="flex items-center space-x-3 min-w-0">
                            <FileCheck2 className="w-5 h-5 text-cyan-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm text-white font-poppins truncate max-w-[180px]">{file.name}</p>
                                <p className="text-xs text-dimWhite font-poppins">{formatBytes(file.size)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFile(docKey)}
                            className="ml-3 text-red-400 hover:text-red-300 transition-colors shrink-0"
                            title="Remove file"
                        >
                            <FileX2 className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div
                        className="border-2 border-dashed border-dimWhite/30 rounded-lg p-5 text-center cursor-pointer hover:bg-white/5 hover:border-cyan-400 transition-all flex flex-col items-center justify-center gap-2 bg-dimBlue/5 group"
                        onClick={() => fileInputRefs.current[docKey]?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-cyan-400', 'bg-white/5'); }}
                        onDragLeave={e => { e.currentTarget.classList.remove('border-cyan-400', 'bg-white/5'); }}
                        onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-cyan-400', 'bg-white/5'); const f = e.dataTransfer.files[0]; if (f) handleFileChange(docKey, f); }}
                    >
                        <Paperclip className="w-6 h-6 text-dimWhite/50 group-hover:text-cyan-400 transition-colors" />
                        <p className="text-sm text-dimWhite/70 font-poppins group-hover:text-white transition-colors">Click or drag &amp; drop to attach</p>
                        <p className="text-xs text-dimWhite/40 font-poppins">{hint}</p>
                    </div>
                )}
                <input
                    ref={el => { fileInputRefs.current[docKey] = el; }}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={e => handleFileChange(docKey, e.target.files?.[0] ?? null)}
                />
            </div>
        );
    };
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
        jointHolderName: '',
        jointHolderDob: '',
        jointHolderPan: '',
        jointHolderAadhaar: '',
        jointHolderRelation: '',
        jointHolderMobile: '',

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
                if (!formData.dob) {
                    newErrors.dob = 'Date of Birth is required';
                } else {
                    const today = new Date();
                    const dob = new Date(formData.dob);
                    const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
                    if (dob > today) newErrors.dob = 'Date of Birth cannot be in the future';
                    else if (age < 18) newErrors.dob = 'You must be at least 18 years old';
                }
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
                if (formData.modeOfOperation === 'joint') {
                    if (!(formData as any).jointHolderName) newErrors.jointHolderName = 'Joint holder name is required';
                    if (!(formData as any).jointHolderRelation) newErrors.jointHolderRelation = 'Relationship is required';
                    if (!(formData as any).jointHolderDob) newErrors.jointHolderDob = 'Joint holder date of birth is required';
                    if (!((formData as any).jointHolderMobile) || !/^[0-9]{10}$/.test((formData as any).jointHolderMobile || '')) newErrors.jointHolderMobile = 'Valid 10-digit mobile number is required';
                }
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

    const renderStepIndicator = () => {
        const steps = [
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Contact' },
            { num: 3, label: 'KYC' },
            { num: 4, label: 'Account' },
            { num: 5, label: 'Finance' },
            { num: 6, label: 'Nominee' },
            { num: 7, label: 'Services' },
        ];

        return (
            <div className="mb-12 font-poppins px-6 sm:px-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-5 transform -translate-y-1/2 w-full h-1 bg-dimWhite/10 -z-10 rounded-full"></div>
                    {steps.map((s) => (
                        <div key={s.num} className="relative flex flex-col items-center group cursor-default">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 z-10
                  ${step >= s.num ? 'bg-cyan-400 border-cyan-400 text-primary shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-primary border-dimWhite/20 text-dimWhite'}`}
                            >
                                {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.num}
                            </div>
                            <span className={`absolute top-12 text-[10px] md:text-xs font-medium whitespace-nowrap transition-colors duration-300 ${step >= s.num ? 'text-cyan-400' : 'text-dimWhite'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const inputClasses = "w-full px-4 py-3 bg-dimBlue/10 border border-dimWhite/20 rounded-lg text-white placeholder-dimWhite/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors font-poppins";
    const labelClasses = "block text-sm font-medium text-dimWhite mb-2 font-poppins";
    const selectClasses = "w-full px-4 py-3 bg-dimBlue/10 border border-dimWhite/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors font-poppins appearance-none cursor-pointer";

    return (
        <div className="w-full">
            <div className="py-2">
                {renderStepIndicator()}

                <div className="min-h-[400px] mt-8">
                    {/* Step 1: Personal Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">1. Personal Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Full Name</label>
                                    <input type="text" value={user?.name} disabled className={`${inputClasses} opacity-50 cursor-not-allowed`} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Date of Birth <span className="text-red-400">*</span></label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={e => handleChange('dob', e.target.value)}
                                        className={`${inputClasses} ${errors.dob ? 'border-red-500' : ''}`}
                                        style={{ colorScheme: 'dark' }}
                                        min="1900-01-01"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.dob && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.dob}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => handleChange('gender', e.target.value)}
                                        className={selectClasses}
                                    >
                                        <option value="male" className="bg-primary text-white">Male</option>
                                        <option value="female" className="bg-primary text-white">Female</option>
                                        <option value="other" className="bg-primary text-white">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Marital Status</label>
                                    <select
                                        value={formData.maritalStatus}
                                        onChange={e => handleChange('maritalStatus', e.target.value)}
                                        className={selectClasses}
                                    >
                                        <option value="single" className="bg-primary text-white">Single</option>
                                        <option value="married" className="bg-primary text-white">Married</option>
                                        <option value="divorced" className="bg-primary text-white">Divorced</option>
                                        <option value="widowed" className="bg-primary text-white">Widowed</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Father's / Mother's Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.parentsName}
                                        onChange={e => handleChange('parentsName', e.target.value)}
                                        className={`${inputClasses} ${errors.parentsName ? 'border-red-500' : ''}`}
                                        placeholder="Enter full name"
                                    />
                                    {errors.parentsName && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.parentsName}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Nationality</label>
                                    <input type="text" value={formData.nationality} onChange={e => handleChange('nationality', e.target.value)} className={inputClasses} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact Information */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">2. Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Mobile Number <span className="text-red-400">*</span></label>
                                    <input
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={e => handleChange('mobileNumber', e.target.value)}
                                        className={`${inputClasses} ${errors.mobileNumber ? 'border-red-500' : ''}`}
                                        maxLength={10}
                                        placeholder="9876543210"
                                    />
                                    {errors.mobileNumber && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.mobileNumber}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Email ID</label>
                                    <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className={inputClasses} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Current Address <span className="text-red-400">*</span></label>
                                    <textarea
                                        value={formData.currentAddress}
                                        onChange={e => handleChange('currentAddress', e.target.value)}
                                        className={`${inputClasses} ${errors.currentAddress ? 'border-red-500' : ''}`}
                                        rows={3}
                                    ></textarea>
                                    {errors.currentAddress && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.currentAddress}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) handleChange('permanentAddress', formData.currentAddress);
                                                else handleChange('permanentAddress', '');
                                            }}
                                            className="w-4 h-4 rounded text-cyan-400 bg-dimBlue/10 border-dimWhite/20 focus:ring-cyan-400 focus:ring-offset-0"
                                        />
                                        <span className="text-sm text-dimWhite group-hover:text-white transition-colors font-poppins">Permanent Address same as Current Address</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Permanent Address</label>
                                    <textarea
                                        value={formData.permanentAddress}
                                        onChange={e => handleChange('permanentAddress', e.target.value)}
                                        className={inputClasses}
                                        rows={3}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className={labelClasses}>City <span className="text-red-400">*</span></label>
                                    <input type="text" value={formData.city} onChange={e => handleChange('city', e.target.value)} className={`${inputClasses} ${errors.city ? 'border-red-500' : ''}`} />
                                    {errors.city && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>State <span className="text-red-400">*</span></label>
                                    <input type="text" value={formData.state} onChange={e => handleChange('state', e.target.value)} className={`${inputClasses} ${errors.state ? 'border-red-500' : ''}`} />
                                    {errors.state && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>PIN Code <span className="text-red-400">*</span></label>
                                    <input type="text" value={formData.pincode} onChange={e => handleChange('pincode', e.target.value)} className={`${inputClasses} ${errors.pincode ? 'border-red-500' : ''}`} />
                                    {errors.pincode && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.pincode}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Identity & KYC Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">3. Identity &amp; KYC Details</h3>

                            {/* Number fields */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>PAN Number <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.panNumber}
                                        onChange={e => handleChange('panNumber', e.target.value.toUpperCase())}
                                        className={`${inputClasses} uppercase ${errors.panNumber ? 'border-red-500' : ''}`}
                                        maxLength={10}
                                        placeholder="ABCDE1234F"
                                    />
                                    {errors.panNumber && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.panNumber}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Aadhaar Number <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.aadhaarNumber}
                                        onChange={e => handleChange('aadhaarNumber', e.target.value)}
                                        className={`${inputClasses} ${errors.aadhaarNumber ? 'border-red-500' : ''}`}
                                        maxLength={12}
                                        placeholder="1234 5678 9012"
                                    />
                                    {errors.aadhaarNumber && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.aadhaarNumber}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Passport Number (Optional)</label>
                                    <input type="text" value={formData.passportNumber} onChange={e => handleChange('passportNumber', e.target.value)} className={inputClasses} placeholder="A1234567" />
                                </div>
                            </div>

                            {/* Document Attachments */}
                            <div className="pt-2">
                                <p className="text-sm font-semibold text-white font-poppins mb-4 flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-cyan-400" />
                                    Document Attachments
                                    <span className="text-xs text-dimWhite/50 font-normal">(JPG, PNG or PDF · Max 5MB each)</span>
                                </p>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <FileUploadBox docKey="pan" label="PAN Card Copy" />
                                    <FileUploadBox docKey="aadhaar" label="Aadhaar Card Copy" />
                                    <FileUploadBox docKey="passport" label="Passport Copy (Optional)" hint="JPG, PNG or PDF · Max 5MB" />
                                    <FileUploadBox docKey="photo" label="Photograph" accept="image/*" hint="JPG or PNG · Max 5MB" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Account Details */}
                    {step === 4 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">4. Account Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Type of Account</label>
                                    <select
                                        value={formData.accountType}
                                        onChange={e => handleChange('accountType', e.target.value)}
                                        className={selectClasses}
                                    >
                                        <option value="savings" className="bg-primary text-white">Savings Account</option>
                                        <option value="current" className="bg-primary text-white">Current Account</option>
                                        <option value="salary" className="bg-primary text-white">Salary Account</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Branch Preference <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.branchPreference}
                                        onChange={e => handleChange('branchPreference', e.target.value)}
                                        className={`${inputClasses} ${errors.branchPreference ? 'border-red-500' : ''}`}
                                        placeholder="e.g. Mumbai Main Branch"
                                    />
                                    {errors.branchPreference && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.branchPreference}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Mode of Operation</label>
                                    <select
                                        value={formData.modeOfOperation}
                                        onChange={e => handleChange('modeOfOperation', e.target.value)}
                                        className={selectClasses}
                                    >
                                        <option value="self" className="bg-primary text-white">Self</option>
                                        <option value="joint" className="bg-primary text-white">Joint</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Initial Deposit Amount (₹) <span className="text-red-400">*</span></label>
                                    <input
                                        type="number"
                                        value={formData.initialDeposit}
                                        onChange={e => handleChange('initialDeposit', parseFloat(e.target.value))}
                                        className={`${inputClasses} ${errors.initialDeposit ? 'border-red-500' : ''}`}
                                        placeholder="Min 500"
                                    />
                                    {errors.initialDeposit && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.initialDeposit}</p>}
                                </div>
                            </div>

                            {/* Joint Account Holder Details */}
                            {formData.modeOfOperation === 'joint' && (
                                <div className="mt-2 border border-cyan-400/30 rounded-xl p-5 bg-cyan-400/5 space-y-5 animate-fadeIn">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                        <h4 className="text-sm font-semibold text-cyan-400 font-poppins tracking-wide uppercase">Joint Account Holder Details</h4>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClasses}>Full Name <span className="text-red-400">*</span></label>
                                            <input
                                                type="text"
                                                value={(formData as any).jointHolderName || ''}
                                                onChange={e => handleChange('jointHolderName', e.target.value)}
                                                className={`${inputClasses} ${errors.jointHolderName ? 'border-red-500' : ''}`}
                                                placeholder="Joint holder's full name"
                                            />
                                            {errors.jointHolderName && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.jointHolderName}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Relationship <span className="text-red-400">*</span></label>
                                            <select
                                                value={(formData as any).jointHolderRelation || ''}
                                                onChange={e => handleChange('jointHolderRelation', e.target.value)}
                                                className={`${selectClasses} ${errors.jointHolderRelation ? 'border-red-500' : ''}`}
                                            >
                                                <option value="" className="bg-primary text-white">Select Relationship</option>
                                                <option value="Spouse" className="bg-primary text-white">Spouse</option>
                                                <option value="Parent" className="bg-primary text-white">Parent</option>
                                                <option value="Sibling" className="bg-primary text-white">Sibling</option>
                                                <option value="Child" className="bg-primary text-white">Child</option>
                                                <option value="Business Partner" className="bg-primary text-white">Business Partner</option>
                                                <option value="Other" className="bg-primary text-white">Other</option>
                                            </select>
                                            {errors.jointHolderRelation && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.jointHolderRelation}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Date of Birth <span className="text-red-400">*</span></label>
                                            <input
                                                type="date"
                                                value={(formData as any).jointHolderDob || ''}
                                                onChange={e => handleChange('jointHolderDob', e.target.value)}
                                                className={`${inputClasses} ${errors.jointHolderDob ? 'border-red-500' : ''}`}
                                                style={{ colorScheme: 'dark' }}
                                                min="1900-01-01"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            {errors.jointHolderDob && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.jointHolderDob}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Mobile Number <span className="text-red-400">*</span></label>
                                            <input
                                                type="tel"
                                                value={(formData as any).jointHolderMobile || ''}
                                                onChange={e => handleChange('jointHolderMobile', e.target.value)}
                                                className={`${inputClasses} ${errors.jointHolderMobile ? 'border-red-500' : ''}`}
                                                maxLength={10}
                                                placeholder="9876543210"
                                            />
                                            {errors.jointHolderMobile && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.jointHolderMobile}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClasses}>PAN Number</label>
                                            <input
                                                type="text"
                                                value={(formData as any).jointHolderPan || ''}
                                                onChange={e => handleChange('jointHolderPan', e.target.value.toUpperCase())}
                                                className={`${inputClasses} uppercase`}
                                                maxLength={10}
                                                placeholder="ABCDE1234F"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Aadhaar Number</label>
                                            <input
                                                type="text"
                                                value={(formData as any).jointHolderAadhaar || ''}
                                                onChange={e => handleChange('jointHolderAadhaar', e.target.value)}
                                                className={inputClasses}
                                                maxLength={12}
                                                placeholder="1234 5678 9012"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-dimWhite/50 font-poppins pt-1">* The joint holder must visit the branch with original KYC documents for verification.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Employment & Financial Info */}
                    {step === 5 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">5. Employment & Financial Info</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Occupation</label>
                                    <select
                                        value={formData.employment}
                                        onChange={e => handleChange('employment', e.target.value)}
                                        className={selectClasses}
                                    >
                                        <option value="Student" className="bg-primary text-white">Student</option>
                                        <option value="Salaried" className="bg-primary text-white">Salaried</option>
                                        <option value="Self-Employed" className="bg-primary text-white">Self-Employed</option>
                                        <option value="Business" className="bg-primary text-white">Business</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Employer/Company Name</label>
                                    <input type="text" value={formData.employerName} onChange={e => handleChange('employerName', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Annual Income Range <span className="text-red-400">*</span></label>
                                    <select
                                        value={formData.annualIncome}
                                        onChange={e => handleChange('annualIncome', e.target.value)}
                                        className={`${selectClasses} ${errors.annualIncome ? 'border-red-500' : ''}`}
                                    >
                                        <option value="" className="bg-primary text-white">Select Range</option>
                                        <option value="<1L" className="bg-primary text-white">Less than 1 Lakh</option>
                                        <option value="1L-5L" className="bg-primary text-white">1 Lakh - 5 Lakhs</option>
                                        <option value="5L-10L" className="bg-primary text-white">5 Lakhs - 10 Lakhs</option>
                                        <option value=">10L" className="bg-primary text-white">More than 10 Lakhs</option>
                                    </select>
                                    {errors.annualIncome && <p className="text-red-400 text-xs mt-1 font-poppins">{errors.annualIncome}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Source of Funds</label>
                                    <input type="text" value={formData.sourceOfFunds} onChange={e => handleChange('sourceOfFunds', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Monthly Transactions (Approx) (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.monthlyTxn}
                                        onChange={e => handleChange('monthlyTxn', parseFloat(e.target.value))}
                                        className={inputClasses}
                                        placeholder="Estimated monthly usage"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Nominee Details */}
                    {step === 6 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">6. Nominee Details (Optional)</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Nominee Name</label>
                                    <input type="text" value={formData.nomineeName} onChange={e => handleChange('nomineeName', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Relationship</label>
                                    <input type="text" value={formData.nomineeRelation} onChange={e => handleChange('nomineeRelation', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Nominee DOB</label>
                                    <input type="date" value={formData.nomineeDob} onChange={e => handleChange('nomineeDob', e.target.value)} className={inputClasses} style={{ colorScheme: 'dark' }} min="1900-01-01" max={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Nominee Address</label>
                                    <textarea value={formData.nomineeAddress} onChange={e => handleChange('nomineeAddress', e.target.value)} className={inputClasses} rows={3}></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Services Selection */}
                    {step === 7 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white border-b border-dimWhite/20 pb-4 font-poppins">7. Services Selection</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'debitCard', label: 'Debit Card' },
                                    { id: 'netBanking', label: 'Net Banking' },
                                    { id: 'mobileBanking', label: 'Mobile Banking' },
                                    { id: 'chequeBook', label: 'Cheque Book' },
                                    { id: 'smsAlerts', label: 'SMS Alerts' },
                                ].map(service => (
                                    <div
                                        key={service.id}
                                        className={`border p-4 rounded-lg flex items-center justify-between hover:bg-white/5 transition cursor-pointer group ${formData.services?.[service.id as keyof typeof formData.services] ? 'border-cyan-400 bg-dimBlue/10' : 'border-dimWhite/20 bg-transparent'}`}
                                        onClick={() => handleChange(`services.${service.id}`, !formData.services?.[service.id as keyof typeof formData.services])}
                                    >
                                        <span className="font-medium text-white font-poppins">{service.label}</span>
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.services?.[service.id as keyof typeof formData.services] ? 'bg-cyan-400 border-cyan-400' : 'border-dimWhite/50 group-hover:border-white'}`}>
                                            {formData.services?.[service.id as keyof typeof formData.services] && <CheckCircle className="w-4 h-4 text-primary" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-lg">
                                <p className="text-sm text-yellow-300 font-poppins">
                                    By clicking "Submit Application", I hereby declare that the information provided is true and correct. I accept the Terms & Conditions of the bank.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-dimWhite/10">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition font-poppins
              ${step === 1 ? 'text-dimWhite/30 cursor-not-allowed' : 'text-dimWhite hover:text-white hover:bg-white/5'}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    {step < 7 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-2 px-6 py-2 bg-blue-gradient text-primary rounded-lg font-semibold hover:shadow-lg transition transform hover:-translate-y-1 font-poppins"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center space-x-2 px-8 py-2 bg-blue-gradient text-primary rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105 font-poppins"
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
