import { InsuranceFormData } from './InsuranceTypes';
import { Activity, Cigarette, Wine, AlertCircle, Pill, FileText, Users } from 'lucide-react';

interface StepProps {
    data: InsuranceFormData;
    updateData: (updates: Partial<InsuranceFormData>) => void;
}

const inputClass = "w-full bg-primary border border-dimWhite/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition";

export default function StepHealthLifestyle({ data, updateData }: StepProps) {
    return (
        <div className="space-y-8">
            <div className="bg-white/5 p-4 rounded-lg border border-yellow-500/20 mb-6 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <div>
                    <h4 className="text-yellow-500 font-bold text-sm uppercase">Underwriting Impact</h4>
                    <p className="text-dimWhite text-xs mt-1">
                        Accurate health details ensure your claim won't be rejected later.
                        Discrepancies may lead to policy cancellation.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>Height (cm)</span>
                    </label>
                    <input
                        type="number"
                        value={data.height}
                        onChange={(e) => updateData({ height: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 175"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>Weight (kg)</span>
                    </label>
                    <input
                        type="number"
                        value={data.weight}
                        onChange={(e) => updateData({ weight: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 70"
                    />
                </div>

                <div className="space-y-4 pt-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Cigarette className="w-4 h-4 text-orange-400" />
                        <span>Do you smoke or consume tobacco?</span>
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => updateData({ isSmoker: true })}
                            className={`flex-1 py-2 rounded-lg border transition ${data.isSmoker ? 'bg-secondary text-primary border-secondary font-bold' : 'border-dimWhite/20 text-dimWhite hover:bg-white/5'}`}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => updateData({ isSmoker: false })}
                            className={`flex-1 py-2 rounded-lg border transition ${!data.isSmoker ? 'bg-green-500/20 text-green-400 border-green-500/50 font-bold' : 'border-dimWhite/20 text-dimWhite hover:bg-white/5'}`}
                        >
                            No
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                        <Wine className="w-4 h-4 text-purple-400" />
                        <span>Alcohol Consumption</span>
                    </label>
                    <select
                        value={data.alcoholConsumption}
                        onChange={(e) => updateData({ alcoholConsumption: e.target.value as any })}
                        className={`${inputClass} appearance-none`}
                    >
                        <option value="None">None</option>
                        <option value="Occasional">Occasional (Socially)</option>
                        <option value="Regular">Regular</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-dimWhite/10">
                <h3 className="text-lg font-semibold text-white">Medical History</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-dimWhite font-medium text-sm">Do you have any pre-existing medical conditions?</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateData({ hasMedicalHistory: true })}
                                className={`px-4 py-1 rounded-md text-sm border transition ${data.hasMedicalHistory ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'border-dimWhite/20 text-dimWhite'}`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => updateData({ hasMedicalHistory: false })}
                                className={`px-4 py-1 rounded-md text-sm border transition ${!data.hasMedicalHistory ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'border-dimWhite/20 text-dimWhite'}`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>

                {data.hasMedicalHistory && (
                    <div className="animate-fade-in-down">
                        <label className="text-dimWhite font-medium text-xs mb-2 block">Please provide details (Condition, Year of Diagnosis, Treatment)</label>
                        <textarea
                            value={data.medicalHistoryDetails}
                            onChange={(e) => updateData({ medicalHistoryDetails: e.target.value })}
                            className={`${inputClass} min-h-[80px]`}
                            placeholder="e.g. Type 2 Diabetes diagnosed in 2018, currently on oral medication."
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Family Medical History</span>
                        </label>
                        <input
                            type="text"
                            value={data.familyMedicalHistory}
                            onChange={(e) => updateData({ familyMedicalHistory: e.target.value })}
                            className={inputClass}
                            placeholder="e.g. Father - Hypertension"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <Pill className="w-4 h-4" />
                            <span>Current Medications</span>
                        </label>
                        <input
                            type="text"
                            value={data.currentMedications}
                            onChange={(e) => updateData({ currentMedications: e.target.value })}
                            className={inputClass}
                            placeholder="e.g. Metformin 500mg"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-dimWhite font-medium text-sm flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Previous Surgeries (if any)</span>
                        </label>
                        <textarea
                            value={data.previousSurgeries}
                            onChange={(e) => updateData({ previousSurgeries: e.target.value })}
                            className={`${inputClass} min-h-[60px]`}
                            placeholder="e.g. Appendectomy in 2015"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
