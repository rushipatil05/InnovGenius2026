import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { Application } from '../../types';
import { LogOut, FileText, Eye, ClipboardList, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import styles from '../../styles';

export default function OfficerDashboard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [auditLogs, setAuditLogs] = useState(storage.getAuditLogs());
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'logs'>('applications');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const allApplications = storage.getApplications();
    setApplications(allApplications);
    setAuditLogs(storage.getAuditLogs());
  };

  const handleApprove = (app: Application) => {
    storage.updateApplication(app.id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.name,
    });

    storage.addAuditLog({
      id: Date.now().toString(),
      action: 'APPLICATION_APPROVED',
      userId: user!.id,
      userName: user!.name,
      details: `Application for ${app.userName} approved`,
      timestamp: new Date().toISOString(),
      applicationId: app.id,
    });

    setSelectedApp(null);
    loadApplications();
  };

  const handleReject = (app: Application) => {
    storage.updateApplication(app.id, {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.name,
    });

    storage.addAuditLog({
      id: Date.now().toString(),
      action: 'APPLICATION_REJECTED',
      userId: user!.id,
      userName: user!.name,
      details: `Application for ${app.userName} rejected`,
      timestamp: new Date().toISOString(),
      applicationId: app.id,
    });

    setSelectedApp(null);
    loadApplications();
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'LOW': return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'MEDIUM': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
      case 'HIGH': return 'bg-red-400/10 text-red-400 border-red-400/20';
      default: return 'bg-dimBlue/10 text-dimWhite border-dimBlue/20';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      approved: 'bg-green-400/10 text-green-400 border-green-400/20',
      rejected: 'bg-red-400/10 text-red-400 border-red-400/20',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-primary w-full overflow-hidden font-poppins text-white">
      <nav className={`w-full flex py-6 justify-between items-center navbar ${styles.paddingX} border-b border-dimWhite/10 sticky top-0 z-50 bg-primary/90 backdrop-blur`}>
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-8 h-8 text-secondary" />
          <div>
            <h1 className="text-xl font-bold text-white">Officer Portal</h1>
            <p className="text-xs text-dimWhite">{user?.name}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 text-dimWhite hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </nav>

      <div className={`flex flex-col md:flex-row h-[calc(100vh-100px)] pt-6 ${styles.paddingX} ${styles.boxWidth} mx-auto`}>
        <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-6">
          <div className="bg-black-gradient-2 rounded-xl p-4 shadow-lg h-full border border-dimWhite/10">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition border border-transparent ${activeTab === 'applications'
                  ? 'bg-dimBlue/10 text-secondary border-dimBlue/20 font-semibold'
                  : 'text-dimWhite hover:bg-white/5 hover:text-white'
                  }`}
              >
                <FileText className="w-5 h-5" />
                <span>Applications</span>
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition border border-transparent ${activeTab === 'logs'
                  ? 'bg-dimBlue/10 text-secondary border-dimBlue/20 font-semibold'
                  : 'text-dimWhite hover:bg-white/5 hover:text-white'
                  }`}
              >
                <ClipboardList className="w-5 h-5" />
                <span>Audit Logs</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 h-full overflow-hidden flex flex-col">
          {activeTab === 'applications' ? (
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6">Applications</h2>
              <div className="bg-black-gradient-2 rounded-xl shadow-lg border border-dimWhite/10 flex-1 overflow-hidden flex flex-col">
                {applications.length === 0 ? (
                  <div className="p-12 text-center h-full flex flex-col justify-center items-center">
                    <FileText className="w-16 h-16 text-dimWhite/20 mb-4" />
                    <p className="text-dimWhite">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full">
                      <thead className="bg-black/20 border-b border-dimWhite/10 sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider">Risk</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-dimWhite uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dimWhite/5">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-white">{app.userName}</p>
                                <p className="text-xs text-dimWhite">{app.userEmail}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(app.riskCategory)}`}>
                                {app.riskCategory}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-dimWhite">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="flex items-center space-x-2 px-3 py-2 bg-dimBlue/10 text-secondary border border-dimBlue/20 rounded-lg hover:bg-dimBlue/20 transition"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
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
          ) : (
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6">Audit Logs</h2>
              <div className="bg-black-gradient-2 rounded-xl shadow-lg border border-dimWhite/10 flex-1 overflow-hidden flex flex-col">
                {auditLogs.length === 0 ? (
                  <div className="p-12 text-center h-full flex flex-col justify-center items-center">
                    <ClipboardList className="w-16 h-16 text-dimWhite/20 mb-4" />
                    <p className="text-dimWhite">No logs found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-dimWhite/5 overflow-auto custom-scrollbar flex-1">
                    {auditLogs.slice().reverse().map((log) => (
                      <div key={log.id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-secondary" />
                              <span className="font-semibold text-white">{log.action}</span>
                            </div>
                            <p className="text-sm text-dimWhite mb-1">{log.details}</p>
                            <div className="flex items-center space-x-4 text-xs text-dimWhite/60">
                              <span>By: {log.userName}</span>
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-primary border border-dimWhite/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-primary/95 backdrop-blur border-b border-dimWhite/10 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-white">Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition text-dimWhite hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                <h4 className="font-semibold text-secondary mb-3">1. Personal Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-dimWhite">Full Name</p><p className="font-medium text-white">{selectedApp.userName}</p></div>
                  <div><p className="text-dimWhite">Date of Birth</p><p className="font-medium text-white">{selectedApp.dob || '-'}</p></div>
                  <div><p className="text-dimWhite">Gender</p><p className="font-medium capitalize text-white">{selectedApp.gender || '-'}</p></div>
                  <div><p className="text-dimWhite">Marital Status</p><p className="font-medium capitalize text-white">{selectedApp.maritalStatus || '-'}</p></div>
                  <div><p className="text-dimWhite">Nationality</p><p className="font-medium text-white">{selectedApp.nationality || '-'}</p></div>
                  <div><p className="text-dimWhite">Parent's Name</p><p className="font-medium text-white">{selectedApp.parentsName || '-'}</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                <h4 className="font-semibold text-secondary mb-3">2. Contact Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-dimWhite">Mobile Number</p><p className="font-medium text-white">{selectedApp.mobileNumber || '-'}</p></div>
                  <div><p className="text-dimWhite">Email ID</p><p className="font-medium text-white">{selectedApp.userEmail}</p></div>
                  <div className="col-span-2"><p className="text-dimWhite">Current Address</p><p className="font-medium text-white">{selectedApp.currentAddress || '-'}</p></div>
                  <div className="col-span-2"><p className="text-dimWhite">Permanent Address</p><p className="font-medium text-white">{selectedApp.permanentAddress || '-'}</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                <h4 className="font-semibold text-secondary mb-3">3. Account Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-dimWhite">Account Type</p><p className="font-medium capitalize text-white">{selectedApp.accountType || 'Savings'}</p></div>
                  <div><p className="text-dimWhite">Branch Preference</p><p className="font-medium text-white">{selectedApp.branchPreference || '-'}</p></div>
                  <div><p className="text-dimWhite">Mode of Operation</p><p className="font-medium capitalize text-white">{selectedApp.modeOfOperation || 'Self'}</p></div>
                  <div><p className="text-dimWhite">Initial Deposit</p><p className="font-medium text-white">₹{(selectedApp.initialDeposit || 0).toLocaleString()}</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                <h4 className="font-semibold text-secondary mb-3">4. Employment & Financial</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-dimWhite">Occupation</p><p className="font-medium text-white">{selectedApp.employment}</p></div>
                  <div><p className="text-dimWhite">Annual Income</p><p className="font-medium text-white">{selectedApp.annualIncome || '-'}</p></div>
                  <div><p className="text-dimWhite">Source of Funds</p><p className="font-medium text-white">{selectedApp.sourceOfFunds || '-'}</p></div>
                  <div><p className="text-dimWhite">Monthly Txn (Approx)</p><p className="font-medium text-white">₹{selectedApp.monthlyTxn.toLocaleString()}</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                <h4 className="font-semibold text-secondary mb-3">5. KYC Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-dimWhite">PAN Number</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-white">{selectedApp.panNumber}</p>
                      {selectedApp.isPanValid ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-dimWhite">Aadhaar Number</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-white">{selectedApp.aadhaarNumber}</p>
                      {selectedApp.isAadhaarValid ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {selectedApp.nomineeName && (
                <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                  <h4 className="font-semibold text-secondary mb-3">6. Nominee Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-dimWhite">Nominee Name</p><p className="font-medium text-white">{selectedApp.nomineeName}</p></div>
                    <div><p className="text-dimWhite">Relationship</p><p className="font-medium text-white">{selectedApp.nomineeRelation}</p></div>
                  </div>
                </div>
              )}

              <div className={`rounded-lg p-4 border ${getRiskColor(selectedApp.riskCategory)}`}>
                <h4 className="font-semibold mb-3 text-white">Risk Assessment</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-dimWhite">Risk Score:</span>
                  <span className="text-2xl font-bold text-white">{selectedApp.riskScore}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-dimWhite">Risk Category:</span>
                  <span className="text-lg font-bold text-white">{selectedApp.riskCategory}</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-white">Risk Factors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedApp.riskReasons.map((reason, index) => (
                      <li key={index} className="text-sm text-dimWhite">{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => handleApprove(selectedApp)}
                    className="flex-1 bg-green-600/20 text-green-400 border border-green-600/40 px-6 py-3 rounded-lg font-semibold hover:bg-green-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp)}
                    className="flex-1 bg-red-600/20 text-red-400 border border-red-600/40 px-6 py-3 rounded-lg font-semibold hover:bg-red-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {selectedApp.status !== 'pending' && (
                <div className="bg-white/5 rounded-lg p-4 border border-dimWhite/5">
                  <p className="text-sm text-dimWhite">Reviewed by</p>
                  <p className="font-medium text-white">{selectedApp.reviewedBy}</p>
                  <p className="text-xs text-dimWhite mt-1">
                    {new Date(selectedApp.reviewedAt!).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
