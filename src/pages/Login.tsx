import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await login();
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-gray-900 transition-colors">
      <div className="flex flex-col items-center space-y-8">
        <img src="/mapkal-logo.png" alt="MapKal Logo" className="w-72 h-72 object-contain" />
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="glass-btn px-6 py-3 text-lg font-semibold hover-lift"
        >
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}