import { useState, useRef, useLayoutEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import ServicesHub from './ServicesHub';
import AccountServices from './AccountServices';
import styles from '../../styles';
import OnboardingAssistant from './OnboardingAssistant';
import { navBridge } from '../../lib/navBridge';
import CreditCardApplication from '../CreditCards/CreditCardApplication';
import InsuranceApplication from '../Insurance/InsuranceApplication';
import LoanApplication from '../Loans/LoanApplication';
import InvestmentApplication from '../Investments/InvestmentApplication';
import TaxApplication from '../Tax/TaxApplication';

type DashboardView = 'home' | 'account-opening' | 'credit-cards' | 'insurance' | 'loans' | 'invest' | 'tax';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('home');

  // Use a ref so the callback is always fresh (no stale closure)
  const setViewRef = useRef(setCurrentView);
  setViewRef.current = setCurrentView;

  // useLayoutEffect fires synchronously before paint and before child useEffects —
  // guarantees navBridge is registered before NavigateToService mounts and calls navigate()
  useLayoutEffect(() => {
    navBridge.register((service) => {
      if (service === 'account') {
        setViewRef.current('account-opening');
      }
    });
    return () => navBridge.unregister();
  }, []);

  const handleServiceSelect = (service: string) => {
    if (service === 'account') {
      setCurrentView('account-opening');
    } else if (service === 'credit-cards') {
      setCurrentView('credit-cards');
    } else if (service === 'insurance') {
      setCurrentView('insurance');
    } else if (service === 'loans') {
      setCurrentView('loans');
    } else if (service === 'invest') {
      setCurrentView('invest');
    } else if (service === 'tax') {
      setCurrentView('tax');
    }
  };

  return (
    <div className="min-h-screen bg-primary w-full overflow-hidden">
      {/* Navbar */}
      <nav
        className={`w-full flex py-6 justify-between items-center navbar ${styles.paddingX} border-b border-dimWhite/10 sticky top-0 z-50 bg-primary/90 backdrop-blur`}
      >
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setCurrentView('home')}
        >
          <LayoutDashboard className="w-8 h-8 text-secondary" />
          <div>
            <h1 className="text-xl font-bold text-white font-poppins">InnovGenius</h1>
            <p className="text-xs text-dimWhite font-poppins">{user?.name}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 text-dimWhite hover:text-white hover:bg-white/10 rounded-lg transition font-poppins"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className={`bg-primary ${styles.flexStart} ${styles.paddingX}`}>
        <div className={`${styles.boxWidth} py-8`}>
          {currentView === 'home' && (
            <ServicesHub onServiceSelect={handleServiceSelect} />
          )}

          {currentView === 'account-opening' && (
            <AccountServices
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'credit-cards' && (
            <CreditCardApplication
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'insurance' && (
            <InsuranceApplication
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'loans' && (
            <LoanApplication
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'invest' && (
            <InvestmentApplication
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'tax' && (
            <TaxApplication
              onBack={() => setCurrentView('home')}
            />
          )}
        </div>
      </div>

      {/* AI Onboarding Assistant — always visible, context-aware */}
      <OnboardingAssistant currentView={currentView} />
    </div>
  );
}
