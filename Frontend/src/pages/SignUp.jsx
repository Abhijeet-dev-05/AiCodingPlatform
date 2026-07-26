import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser, googleAuthUser } from "../authSlice";
import { useEffect, useRef, useState } from "react";
import { playWelcomeChime } from "../utils/welcomeSound";
import { useGoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const schema = z.object({
  firstName: z.string().min(3, "At least 3 characters"),
  emailId:   z.string().email("Invalid email address"),
  password:  z.string()
    .min(8, "At least 8 characters")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number")
    .regex(/[^a-zA-Z0-9]/, "Include a special character"),
});

export default function SignUp() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const hasPlayed  = useRef(false);
  const [googleError, setGoogleError] = useState(null);

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated && !hasPlayed.current) {
      hasPlayed.current = true;
      playWelcomeChime();
      setTimeout(() => navigate("/"), 1500);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
    } catch {}
    dispatch(registerUser(data));
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (t) => { setGoogleError(null); dispatch(googleAuthUser(t.access_token)); },
    onError:   ()  => setGoogleError("Google sign-up failed. Please try again."),
    flow: "implicit",
  });

  /* code-token helpers */
  const CK = (p) => <span style={{color:"#c084fc"}}>{p.c}</span>;
  const CF = (p) => <span style={{color:"#38bdf8"}}>{p.c}</span>;
  const CP = (p) => <span style={{color:"#f472b6"}}>{p.c}</span>;
  const CB = (p) => <span style={{color:"#4b5563"}}>{p.c}</span>;

  return (
    <div className="auth-root">

      {/* ── LEFT DECORATIVE PANEL ── */}
      <div className="auth-panel">
        <div className="auth-panel__orb auth-panel__orb--1" aria-hidden="true" />
        <div className="auth-panel__orb auth-panel__orb--2" aria-hidden="true" />

        <div className="auth-panel__inner">
          <div className="auth-panel__heading">
            <a href="/" className="auth-panel__logo">CodeArena</a>
            <h2 className="auth-panel__title">
              Join the
              <span className="auth-panel__title-accent">Coding Arena</span>
            </h2>
            <p className="auth-panel__sub">
              Master algorithms, ace interviews, and land your dream job at top companies.
            </p>
          </div>

          {/* Mock editor */}
          <div className="auth-editor">
            <div className="auth-editor__bar">
              <div className="auth-editor__dot" />
              <div className="auth-editor__dot" />
              <div className="auth-editor__dot" />
              <span className="auth-editor__tab">twoSum.js</span>
            </div>
            <div className="auth-editor__body">
              {[
                <><CK c="function" /> <CF c="twoSum" /><CB c="(nums, target) {" /></>,
                <><span style={{paddingLeft:14}} /><CK c="const" /> <CP c="map" /><CB c=" = " /><CK c="new" /> <CF c="Map()" /></>,
                <><span style={{paddingLeft:14}} /><CK c="for" /><CB c=" (let i=0; i&lt;nums.length; i++) {" /></>,
                <><span style={{paddingLeft:28}} /><CK c="const" /> <CP c="comp" /><CB c=" = target - nums[i]" /></>,
                <><span style={{paddingLeft:28}} /><CK c="if" /><CB c=" (map.has(comp)) " /><CK c="return" /><CB c=" [map.get(comp), i]" /></>,
                <><span style={{paddingLeft:28}} /><CP c="map" /><CB c="." /><CF c="set" /><CB c="(nums[i], i)" /></>,
                <><span style={{paddingLeft:14}} /><CB c="}" /></>,
                <><CB c="}" /></>,
              ].map((code, i) => (
                <div key={i} className="auth-editor__line">
                  <span className="auth-editor__ln">{i + 1}</span>
                  <span className="auth-editor__code">{code}</span>
                </div>
              ))}
            </div>
            <div className="auth-editor__result">
              <span className="auth-editor__result-icon">✓</span>
              <span className="auth-editor__result-text">Accepted!</span>
              <span className="auth-editor__result-meta">Runtime: 56ms · O(n)</span>
            </div>
          </div>

          {/* Stats */}
          <div className="auth-panel__stats">
            {[["500+","Problems"],["50K+","Developers"],["95%","Success"]].map(([n,l]) => (
              <div key={l} className="auth-panel__stat">
                <div className="auth-panel__stat-num">{n}</div>
                <div className="auth-panel__stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-sub">Free forever — no credit card required.</p>
          </div>

          {(error || googleError) && (
            <div className="auth-error" role="alert">
              <svg className="auth-error__icon" width="16" height="16" fill="none"
                stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
              </svg>
              <span className="auth-error__msg">{error || googleError}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="auth-field">
              <label className="auth-label">
                <svg width="13" height="13" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                First Name
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Abhijeet"
                className={`auth-input${errors.firstName ? " auth-input--error" : ""}`}
              />
              {errors.firstName && (
                <span className="auth-field-error">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">
                <svg width="13" height="13" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Address
              </label>
              <input
                {...register("emailId")}
                type="email"
                placeholder="you@example.com"
                className={`auth-input${errors.emailId ? " auth-input--error" : ""}`}
              />
              {errors.emailId && (
                <span className="auth-field-error">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">
                <svg width="13" height="13" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Min. 8 chars — A, a, 1, @"
                className={`auth-input${errors.password ? " auth-input--error" : ""}`}
              />
              {errors.password && (
                <span className="auth-field-error">{errors.password.message}</span>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-submit__spinner" />
              ) : (
                <>
                  Create Account
                  <svg width="15" height="15" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
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
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
