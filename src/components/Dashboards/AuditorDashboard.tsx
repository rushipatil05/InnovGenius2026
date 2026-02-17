import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { AuditLog } from '../../types';
import { LogOut, Shield, AlertCircle, Filter } from 'lucide-react';

export default function AuditorDashboard() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const allLogs = storage.getAuditLogs();
    setLogs(allLogs.reverse());
  };

  const getFilteredLogs = () => {
    if (filter === 'all') return logs;
    return logs.filter(log => log.action.toLowerCase().includes(filter.toLowerCase()));
  };

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED')) return 'text-green-700 bg-green-50';
    if (action.includes('REJECTED')) return 'text-red-700 bg-red-50';
    if (action.includes('SUBMITTED')) return 'text-blue-700 bg-blue-50';
    if (action.includes('LOGIN') || action.includes('SIGNUP')) return 'text-purple-700 bg-purple-50';
    return 'text-gray-700 bg-gray-50';
  };

  const filteredLogs = getFilteredLogs();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Auditor Portal</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Actions</option>
              <option value="signup">Signups</option>
              <option value="login">Logins</option>
              <option value="submitted">Submissions</option>
              <option value="approved">Approvals</option>
              <option value="rejected">Rejections</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No audit logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {log.action.replace(/_/g, ' ')}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">User:</span>
                          <span className="text-xs font-medium text-gray-900">{log.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">ID:</span>
                          <span className="text-xs font-mono text-gray-900">{log.userId.slice(0, 8)}...</span>
                        </div>
                        {log.applicationId && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">App ID:</span>
                            <span className="text-xs font-mono text-gray-900">{log.applicationId.slice(0, 8)}...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Audit Information</h4>
              <p className="text-sm text-blue-700">
                All system activities are logged for security and compliance purposes.
                This includes user authentication, application submissions, and officer reviews.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Logs</p>
                <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Applications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {logs.filter(l => l.action.includes('APPLICATION')).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">User Actions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {logs.filter(l => l.action.includes('USER')).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
