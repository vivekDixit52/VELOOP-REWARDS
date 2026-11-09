import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import ui from '../../styles/ui.module.css';
import styles from './Auth.module.css';

export default function Signup() {
  const { signup } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', referralCode: params.get('ref') ?? '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await signup(form);
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.data?.errors ?? {});
      setLoading(false);
    }
  };

  const field = (id, label, props) => (
    <div className={ui.field}>
      <label className={ui.label} htmlFor={id}>{label}</label>
      <input id={id} className={ui.input} value={form[id]} onChange={update(id)} aria-invalid={Boolean(fieldErrors[id])} aria-describedby={fieldErrors[id] ? `${id}-error` : undefined} {...props} />
      {fieldErrors[id] && <p id={`${id}-error`} className={ui.error}>{fieldErrors[id]}</p>}
    </div>
  );

  return (
    <AuthLayout title="Create your account" subtitle="Start earning Gems in under a minute." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
      <form className={styles.form} onSubmit={submit} noValidate>
        {error && !Object.keys(fieldErrors).length && <p className={styles.formError} role="alert">{error}</p>}
        {field('name', 'Full name', { type: 'text', autoComplete: 'name', placeholder: 'Your name' })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' })}
        <div className={ui.field}>
          <label className={ui.label} htmlFor="password">Password</label>
          <div className={styles.passwordWrap}>
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={ui.input} placeholder="8+ characters, with a number" value={form.password} onChange={update('password')} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? 'password-error' : undefined} />
            <button type="button" className={styles.eye} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {fieldErrors.password && <p id="password-error" className={ui.error}>{fieldErrors.password}</p>}
        </div>
        {field('referralCode', 'Referral code (optional)', { type: 'text', placeholder: 'e.g. VLDEMO24', autoCapitalize: 'characters' })}
        <button type="submit" className={`${ui.btn} ${ui.btnGold} ${ui.btnBlock}`} disabled={loading}>
          {loading ? <><Loader2 size={17} className="spin" aria-hidden="true" /> Creating account...</> : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
