import React, { useState } from "react";
import "./App.css";

function UserIcon({ size = 25 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
    </svg>
  );
}

function OfficerIcon({ size = 25 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10h18" />
      <path d="M5 10v9" />
      <path d="M9 10v9" />
      <path d="M15 10v9" />
      <path d="M19 10v9" />
      <path d="M2 19h20" />
      <path d="M12 3l9 5H3l9-5z" />
    </svg>
  );
}

function EyeIcon({ show }) {
  return show ? (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.1" />
      <path d="M6.7 6.7C3.7 8.6 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.42 1.42" />
      <path d="M17.65 17.65l1.42 1.42" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.42-1.42" />
      <path d="M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l8 3v5c0 5.2-3.3 8.8-8 10-4.7-1.2-8-4.8-8-10V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5a3 3 0 0 1 0 6" />
      <path d="M18 14c1.7 1 3 2.8 3 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loginType, setLoginType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      
      {/* ================= TOP GOVERNMENT BAR ================= */}
      <header className="top-bar">
        <div className="government-title">
          <span className="gov-marathi">महाराष्ट्र शासन</span>
          <span className="gov-divider">|</span>
          <span>Kopargaon Municipal Council</span>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
          <span>{darkMode ? "उजळ मोड" : "गडद मोड"}</span>
        </button>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-container">

        {/* ================= LEFT BRANDING ================= */}
        <section className="brand-section">

          <div className="brand-logo-box">
            <img
              src="/logo.png"
              alt="Majhi Mati Logo"
              className="main-logo"
            />
          </div>

          <div className="brand-line">
            <span></span>
            <b></b>
            <span></span>
          </div>

          <h2 className="brand-marathi">
            डिजिटल विकास निरीक्षण आणि
            <br />
            शासन व्यवस्थापन प्रणाली
          </h2>

          <p className="brand-description">
            पारदर्शक विकासासाठी
            <br />
            एकात्मिक डिजिटल व्यासपीठ
          </p>

        </section>

        {/* ================= LOGIN CARD ================= */}
        <section className="login-card">

          {/* Emblem */}
          <div className="emblem-wrapper">
            <img
              src="/emblem.png"
              alt="Government Emblem"
              className="emblem"
            />
          </div>

          <h1>सुरक्षित लॉगिन</h1>

          <p className="login-subtitle">
            विकास निरीक्षण पोर्टल
          </p>

          {/* Login Type */}
          <div className="field-title">
            लॉगिन प्रकार निवडा
          </div>

          <div className="login-types">

            <button
              className={`login-type ${
                loginType === "user" ? "selected" : ""
              }`}
              onClick={() => setLoginType("user")}
            >
              <div className="type-icon">
                <UserIcon />
              </div>

              <div className="type-content">
                <strong>नागरिक</strong>
                <small>User / Citizen</small>
              </div>
            </button>

            <button
              className={`login-type ${
                loginType === "officer" ? "selected" : ""
              }`}
              onClick={() => setLoginType("officer")}
            >
              <div className="type-icon">
                <OfficerIcon />
              </div>

              <div className="type-content">
                <strong>अधिकारी</strong>
                <small>Municipal Officer</small>
              </div>
            </button>

          </div>

          {/* Dynamic heading */}
          <h2 className="login-heading">
            {loginType === "user"
              ? "नागरिक खात्यात लॉगिन करा"
              : "अधिकारी खात्यात लॉगिन करा"}
          </h2>

          {/* Username */}
          <div className="input-wrapper">

            <div className="input-icon">
              <UserIcon size={22} />
            </div>

            <input
              type="text"
              placeholder={
                loginType === "user"
                  ? "मोबाईल नंबर किंवा ईमेल"
                  : "अधिकारी आयडी किंवा ईमेल"
              }
            />

          </div>

          {/* Password */}
          <div className="input-wrapper">

            <div className="input-icon">
              <ShieldIcon />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="पासवर्ड"
            />

            <button
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              <EyeIcon show={showPassword} />
            </button>

          </div>

          {/* Remember + Forgot */}
          <div className="login-options">

            <label className="remember">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span>मला लक्षात ठेवा</span>

            </label>

            <button className="forgot">
              पासवर्ड विसरलात?
            </button>

          </div>

          {/* Login Button */}
          <button className="login-button">

            <span>
              {loginType === "user"
                ? "नागरिक लॉगिन"
                : "अधिकारी लॉगिन"}
            </span>

            <span className="arrow">→</span>

          </button>

          {/* Register */}
          {loginType === "user" && (
            <div className="register">

              <span>नवीन नागरिक खाते?</span>

              <button>
                नोंदणी करा
              </button>

            </div>
          )}

          {/* Security */}
          <div className="security">

            <ShieldIcon />

            <span>
              सुरक्षित आणि संरक्षित लॉगिन
            </span>

          </div>

        </section>

        {/* ================= RIGHT INFORMATION ================= */}
        <section className="info-section">

          <div className="info-heading">

            <h2>माझी माती</h2>

            <p>
              पारदर्शक विकासासाठी डिजिटल व्यासपीठ
            </p>

          </div>

          <div className="feature-list">

            <Feature
              icon={<DocumentIcon />}
              title="विकास निरीक्षण"
              subtitle="Phase-wise Monitoring"
            />

            <Feature
              icon={<OfficerIcon />}
              title="शासन पारदर्शकता"
              subtitle="Governance Transparency"
            />

            <Feature
              icon={<PeopleIcon />}
              title="नागरिक सहभाग"
              subtitle="Citizen Participation"
            />

            <Feature
              icon={<ShieldIcon />}
              title="उत्तरदायित्व"
              subtitle="Accountability"
            />

          </div>

          {/* Mini statistics */}
          <div className="mini-stats">

            <div>
              <strong>100%</strong>
              <span>पारदर्शकता</span>
            </div>

            <div>
              <strong>24×7</strong>
              <span>डिजिटल प्रवेश</span>
            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div>
          © 2026 माझी माती — Kopargaon Municipal Council
        </div>

        <div className="footer-right">
          <span>गोपनीयता</span>
          <span>•</span>
          <span>सुरक्षा</span>
          <span>•</span>
          <span>सहाय्य</span>
        </div>

      </footer>

    </div>
  );
}


/* ================= FEATURE COMPONENT ================= */

function Feature({ icon, title, subtitle }) {
  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <div className="feature-text">

        <strong>{title}</strong>

        <span>{subtitle}</span>

      </div>

      <CheckIcon />

    </div>
  );
}

export default App;