import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles';
import { logo } from '../assets';
import LanguageSelection from './LanguageSelection';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Login() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_language');
    if (!storedLang) {
      setShowLanguageModal(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('fillFields'));
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <div className={`min-h-screen w-full flex bg-primary overflow-hidden`}>
      {/* Left Side - Hero/Branding */}
      <div className={`hidden md:flex md:w-1/2 flex-col justify-center items-start relative ${styles.paddingX} border-r border-dimWhite/10`}>
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute w-[50%] h-[50%] top-[-10%] left-[-10%] pink__gradient opacity-40" />
          <div className="absolute w-[50%] h-[50%] bottom-[-10%] right-[-10%] blue__gradient opacity-40" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg">
          <Link to="/" className="mb-8 block">
            <img src={logo} alt="Aurora" className="w-[180px] h-[48px] object-contain" />
          </Link>

          <h1 className={`${styles.heading2} mb-6`}>
            {t('heroTitle1')} <br />
            <span className="text-gradient">{t('heroTitle2')}</span> <br />
            {t('heroTitle3')}
          </h1>

          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            {t('heroDesc')}
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={`w-full md:w-1/2 flex justify-center items-center ${styles.paddingX} py-12 relative z-10`}>
        <div className="absolute top-0 right-0 w-[50%] h-[50%] white__gradient opacity-20 pointer-events-none" />

        <div className="w-full max-w-md bg-black-gradient-2 p-8 rounded-2xl shadow-2xl border border-dimWhite/10 backdrop-blur-sm">
          <h2 className={styles.heading2 + " text-center text-[32px] mb-2"}>
            {t("signIn")}
          </h2>
          <p className={`${styles.paragraph} text-center text-[16px] mb-8`}>
            {t('accessAccount')}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dimWhite mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dimBlue/10 border border-dimWhite/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition text-white placeholder-dimWhite/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dimWhite mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dimBlue/10 border border-dimWhite/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition text-white placeholder-dimWhite/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-gradient text-primary font-poppins font-semibold py-4 rounded-[10px] outline-none hover:shadow-lg transition-all duration-300 mt-4`}
            >
              {t('signIn')}
            </button>
          </form>

          <p className="mt-8 text-center text-dimWhite text-sm font-poppins">
            {t('dontHaveAccount')}{' '}
            <Link
              to="/signup"
              className="text-cyan-400 font-semibold hover:text-white transition-colors"
            >
              {t('signUp')}
            </Link>
          </p>
        </div>
      </div>
      {showLanguageModal && (
        <LanguageSelection onClose={() => setShowLanguageModal(false)} />
      )}
    </div>
  );
}