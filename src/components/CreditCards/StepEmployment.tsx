import { ApplicationData, EmploymentType } from './CreditCardTypes';
import { Briefcase, Building2, UserCheck, GraduationCap, DollarSign, Calendar } from 'lucide-react';

interface StepProps {
    data: ApplicationData;
    updateData: (data: Partial<ApplicationData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepEmployment({ data, updateData }: StepProps) {
    const tabs: EmploymentType[] = ['Salaried', 'Self-Employed', 'Student'];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6 border-b border-dimWhite/10 pb-4">
                {tabs.map((type) => (
                    <button
                        key={type}
                        onClick={() => updateData({ employmentType: type })}
                        className={`px-4 py-2 rounded-full font-medium transition ${data.employmentType === type
                            ? 'bg-secondary text-primary'
                            : 'bg-white/5 text-dimWhite hover:bg-white/10'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salaried Fields */}
                {data.employmentType === 'Salaried' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <Building2 className="w-4 h-4" />
                                <span>Company Name</span>
                            </label>
                            <input
                                type="text"
                                value={data.companyName}
                                onChange={(e) => updateData({ companyName: e.target.value })}
                                className={inputClass}
                                placeholder="Google India Pvt Ltd"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <UserCheck className="w-4 h-4" />
                                <span>Designation</span>
                            </label>
                            <input
                                type="text"
                                value={data.designation}
                                onChange={(e) => updateData({ designation: e.target.value })}
                                className={inputClass}
                                placeholder="Senior Software Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Work Experience (Years)</span>
                            </label>
                            <input
                                type="number"
                                value={data.workExperience}
                                onChange={(e) => updateData({ workExperience: e.target.value })}
                                className={inputClass}
                                placeholder="5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <DollarSign className="w-4 h-4" />
                                <span>Monthly Income</span>
                            </label>
                            <input
                                type="number"
                                value={data.monthlyIncome}
                                onChange={(e) => updateData({ monthlyIncome: e.target.value })}
                                className={inputClass}
                                placeholder="100000"
                            />
                        </div>
                    </>
                )}

                {/* Self-Employed Fields */}
                {data.employmentType === 'Self-Employed' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <Briefcase className="w-4 h-4" />
                                <span>Business Name</span>
                            </label>
                            <input
                                type="text"
                                value={data.businessName}
                                onChange={(e) => updateData({ businessName: e.target.value })}
                                className={inputClass}
                                placeholder="Your Business Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <Building2 className="w-4 h-4" />
                                <span>Industry Type</span>
                            </label>
                            <select
                                value={data.industry}
                                onChange={(e) => updateData({ industry: e.target.value })}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="">Select Industry</option>
                                <option value="Retail">Retail</option>
                                <option value="IT">IT Services</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Logistics">Logistics</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <DollarSign className="w-4 h-4" />
                                <span>Annual Turnover</span>
                            </label>
                            <input
                                type="number"
                                value={data.annualTurnover}
                                onChange={(e) => updateData({ annualTurnover: e.target.value })}
                                className={inputClass}
                                placeholder="5000000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Business Vintage (Years)</span>
                            </label>
                            <input
                                type="number"
                                value={data.businessVintage}
                                onChange={(e) => updateData({ businessVintage: e.target.value })}
                                className={inputClass}
                                placeholder="3"
                            />
                        </div>
                    </>
                )}

                {/* Student Fields */}
                {data.employmentType === 'Student' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>College/University Name</span>
                            </label>
                            <input
                                type="text"
                                value={data.collegeName}
                                onChange={(e) => updateData({ collegeName: e.target.value })}
                                className={inputClass}
                                placeholder="IIT Bombay"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-dimWhite font-medium flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Graduation Year</span>
                            </label>
                            <input
                                type="text"
                                value={data.graduationYear}
                                onChange={(e) => updateData({ graduationYear: e.target.value })}
                                className={inputClass}
                                placeholder="2025"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
