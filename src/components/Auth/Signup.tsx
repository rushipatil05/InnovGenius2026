import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles';
import { logo } from '../assets';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Signup() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !role) {
      setError(t('fillFields'));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordLength'));
      return;
    }

    const success = signup(email, password, name, role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('emailExists'));
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
            {t('joinFuture')} <br />
            <span className="text-gradient">{t('future')}</span> <br />
            {t('ofBanking')}
          </h1>

          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            {t('createAccountDesc')}
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className={`w-full md:w-1/2 flex justify-center items-center ${styles.paddingX} py-12 relative z-10`}>
        <div className="absolute top-0 right-0 w-[50%] h-[50%] white__gradient opacity-20 pointer-events-none" />

        <div className="w-full max-w-md bg-black-gradient-2 p-8 rounded-2xl shadow-2xl border border-dimWhite/10 backdrop-blur-sm">
          <h2 className={styles.heading2 + " text-center text-[32px] mb-2"}>
            {t('createAccount')}
          </h2>
          <p className={`${styles.paragraph} text-center text-[16px] mb-8`}>
            {t('joinPlatform')}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dimWhite mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-dimBlue/10 border border-dimWhite/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition text-white placeholder-dimWhite/50"
                placeholder="John Doe"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-dimWhite mb-2">
                {t('selectRole')}
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 bg-dimBlue/10 border border-dimWhite/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition text-white appearance-none cursor-pointer"
                >
                  <option value="user" className="bg-primary text-white">{t('roleUser')}</option>
                  <option value="officer" className="bg-primary text-white">{t('roleOfficer')}</option>
                  <option value="auditor" className="bg-primary text-white">{t('roleAuditor')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-dimWhite" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-gradient text-primary font-poppins font-semibold py-4 rounded-[10px] outline-none hover:shadow-lg transition-all duration-300 mt-4`}
            >
              {t('createAccount')}
            </button>
          </form>

          <p className="mt-8 text-center text-dimWhite text-sm font-poppins">
            {t('alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="text-cyan-400 font-semibold hover:text-white transition-colors"
            >
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}