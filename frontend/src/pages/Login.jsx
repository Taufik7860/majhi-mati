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

import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/* =====================================================
   OFFICER ROLES
===================================================== */

const OFFICER_ROLES = [
  "officer",
  "municipal_officer",
  "municipal_admin",
  "super_admin",
];

/* =====================================================
   LOGIN COMPONENT
===================================================== */

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Authentication State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
      SUPABASE LOGIN
  ===================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    /* ---------------------------------------------
       BASIC VALIDATION
    --------------------------------------------- */

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("कृपया ईमेल भरा.");
      return;
    }

    if (!password) {
      setError("कृपया पासवर्ड भरा.");
      return;
    }

    setLoading(true);

    try {
      console.log("=================================");
      console.log("LOGIN STARTED");
      console.log("Email:", cleanEmail);
      console.log("Selected Role:", role);
      console.log("=================================");

      /* =================================================
         STEP 1
         SUPABASE AUTHENTICATION
      ================================================= */

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError) {
        console.error("Supabase Auth Error:", authError);

        setError(
          authError.message ||
            "लॉगिन अयशस्वी झाले. कृपया ईमेल आणि पासवर्ड तपासा."
        );

        return;
      }

      if (!authData || !authData.user) {
        setError("वापरकर्ता सापडला नाही.");
        return;
      }

      const authenticatedUser = authData.user;

      console.log("Authenticated User:", authenticatedUser);

      /* =================================================
         STEP 2
         GET USER PROFILE
      ================================================= */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", authenticatedUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile Fetch Error:", profileError);

        setError(
          "प्रोफाइल तपासताना त्रुटी आली. कृपया प्रशासकाशी संपर्क साधा."
        );

        await supabase.auth.signOut();

        return;
      }

      console.log("Profile:", profile);

      /* =================================================
         STEP 3
         PROFILE NOT FOUND
      ================================================= */

      if (!profile) {
        setError(
          "वापरकर्ता प्रोफाइल सापडली नाही. कृपया प्रशासकाशी संपर्क साधा."
        );

        await supabase.auth.signOut();

        return;
      }

      /* =================================================
         STEP 4
         DETERMINE REAL DATABASE ROLE
      ================================================= */

      const dbRole = String(profile.role || "").toLowerCase();

      const isOfficerAccount =
        OFFICER_ROLES.includes(dbRole);

      const isCitizenAccount =
        !isOfficerAccount;

      console.log("Database Role:", dbRole);
      console.log("Officer Account:", isOfficerAccount);

      /* =================================================
         STEP 5
         CHECK SELECTED LOGIN TAB
      ================================================= */

      // If citizen tab selected but officer account is used,
      // we still route according to the real database role.

      if (role === "officer" && !isOfficerAccount) {
        setError(
          "या खात्याला अधिकारी प्रवेश नाही. कृपया नागरिक लॉगिन वापरा."
        );

        await supabase.auth.signOut();

        return;
      }

      /* =================================================
         STEP 6
         CREATE LOCAL USER SESSION DATA
      ================================================= */

      const userData = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        full_name:
          profile.full_name ||
          (isOfficerAccount
            ? "Municipal Officer"
            : "Citizen User"),
        role: dbRole,
      };

      /*
        Store user information locally.

        Supabase itself maintains the authentication
        session. This localStorage entry is only used
        by our application for dashboard information.
      */

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      /* =================================================
         REMEMBER ME
      ================================================= */

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem("rememberMe");
      }

      console.log("Login successful.");
      console.log("User:", userData);

      /* =================================================
         STEP 7
         ROLE-BASED DASHBOARD NAVIGATION
      ================================================= */

      if (isOfficerAccount) {
        console.log(
          "Opening Municipal Officer Dashboard..."
        );

        navigate("/officer/dashboard", {
          replace: true,
        });
      } else {
        console.log(
          "Opening Citizen Dashboard..."
        );

        navigate("/citizen/dashboard", {
          replace: true,
        });
      }

    } catch (err) {
      console.error("Login Exception:", err);

      setError(
        err?.message ||
          "लॉगिन करताना समस्या आली. कृपया पुन्हा प्रयत्न करा."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      FORGOT PASSWORD
  ===================================================== */

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError(
        "पासवर्ड रीसेट करण्यासाठी प्रथम ईमेल भरा."
      );

      return;
    }

    setError("");

    try {
      setLoading(true);

      const {
        error: resetError,
      } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        console.error(
          "Password Reset Error:",
          resetError
        );

        setError(resetError.message);

        return;
      }

      alert(
        "पासवर्ड रीसेट लिंक तुमच्या ईमेलवर पाठवण्यात आली आहे."
      );

    } catch (err) {
      console.error(
        "Password Reset Exception:",
        err
      );

      setError(
        err?.message ||
          "पासवर्ड रीसेट करताना समस्या आली."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      UI
  ===================================================== */

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
            LEFT: BRANDING
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


          {/* GOVERNMENT EMBLEM */}

          <img
            src="/emblem.png"
            alt="Government Emblem"
            className="emblem"
          />


          {/* TITLE */}

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


            {/* =================================
                CITIZEN
            ================================= */}

            <button
              type="button"
              className={`role-button ${
                role === "user"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setRole("user");
                setError("");
              }}
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


            {/* =================================
                OFFICER
            ================================= */}

            <button
              type="button"
              className={`role-button ${
                role === "officer"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setRole("officer");
                setError("");
              }}
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


            {/* FORM HEADING */}

            <h2 className="form-heading">

              {role === "user"
                ? "नागरिक खात्यात लॉगिन करा"
                : "अधिकारी खात्यात लॉगिन करा"}

            </h2>


            {/* =================================
                ERROR MESSAGE
            ================================= */}

            {error && (

              <div
                className="login-error"
                role="alert"
              >

                {error}

              </div>

            )}


            {/* =================================
                EMAIL
            ================================= */}

            <div className="input-wrapper">

              <User size={18} />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder={
                  role === "user"
                    ? "नागरिक ईमेल"
                    : "अधिकारी ईमेल"
                }
                autoComplete="email"
              />

            </div>


            {/* =================================
                PASSWORD
            ================================= */}

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="पासवर्ड"
                autoComplete="current-password"
              />


              {/* PASSWORD VISIBILITY */}

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>


            {/* =================================
                OPTIONS
            ================================= */}

            <div className="login-options">


              {/* REMEMBER ME */}

              <label>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span>
                  मला लक्षात ठेवा
                </span>

              </label>


              {/* FORGOT PASSWORD */}

              <button
                type="button"
                className="forgot-button"
                onClick={
                  handleForgotPassword
                }
                disabled={loading}
              >

                पासवर्ड विसरलात?

              </button>

            </div>


            {/* =================================
                LOGIN BUTTON
            ================================= */}

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >

              {loading
                ? "प्रक्रिया सुरू आहे..."
                : role === "user"
                ? "नागरिक लॉगिन"
                : "अधिकारी लॉगिन"}

            </button>

          </form>


          {/* =================================
              CITIZEN REGISTRATION
          ================================= */}

          {role === "user" && (

            <div className="register-text">

              नवीन नागरिक खाते?

              <button
                type="button"
                onClick={() => {

                  alert(
                    "नागरिक नोंदणी सुविधा लवकरच उपलब्ध होईल."
                  );

                }}
              >

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


          {/* =================================
              SECURITY MESSAGE
          ================================= */}

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
          FOOTER
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