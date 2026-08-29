import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, FileText, Download, CheckCircle2, Clock, MapPin, 
  Eye, AlertCircle, Building2, CheckSquare, MessageSquare, Layers
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedProject, setSelectedProject] = useState(null);

  // Government Lifecycle Projects Data
  const [projects] = useState([
    {
      id: 1,
      titleMr: "सौर पथदिवे योजना",
      titleEn: "Solar Street Light Installation Project",
      location: "Kopargaon - Ward 3",
      budget: 1250000,
      lifecycleStage: "Tender / Contract", // Concept Note -> Feasibility -> DPR -> Admin Approval -> Financial Approval -> Tender/Contract
      priority: "High Priority",
      decisionReason: "सुरक्षा आणि वीज बचत: वॉर्ड ३ मध्ये रात्रीच्या वेळी सुरक्षिततेसाठी तातडीने सौर दिव्यांची गरज आहे.",
      progress: 75,
      contractor: "Maharashtra Green Energy Ltd.",
      phases: [
        { name: "Concept Note & Feasibility", status: "Completed", date: "Jan 2026" },
        { name: "DPR & Approvals", status: "Completed", date: "Feb 2026" },
        { name: "Tender Allocation", status: "Completed", date: "Mar 2026" },
        { name: "Pole & Panel Installation", status: "In Progress", date: "Apr 2026" },
      ],
      budgetBreakdown: [
        { item: "Solar Panels & Batteries", cost: 700000 },
        { item: "Poles & Wiring Work", cost: 350000 },
        { item: "Installation & Labor", cost: 200000 },
      ]
    },
    {
      id: 2,
      titleMr: "मुख्य रस्ता काँक्रीटीकरण",
      titleEn: "Main Road Concrete Paving Phase 1",
      location: "Kopargaon - Ward 5",
      budget: 4500000,
      lifecycleStage: "Administrative Approval",
      priority: "High Priority",
      decisionReason: "पावसाळ्यात जलजमाव आणि वाहतूक कोंडी टाळण्यासाठी या मुख्य रस्त्याचे काँक्रीटीकरण प्राधान्याने निवडले आहे.",
      progress: 40,
      contractor: "Shree Infra Projects Ltd.",
      phases: [
        { name: "Concept Note & Feasibility Report", status: "Completed", date: "Jan 2026" },
        { name: "DPR Submission", status: "Completed", date: "Feb 2026" },
        { name: "Administrative & Financial Approval", status: "In Progress", date: "Mar 2026" },
        { name: "Tender Process", status: "Pending", date: "May 2026" },
      ],
      budgetBreakdown: [
        { item: "Raw Material (Concrete/Steel)", cost: 2800000 },
        { item: "Machinery & Labor", cost: 1200000 },
        { item: "Drainage Construction", cost: 500000 },
      ]
    }
  ]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    navigate("/");
  };

  // Export Project Summary to Word (.doc)
  const downloadWordDoc = (project) => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${project.titleEn}</title></head>
      <body>
        <h2>${project.titleMr} (${project.titleEn})</h2>
        <p><b>स्थान / Location:</b> ${project.location}</p>
        <p><b>अंदाजित अर्थसंकल्प / Budget:</b> ₹${project.budget.toLocaleString('en-IN')}</p>
        <p><b>सरकारी टप्पा / Lifecycle Stage:</b> ${project.lifecycleStage}</p>
        <p><b>प्राधान्य (Decision Priority):</b> ${project.priority}</p>
        <p><b>निवडण्याचे कारण (Reason):</b> ${project.decisionReason}</p>
        <p><b>एकूण प्रगती / Work Progress:</b> ${project.progress}%</p>
        <p><b>ठेकेदार / Contractor:</b> ${project.contractor}</p>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.titleEn}_Report.doc`;
    a.click();
  };

  // Export Budget Breakdown to CSV
  const downloadBudgetCSV = (project) => {
    let csvContent = "data:text/csv;charset=utf-8,Item / Head,Cost (INR)\n";
    project.budgetBreakdown.forEach(row => {
      csvContent += `"${row.item}",${row.cost}\n`;
    });
    csvContent += `"Total Budget",${project.budget}\n`;

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = `${project.titleEn}_Budget.csv`;
    a.click();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Building2 size={24} color="#fef08a" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>माझी माती • नागरिक पोर्टल</h2>
            <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>विकास कामे पारदर्शकता व्यासपीठ</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem" }}>{user.full_name || "Citizen User"}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={14} /> बाहेर पडा
          </button>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.welcomeBanner}>
          <h3>नमस्कार, {user.full_name || "नागरिक"} 👋</h3>
          <p>तुमच्या क्षेत्रातील सरकारी विकास प्रकल्पांची स्थिती, बजेट आणि निवडीचे कारण पाहू शकता.</p>
        </div>

        <h3 style={{ marginTop: "1.5rem", color: "#0f2b48" }}>विकास प्रकल्प सूची (Active Government Projects)</h3>

        <div style={styles.projectGrid}>
          {projects.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.stageTag}>{p.lifecycleStage}</span>
                <span style={styles.priorityTag}>{p.priority}</span>
              </div>
              <h4 style={{ margin: "0.5rem 0 0.2rem 0", color: "#0f2b48" }}>{p.titleMr}</h4>
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.5rem" }}>{p.titleEn}</div>

              <div style={styles.infoRow}><MapPin size={14} /> {p.location}</div>
              <div style={styles.infoRow}><strong>बजेट:</strong> ₹{p.budget.toLocaleString('en-IN')}</div>

              {/* Selection Reason Box for Visibility */}
              <div style={styles.reasonBox}>
                <MessageSquare size={14} color="#0284c7" />
                <div>
                  <strong>निवडण्याचे कारण (Official Reason):</strong>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.78rem" }}>{p.decisionReason}</p>
                </div>
              </div>

              {/* Work Progress Bar */}
              <div style={{ marginTop: "0.8rem" }}>
                <div style={styles.progressHeader}>
                  <span>कामाची प्रगती (Progress)</span>
                  <strong>{p.progress}%</strong>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: `${p.progress}%` }}></div>
                </div>
              </div>

              {/* Actions & Export Options */}
              <div style={styles.cardActions}>
                <button onClick={() => setSelectedProject(p)} style={styles.viewBtn}>
                  <Eye size={14} /> टप्पे पहा
                </button>
                <button onClick={() => downloadWordDoc(p)} style={styles.downloadBtnWord}>
                  <Download size={14} /> Word (.doc)
                </button>
                <button onClick={() => downloadBudgetCSV(p)} style={styles.downloadBtnCsv}>
                  <Download size={14} /> Budget (.csv)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Lifecycle Phases */}
        {selectedProject && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>{selectedProject.titleMr} - प्रकल्प टप्पे (Phases)</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Government Project Lifecycle & Progress</p>

              <div style={{ marginTop: "1rem" }}>
                {selectedProject.phases.map((phase, idx) => (
                  <div key={idx} style={styles.phaseItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {phase.status === "Completed" ? <CheckCircle2 color="#16a34a" size={18} /> : <Clock color="#d97706" size={18} />}
                      <strong>{phase.name}</strong>
                    </div>
                    <span style={styles.phaseBadge}>{phase.status} ({phase.date})</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setSelectedProject(null)} style={styles.closeBtn}>बंद करा</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" },
  header: { backgroundColor: "#0f2b48", color: "#fff", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { display: "flex", alignItems: "center", gap: "0.8rem" },
  logoutBtn: { backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" },
  content: { padding: "1.5rem 2rem", maxWidth: "1200px", margin: "0 auto" },
  welcomeBanner: { background: "#e0f2fe", borderLeft: "4px solid #0284c7", padding: "1rem 1.2rem", borderRadius: "6px" },
  projectGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.2rem", marginTop: "1rem" },
  card: { backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "1.2rem", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  stageTag: { backgroundColor: "#dbeafe", color: "#1e40af", fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "600" },
  priorityTag: { backgroundColor: "#fef3c7", color: "#b45309", fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "700" },
  infoRow: { fontSize: "0.82rem", color: "#334155", margin: "0.3rem 0", display: "flex", alignItems: "center", gap: "0.4rem" },
  reasonBox: { backgroundColor: "#f0f9ff", border: "1px solid #bae6fd", padding: "0.6rem", borderRadius: "6px", margin: "0.8rem 0", display: "flex", gap: "0.5rem", color: "#0369a1" },
  progressHeader: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#475569", marginBottom: "0.2rem" },
  progressTrack: { height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#16a34a", borderRadius: "4px" },
  cardActions: { display: "flex", gap: "0.4rem", marginTop: "1rem", flexWrap: "wrap" },
  viewBtn: { flex: 1, backgroundColor: "#0f2b48", color: "#fff", border: "none", padding: "0.45rem", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" },
  downloadBtnWord: { backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "0.45rem", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" },
  downloadBtnCsv: { backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "0.45rem", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", width: "90%", maxWidth: "500px" },
  phaseItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #f1f5f9", fontSize: "0.85rem" },
  phaseBadge: { fontSize: "0.72rem", backgroundColor: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "4px" },
  closeBtn: { marginTop: "1rem", width: "100%", backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "4px", cursor: "pointer" }
};