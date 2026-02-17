import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UserDashboard from './components/Dashboards/UserDashboard';
import OfficerDashboard from './components/Dashboards/OfficerDashboard';
import AuditorDashboard from './components/Dashboards/AuditorDashboard';

function AppContent() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (!user) {
    return showLogin ? (
      <Login onSwitchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  switch (user.role) {
    case 'user':
      return <UserDashboard />;
    case 'officer':
      return <OfficerDashboard />;
    case 'auditor':
      return <AuditorDashboard />;
    default:
      return <UserDashboard />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
