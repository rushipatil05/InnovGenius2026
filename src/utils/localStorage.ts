import { User, Application, AuditLog } from '../types';

const USERS_KEY = 'bank_users';
const APPLICATIONS_KEY = 'bank_applications';
const AUDIT_LOGS_KEY = 'bank_audit_logs';
const CURRENT_USER_KEY = 'bank_current_user';

export const storage = {
  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  setUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.setUsers(users);
  },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  },

  getApplications(): Application[] {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  setApplications(applications: Application[]): void {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  },

  addApplication(application: Application): void {
    const applications = this.getApplications();
    applications.push(application);
    this.setApplications(applications);
  },

  updateApplication(id: string, updates: Partial<Application>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(a => a.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      this.setApplications(applications);
    }
  },

  getApplicationById(id: string): Application | undefined {
    return this.getApplications().find(a => a.id === id);
  },

  getAuditLogs(): AuditLog[] {
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  setAuditLogs(logs: AuditLog[]): void {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  },

  addAuditLog(log: AuditLog): void {
    const logs = this.getAuditLogs();
    logs.push(log);
    this.setAuditLogs(logs);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },
};
