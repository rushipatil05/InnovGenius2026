import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/localStorage';
import { AuditLog } from '../../types';
import { LogOut, Shield, AlertCircle, Filter } from 'lucide-react';
import styles from '../../styles';

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
    if (action.includes('APPROVED')) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (action.includes('REJECTED')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (action.includes('SUBMITTED')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (action.includes('LOGIN') || action.includes('SIGNUP')) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    return 'text-dimWhite bg-white/5 border-white/10';
  };

  const filteredLogs = getFilteredLogs();

  return (
    <div className="min-h-screen bg-primary w-full overflow-hidden font-poppins text-white">
      <nav className={`w-full flex py-6 justify-between items-center navbar ${styles.paddingX} border-b border-dimWhite/10 sticky top-0 z-50 bg-primary/90 backdrop-blur`}>
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-secondary" />
          <div>
            <h1 className="text-xl font-bold text-white">Auditor Portal</h1>
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

      <div className={`flex flex-col h-[calc(100vh-100px)] pt-8 ${styles.paddingX} ${styles.boxWidth} mx-auto`}>
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-dimWhite" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-black-gradient border border-dimWhite/20 rounded-lg text-white focus:ring-2 focus:ring-secondary focus:border-transparent outline-none cursor-pointer"
            >
              <option value="all" className="bg-primary hover:bg-white/10">All Actions</option>
              <option value="signup" className="bg-primary hover:bg-white/10">Signups</option>
              <option value="login" className="bg-primary hover:bg-white/10">Logins</option>
              <option value="submitted" className="bg-primary hover:bg-white/10">Submissions</option>
              <option value="approved" className="bg-primary hover:bg-white/10">Approvals</option>
              <option value="rejected" className="bg-primary hover:bg-white/10">Rejections</option>
            </select>
          </div>
        </div>

        <div className="bg-black-gradient-2 rounded-xl shadow-lg border border-dimWhite/10 flex-1 overflow-hidden flex flex-col mb-8">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center h-full flex flex-col justify-center items-center">
              <AlertCircle className="w-16 h-16 text-dimWhite/20 mb-4" />
              <p className="text-dimWhite">No audit logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-dimWhite/5 overflow-auto custom-scrollbar flex-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-lg border ${getActionColor(log.action)}`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white">
                          {log.action.replace(/_/g, ' ')}
                        </h3>
                        <span className="text-xs text-dimWhite">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-dimWhite mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-dimWhite/60">User:</span>
                          <span className="text-xs font-medium text-dimWhite">{log.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-dimWhite/60">ID:</span>
                          <span className="text-xs font-mono text-dimWhite">{log.userId.slice(0, 8)}...</span>
                        </div>
                        {log.applicationId && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-dimWhite/60">App ID:</span>
                            <span className="text-xs font-mono text-dimWhite">{log.applicationId.slice(0, 8)}...</span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black-gradient rounded-xl p-6 border border-dimWhite/5 hover:border-dimWhite/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dimWhite mb-1">Total Logs</p>
                <p className="text-3xl font-bold text-white">{logs.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-black-gradient rounded-xl p-6 border border-dimWhite/5 hover:border-dimWhite/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dimWhite mb-1">Applications</p>
                <p className="text-3xl font-bold text-white">
                  {logs.filter(l => l.action.includes('APPLICATION')).length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <AlertCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-black-gradient rounded-xl p-6 border border-dimWhite/5 hover:border-dimWhite/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dimWhite mb-1">User Actions</p>
                <p className="text-3xl font-bold text-white">
                  {logs.filter(l => l.action.includes('USER')).length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <AlertCircle className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dimBlue/10 border border-dimBlue/20 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-secondary mb-1">Audit Information</h4>
              <p className="text-sm text-dimWhite">
                All system activities are logged for security and compliance purposes.
                This includes user authentication, application submissions, and officer reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
