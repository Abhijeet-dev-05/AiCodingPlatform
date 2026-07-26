import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser, googleAuthUser } from "../authSlice";
import { useEffect, useRef, useState } from "react";
import { playWelcomeChime } from "../utils/welcomeSound";
import { useGoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const schema = z.object({
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ── Shared inline code tokens ──
const CK = ({ c }) => <span style={{ color: '#c084fc' }}>{c}</span>;
const CF = ({ c }) => <span style={{ color: '#38bdf8' }}>{c}</span>;
const CP = ({ c }) => <span style={{ color: '#f472b6' }}>{c}</span>;
const CB = ({ c }) => <span style={{ color: '#4b5563' }}>{c}</span>;
const CN = ({ c }) => <span style={{ color: '#fbbf24' }}>{c}</span>;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const hasPlayed = useRef(false);
  const [googleError, setGoogleError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated && !hasPlayed.current) {
      hasPlayed.current = true;
      playWelcomeChime();
      setTimeout(() => navigate('/'), 1500);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); ctx.resume(); } catch {}
    dispatch(loginUser(data));
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (token) => {
      setGoogleError(null);
      dispatch(googleAuthUser(token.access_token));
    },
    onError: () => setGoogleError('Google sign-in failed. Please try again.'),
    flow: 'implicit',
  });

  return (
    <div className="auth-root">
      {/* ── LEFT PANEL ── */}
      <div className="auth-panel">
        <div className="auth-panel__orb auth-panel__orb--1" aria-hidden="true" />
        <div className="auth-panel__orb auth-panel__orb--2" aria-hidden="true" />
        <div className="auth-panel__inner">
          <div className="auth-panel__heading">
            <a href="/" className="auth-panel__logo">CodeArena</a>
            <h2 className="auth-panel__title">
              Welcome
              <span className="auth-panel__title-accent">Back, Coder</span>
            </h2>
            <p className="auth-panel__sub">Continue your journey to coding excellence. Your problems are waiting.</p>
          </div>

          <div className="auth-editor">
            <div className="auth-editor__bar">
              <div className="auth-editor__dot"/><div className="auth-editor__dot"/><div className="auth-editor__dot"/>
              <span className="auth-editor__tab">binary_search.js</span>
            </div>
            <div className="auth-editor__body">
              {[
                <><CK c="function"/> <CF c="binarySearch"/><CB c="(arr, target)"/> <CB c="{"/></>,
                <><span style={{paddingLeft:16}}/><CK c="let"/> <CP c="l"/> <CB c="="/> <CN c="0"/>, <CP c="r"/> <CB c="="/> <CP c="arr"/><CB c="."/><CP c="length"/> <CB c="- 1"/></>,
                <><span style={{paddingLeft:16}}/><CK c="while"/> <CB c="(l &lt;= r)"/> <CB c="{"/></>,
                <><span style={{paddingLeft:32}}/><CK c="const"/> <CP c="mid"/> <CB c="="/> <CF c="Math.floor"/><CB c="(l+(r-l)/2)"/></>,
                <><span style={{paddingLeft:32}}/><CK c="if"/> <CB c="(arr[mid] ==="/> <CP c="target"/><CB c=")"/> <CK c="return"/> <CP c="mid"/></>,
                <><span style={{paddingLeft:16}}/><CB c="}"/></>,
                <><CB c="}"/></>,
              ].map((c,i) => (
                <div key={i} className="auth-editor__line">
                  <span className="auth-editor__ln">{i+1}</span>
                  <span className="auth-editor__code">{c}</span>
                </div>
              ))}
            </div>
            <div className="auth-editor__result">
              <span className="auth-editor__result-icon">✓</span>
              <span className="auth-editor__result-text">Accepted!</span>
              <span className="auth-editor__result-meta">O(log n) complexity</span>
            </div>
          </div>

          <div className="auth-panel__stats">
            {[['500+','Problems'],['50K+','Developers'],['95%','Success']].map(([n,l]) => (
              <div key={l} className="auth-panel__stat">
                <div className="auth-panel__stat-num">{n}</div>
                <div className="auth-panel__stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Sign In</h1>
            <p className="auth-form-sub">Welcome back — enter your credentials to continue.</p>
          </div>

          {(error || googleError) && (
            <div className="auth-error">
              <svg className="auth-error__icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
              <span className="auth-error__msg">{error || googleError}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field">
              <label className="auth-label">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Address
              </label>
              <input
                {...register('emailId')}
                type="email"
                placeholder="you@example.com"
                className={`auth-input ${errors.emailId ? 'auth-input--error' : ''}`}
              />
              {errors.emailId && <span className="auth-field-error">{errors.emailId.message}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
              />
              {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-submit__spinner" /> : (
                <>
                  Sign In
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider__line" />
            <span className="auth-divider__text">or</span>
            <div className="auth-divider__line" />
          </div>

          <button type="button" className="auth-google" onClick={() => googleLogin()}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-footer">
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
