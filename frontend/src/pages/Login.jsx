import { useState } from "react";

import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Landmark,
  Users,
  FileCheck2,
} from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "user") {
      alert("नागरिक लॉगिन निवडले आहे");
    } else {
      alert("अधिकारी लॉगिन निवडले आहे");
    }
  };

  return (
    <main className="login-page">

      {/* =========================================
          TOP GOVERNMENT BAR
      ========================================= */}

      <header className="top-bar">

        <div className="top-left">
          महाराष्ट्र शासन
        </div>

        <div className="top-right">
          Kopargaon Municipal Council
        </div>

      </header>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="main-content">

        {/* =====================================
            LEFT: LOGO / BRANDING
        ===================================== */}

        <div className="branding">

          <img
            src="/logo.png"
            alt="माझी माती"
            className="main-logo"
          />

          <div className="branding-line"></div>

          <p className="branding-description">
            डिजिटल विकास निरीक्षण आणि
            <br />
            शासन व्यवस्थापन प्रणाली
          </p>

        </div>


        {/* =====================================
            CENTER: LOGIN CARD
        ===================================== */}

        <div className="login-card">

          {/* Emblem */}

          <img
            src="/emblem.png"
            alt="Government Emblem"
            className="emblem"
          />


          <div className="login-card-title">
            सुरक्षित लॉगिन
          </div>

          <div className="login-card-subtitle">
            विकास निरीक्षण पोर्टल
          </div>


          {/* =================================
              ROLE SELECTION
          ================================= */}

          <div className="role-label">
            लॉगिन प्रकार निवडा
          </div>


          <div className="role-selector">

            {/* USER */}

            <button
              type="button"
              className={`role-button ${
                role === "user" ? "active" : ""
              }`}
              onClick={() => setRole("user")}
            >

              <span className="role-icon">
                <User size={21} />
              </span>

              <span className="role-content">

                <strong>
                  नागरिक
                </strong>

                <small>
                  User / Citizen
                </small>

              </span>

            </button>


            {/* OFFICER */}

            <button
              type="button"
              className={`role-button ${
                role === "officer" ? "active" : ""
              }`}
              onClick={() => setRole("officer")}
            >

              <span className="role-icon">
                <Landmark size={21} />
              </span>

              <span className="role-content">

                <strong>
                  अधिकारी
                </strong>

                <small>
                  Municipal Officer
                </small>

              </span>

            </button>

          </div>


          {/* =================================
              LOGIN FORM
          ================================= */}

          <form onSubmit={handleLogin}>

            <h2 className="form-heading">

              {role === "user"
                ? "नागरिक खात्यात लॉगिन करा"
                : "अधिकारी खात्यात लॉगिन करा"}

            </h2>


            {/* USERNAME */}

            <div className="input-wrapper">

              <User size={18} />

              <input
                type="text"
                required
                placeholder={
                  role === "user"
                    ? "मोबाईल नंबर किंवा ईमेल"
                    : "अधिकारी ID किंवा ईमेल"
                }
              />

            </div>


            {/* PASSWORD */}

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                placeholder="पासवर्ड"
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>


            {/* OPTIONS */}

            <div className="login-options">

              <label>

                <input type="checkbox" />

                <span>
                  मला लक्षात ठेवा
                </span>

              </label>


              <button
                type="button"
                className="forgot-button"
              >
                पासवर्ड विसरलात?
              </button>

            </div>


            {/* LOGIN */}

            <button
              type="submit"
              className="login-button"
            >

              {role === "user"
                ? "नागरिक लॉगिन"
                : "अधिकारी लॉगिन"}

            </button>

          </form>


          {/* =================================
              USER REGISTER
          ================================= */}

          {role === "user" && (

            <div className="register-text">

              नवीन नागरिक खाते?

              <button type="button">
                नोंदणी करा
              </button>

            </div>

          )}


          {/* =================================
              OFFICER SECURITY
          ================================= */}

          {role === "officer" && (

            <div className="officer-security">

              <ShieldCheck size={16} />

              अधिकृत नगरपालिका अधिकारीांसाठी

            </div>

          )}


          {/* SECURITY */}

          <div className="secure">

            <ShieldCheck size={14} />

            सुरक्षित आणि संरक्षित लॉगिन

          </div>

        </div>


        {/* =====================================
            RIGHT: FEATURES
        ===================================== */}

        <div className="features">

          <h3>
            माझी माती
          </h3>

          <p className="features-subtitle">
            पारदर्शक विकासासाठी डिजिटल व्यासपीठ
          </p>


          <Feature
            icon={<FileCheck2 />}
            title="विकास निरीक्षण"
            subtitle="Phase-wise Monitoring"
          />


          <Feature
            icon={<Landmark />}
            title="शासन पारदर्शकता"
            subtitle="Governance Transparency"
          />


          <Feature
            icon={<Users />}
            title="नागरिक सहभाग"
            subtitle="Citizen Participation"
          />


          <Feature
            icon={<ShieldCheck />}
            title="उत्तरदायित्व"
            subtitle="Accountability"
          />

        </div>

      </section>


      {/* =========================================
          BOTTOM FOOTER
      ========================================= */}

      <footer className="bottom-footer">

        <div>
          माझं शहर • माझी जबाबदारी • माझा विकास
        </div>

        <div>
          SKH012 • Development Monitoring & Governance System
        </div>

      </footer>

    </main>
  );
}


/* =====================================================
   FEATURE COMPONENT
===================================================== */

function Feature({
  icon,
  title,
  subtitle,
}) {

  return (

    <div className="feature-item">

      <div className="feature-icon">
        {icon}
      </div>

      <div>

        <div className="feature-title">
          {title}
        </div>

        <div className="feature-subtitle">
          {subtitle}
        </div>

      </div>

    </div>

  );
}