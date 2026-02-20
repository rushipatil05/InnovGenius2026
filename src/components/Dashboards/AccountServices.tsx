import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { Application } from '../../types';
import { FileText, CheckCircle, XCircle, Clock, Plus, ArrowLeft, Trash2, AlertTriangle, X, MapPin } from 'lucide-react';
import AccountOpeningForm from './AccountOpeningForm';
import { useLanguage } from '../../contexts/LanguageContext';

interface AccountServicesProps {
    onBack: () => void;
    onRegisterFormFill?: (
        cb: (data: {
            dob?: string;
            gender?: string;
            maritalStatus?: string;
            parentsName?: string;
            nationality?: string;
        }) => void
    ) => void;
}

export default function AccountServices({ onBack, onRegisterFormFill }: AccountServicesProps) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadApplications();
    }, [user]);

    const loadApplications = () => {
        const allApplications = storage.getApplications();
        // Assuming 'details' field identifies the type, or we check generic structure
        // Since this component is specifically for Account Opening, we might want to filter by type if you added 'type' field
        // For now, filtering by user ID as per original code
        const userApplications = allApplications.filter(app => app.userId === user?.id); // Filter out loans if needed, or keep generic
        setApplications(userApplications);
        if (userApplications.length === 0) {
            setShowNewApplicationForm(true);
        } else {
            setShowNewApplicationForm(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        setTimeout(() => {
            storage.deleteApplication(deleteTarget.id);
            setDeleteTarget(null);
            setDeleteLoading(false);
            loadApplications();
        }, 600);
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
                {t('backToServices')}
            </button>

            {showNewApplicationForm ? (
                <div className="relative z-10">
                    <div className="mb-6 flex justify-between items-center text-white">
                        <h2 className="text-xl font-semibold font-poppins">{t('newAccountApp')}</h2>
                        {applications.length > 0 && (
                            <button
                                onClick={() => setShowNewApplicationForm(false)}
                                className="text-dimWhite hover:text-white underline font-poppins"
                            >
                                {t('cancel')}
                            </button>
                        )}
                    </div>
                    <div className="bg-black-gradient-2 p-6 rounded-[20px] border border-dimWhite/10 shadow-2xl">
                        <AccountOpeningForm
                            onSuccess={loadApplications}
                            onRegisterFormFill={onRegisterFormFill}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white font-poppins">{t('myApplications')}</h2>
                        <button
                            onClick={() => setShowNewApplicationForm(true)}
                            className="flex items-center space-x-2 bg-blue-gradient text-primary font-medium px-4 py-2 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1 font-poppins"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t('newApplication')}</span>
                        </button>
                    </div>

                    <div className="bg-black-gradient-2 rounded-[20px] shadow-2xl border border-dimWhite/10 overflow-hidden">
                        {applications.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-dimBlue/10 flex items-center justify-center mb-6">
                                    <FileText className="w-10 h-10 text-secondary" />
                                </div>
                                <p className="text-dimWhite font-poppins text-lg">{t('noApplications')}</p>
                                <button
                                    onClick={() => setShowNewApplicationForm(true)}
                                    className="mt-6 text-secondary font-semibold hover:text-white transition-colors font-poppins"
                                >
                                    {t('startApp')}
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-primary/50 border-b border-dimWhite/10">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">{t('date')}</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">{t('accountType')}</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">{t('riskLevel')}</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">{t('status')}</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">{t('details')}</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider font-poppins">{t('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dimWhite/10">
                                        {applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-white font-poppins">
                                                    {new Date(app.submittedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white capitalize font-poppins">
                                                    {t(app.accountType || 'savings')} <span className="text-dimWhite text-xs">({app.branchPreference})</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(app.riskCategory)} font-poppins`}>
                                                        {app.riskCategory}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(app.status)}
                                                        <span className="text-sm capitalize text-dimWhite font-poppins">{t(app.status) || app.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-dimWhite font-poppins">
                                                    <div className="flex flex-col gap-1">
                                                        <span>Score: {app.riskScore}</span>
                                                        {app.isLocationVerified && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full w-fit">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>Loc. Verified</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setDeleteTarget(app)}
                                                        title={t('deleteApp')}
                                                        className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-400/10 px-2.5 py-1.5 rounded-lg transition-all font-poppins opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        {t('delete')}
                                                    </button>
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

            {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !deleteLoading && setDeleteTarget(null)}
                    />

                    {/* Modal */}
                    <div className="relative bg-[#1a1a2e] border border-red-500/20 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
                        {/* Close button */}
                        <button
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleteLoading}
                            className="absolute top-4 right-4 text-dimWhite hover:text-white transition disabled:opacity-40"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-7 h-7 text-red-400" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-white text-center font-poppins mb-2">
                            {t('deleteApp')}
                        </h3>
                        <p className="text-sm text-dimWhite text-center font-poppins mb-1">
                            {t('deleteConfirmText')}
                        </p>
                        <p className="text-sm text-white text-center font-poppins font-semibold mb-1 capitalize">
                            {t(deleteTarget.accountType || 'savings')} Account Application
                        </p>
                        <p className="text-xs text-dimWhite/60 text-center font-poppins mb-6">
                            Submitted on {new Date(deleteTarget.submittedAt).toLocaleDateString()} · Status: {t(deleteTarget.status) || deleteTarget.status}
                        </p>

                        <p className="text-xs text-red-400/80 text-center font-poppins mb-6 bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2">
                            ⚠️ {t('deleteWarning')}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-dimWhite/20 text-dimWhite hover:text-white hover:border-white/40 transition font-poppins text-sm disabled:opacity-40"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold font-poppins text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t('deleting')}
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        {t('yesDelete')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}