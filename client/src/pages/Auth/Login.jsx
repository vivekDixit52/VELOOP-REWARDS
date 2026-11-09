import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import ui from '../../styles/ui.module.css';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await login(form); // GuestRoute redirects once the session starts
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see your Gems and VEs." footer={<>New to VELOOP? <Link to="/signup">Create an account</Link></>}>
      <form className={styles.form} onSubmit={submit} noValidate>
        {error && <p className={styles.formError} role="alert">{error}</p>}
        <div className={ui.field}>
          <label className={ui.label} htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className={ui.input} placeholder="you@example.com" value={form.email} onChange={update('email')} required />
        </div>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="password">Password</label>
          <div className={styles.passwordWrap}>
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className={ui.input} placeholder="Your password" value={form.password} onChange={update('password')} required />
            <button type="button" className={styles.eye} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <button type="submit" className={`${ui.btn} ${ui.btnGold} ${ui.btnBlock}`} disabled={loading}>
          {loading ? <><Loader2 size={17} className="spin" aria-hidden="true" /> Logging in...</> : 'Log in'}
        </button>
        <div className={styles.demo}>
          <span>Demo: demo@veloop.in</span>
          <button type="button" className={styles.demoBtn} onClick={() => setForm({ email: 'demo@veloop.in', password: 'Demo@123' })}>Fill demo login</button>
        </div>
      </form>
    </AuthLayout>
  );
}
