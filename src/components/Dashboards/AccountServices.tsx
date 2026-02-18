import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { Application } from '../../types';
import { FileText, CheckCircle, XCircle, Clock, Plus, ArrowLeft } from 'lucide-react';
import AccountOpeningForm from './AccountOpeningForm';
// import styles from '../../styles';

interface AccountServicesProps {
    onBack: () => void;
}

export default function AccountServices({ onBack }: AccountServicesProps) {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);

    useEffect(() => {
        loadApplications();
    }, [user]);

    const loadApplications = () => {
        const allApplications = storage.getApplications();
        const userApplications = allApplications.filter(app => app.userId === user?.id);
        setApplications(userApplications);
        // If no applications, show form by default
        if (userApplications.length === 0) {
            setShowNewApplicationForm(true);
        } else {
            setShowNewApplicationForm(false);
        }
    };

    const getRiskColor = (category: string) => {
        switch (category) {
            case 'LOW': return 'bg-green-400/10 text-green-400 border-green-400/20';
            case 'MEDIUM': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
            case 'HIGH': return 'bg-red-400/10 text-red-400 border-red-400/20';
            default: return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
            default: return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    return (
        <div className="animate-fade-in-up relative">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] pink__gradient opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] blue__gradient opacity-10 pointer-events-none" />

            <button
                onClick={onBack}
                className="flex items-center text-dimWhite hover:text-secondary mb-6 transition-colors font-poppins relative z-10"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Services
            </button>

            {showNewApplicationForm ? (
                <div className="relative z-10">
                    <div className="mb-6 flex justify-between items-center text-white">
                        <h2 className="text-xl font-semibold font-poppins">New Account Application</h2>
                        {applications.length > 0 && (
                            <button
                                onClick={() => setShowNewApplicationForm(false)}
                                className="text-dimWhite hover:text-white underline font-poppins"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    {/* Form container styled in the form component itself usually, but we wrap it here just in case */}
                    <div className="bg-black-gradient-2 p-6 rounded-[20px] border border-dimWhite/10 shadow-2xl">
                        <AccountOpeningForm onSuccess={loadApplications} />
                    </div>
                </div>
            ) : (
                <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white font-poppins">My Applications</h2>
                        <button
                            onClick={() => setShowNewApplicationForm(true)}
                            className="flex items-center space-x-2 bg-blue-gradient text-primary font-medium px-4 py-2 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1 font-poppins"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Application</span>
                        </button>
                    </div>

                    <div className="bg-black-gradient-2 rounded-[20px] shadow-2xl border border-dimWhite/10 overflow-hidden">
                        {applications.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-dimBlue/10 flex items-center justify-center mb-6">
                                    <FileText className="w-10 h-10 text-secondary" />
                                </div>
                                <p className="text-dimWhite font-poppins text-lg">No applications yet</p>
                                <button
                                    onClick={() => setShowNewApplicationForm(true)}
                                    className="mt-6 text-secondary font-semibold hover:text-white transition-colors font-poppins"
                                >
                                    Start an Application
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-primary/50 border-b border-dimWhite/10">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">Account Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">Risk Level</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dimWhite/10">
                                        {applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-sm text-white font-poppins">
                                                    {new Date(app.submittedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white capitalize font-poppins">
                                                    {app.accountType || 'Savings'} <span className="text-dimWhite text-xs">({app.branchPreference})</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(app.riskCategory)} font-poppins`}>
                                                        {app.riskCategory}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(app.status)}
                                                        <span className="text-sm capitalize text-dimWhite font-poppins">{app.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-dimWhite font-poppins">
                                                    Score: {app.riskScore}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
