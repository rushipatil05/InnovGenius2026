import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { Application } from '../../types';
import { LogOut, FileText, Eye, ClipboardList, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

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
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Officer Portal</h1>
                <p className="text-sm text-gray-500">{user?.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="w-64 bg-white border-r">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'applications'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Applications</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'logs'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Audit Logs</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-8">
          {activeTab === 'applications' ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {applications.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{app.userName}</p>
                                <p className="text-xs text-gray-500">{app.userEmail}</p>
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
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {auditLogs.length === 0 ? (
                  <div className="p-12 text-center">
                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No logs found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {auditLogs.slice().reverse().map((log) => (
                      <div key={log.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-gray-900">{log.action}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Applicant Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedApp.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedApp.userEmail}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Financial Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Transactions</p>
                    <p className="font-medium">₹{selectedApp.monthlyTxn.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium">{selectedApp.employment}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">KYC Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">PAN Number</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{selectedApp.panNumber}</p>
                      {selectedApp.isPanValid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Aadhaar Number</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{selectedApp.aadhaarNumber}</p>
                      {selectedApp.isAadhaarValid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border-2 ${getRiskColor(selectedApp.riskCategory)}`}>
                <h4 className="font-semibold mb-3">Risk Assessment</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Risk Score:</span>
                  <span className="text-2xl font-bold">{selectedApp.riskScore}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Risk Category:</span>
                  <span className="text-lg font-bold">{selectedApp.riskCategory}</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Risk Factors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedApp.riskReasons.map((reason, index) => (
                      <li key={index} className="text-sm">{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => handleApprove(selectedApp)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {selectedApp.status !== 'pending' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Reviewed by</p>
                  <p className="font-medium">{selectedApp.reviewedBy}</p>
                  <p className="text-xs text-gray-500 mt-1">
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
