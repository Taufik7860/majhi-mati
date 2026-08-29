import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, LogOut, FolderCheck, CheckCircle2, Clock, 
  TrendingUp, Plus, Search, MapPin, Download, Edit3, Save, CheckSquare
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [officerName, setOfficerName] = useState("Municipal Officer");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Government Project Lifecycle List
  const [projects, setProjects] = useState([
    {
      id: 1,
      titleMr: "सौर पथदिवे योजना",
      titleEn: "Solar Street Light Installation Project",
      location: "Kopargaon - Ward 3",
      budget: 1250000,
      lifecycleStage: "Tender / Contract", // Concept Note | Feasibility | DPR | Admin Approval | Financial Approval | Tender / Contract
      priority: "High Priority",
      decisionReason: "सुरक्षा आणि वीज बचत: वॉर्ड ३ मध्ये रात्रीच्या वेळी सुरक्षिततेसाठी तातडीने सौर दिव्यांची गरज आहे.",
      progress: 75,
      contractor: "Maharashtra Green Energy Ltd.",
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
      budgetBreakdown: [
        { item: "Raw Material (Concrete/Steel)", cost: 2800000 },
        { item: "Machinery & Labor", cost: 1200000 },
        { item: "Drainage Construction", cost: 500000 },
      ]
    }
  ]);

  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.full_name) setOfficerName(parsed.full_name);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    navigate("/");
  };

  // Start Editing Decision & Progress
  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setEditFormData({
      lifecycleStage: project.lifecycleStage,
      priority: project.priority,
      decisionReason: project.decisionReason,
      progress: project.progress,
    });
  };

  // Save Priority & Reason Decision (Visible to Citizens)
  const saveDecision = (id) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...editFormData } : p));
    setEditingProjectId(null);
    alert("प्रकल्प प्राधान्य निर्णय आणि कारण यशस्वीरीत्या अपडेट झाले!");
  };

  // Export to Word Format
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
        <p><b>कामाची प्रगती / Work Progress:</b> ${project.progress}%</p>
        <p><b>ठेकेदार / Contractor:</b> ${project.contractor}</p>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.titleEn}_Official_Report.doc`;
    a.click();
  };

  // Export Budget Breakdown to CSV Format
  const downloadBudgetCSV = (project) => {
    let csvContent = "data:text/csv;charset=utf-8,Budget Head,Cost (INR)\n";
    project.budgetBreakdown.forEach(row => {
      csvContent += `"${row.item}",${row.cost}\n`;
    });
    csvContent += `"Total Budget",${project.budget}\n`;

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = `${project.titleEn}_Budget_Breakdown.csv`;
    a.click();
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Building2 size={24} color="#fef08a" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>माझी माती • अधिकारी पोर्टल</h2>
            <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>प्रकल्प संनियंत्रण आणि निर्णय प्रणाली</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem" }}>{officerName}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={14} /> लॉगआउट
          </button>
        </div>
      </header>

      {/* METRICS */}
      <div style={styles.metricsContainer}>
        <div style={{ ...styles.metricCard, borderLeft: "4px solid #0284c7" }}>
          <div><div style={styles.metricLabel}>एकूण प्रकल्प</div><div style={styles.metricValue}>2</div></div>
        </div>
        <div style={{ ...styles.metricCard, borderLeft: "4px solid #16a34a" }}>
          <div><div style={styles.metricLabel}>टेंडर टप्प्यात (Tender)</div><div style={styles.metricValue}>1</div></div>
        </div>
        <div style={{ ...styles.metricCard, borderLeft: "4px solid #d97706" }}>
          <div><div style={styles.metricLabel}>प्रशासकीय मान्यता</div><div style={styles.metricValue}>1</div></div>
        </div>
      </div>

      {/* PROJECT MANAGEMENT & DECISION TABLE */}
      <main style={styles.content}>
        <div style={styles.tableCard}>
          <div style={styles.toolbar}>
            <h3 style={{ margin: 0, color: "#0f2b48" }}>प्रकल्प प्राधान्य व प्रगती संनियंत्रण (Decision & Progress)</h3>
            <div style={styles.searchBox}>
              <Search size={16} color="#64748b" />
              <input type="text" placeholder="प्रकल्प शोधा..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>प्रकल्प नाव</th>
                <th style={styles.th}>सरकारी टप्पा (Stage)</th>
                <th style={styles.th}>प्राधान्य व कारण (Decision & Reason)</th>
                <th style={styles.th}>प्रगती (%)</th>
                <th style={{ ...styles.th, textAlign: "right" }}>कृती (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "700" }}>{p.titleMr}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.location}</div>
                    <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: "600" }}>₹{p.budget.toLocaleString('en-IN')}</div>
                  </td>

                  {/* Editable Stage */}
                  <td style={styles.td}>
                    {editingProjectId === p.id ? (
                      <select
                        value={editFormData.lifecycleStage}
                        onChange={(e) => setEditFormData({ ...editFormData, lifecycleStage: e.target.value })}
                        style={styles.selectInput}
                      >
                        <option value="Concept Note">Concept Note</option>
                        <option value="Feasibility Report">Feasibility Report</option>
                        <option value="DPR">DPR</option>
                        <option value="Administrative Approval">Administrative Approval</option>
                        <option value="Financial Approval">Financial Approval</option>
                        <option value="Tender / Contract">Tender / Contract</option>
                      </select>
                    ) : (
                      <span style={styles.stageTag}>{p.lifecycleStage}</span>
                    )}
                  </td>

                  {/* Priority & Selection Reason (Visible to Citizens) */}
                  <td style={{ ...styles.td, maxWidth: "300px" }}>
                    {editingProjectId === p.id ? (
                      <div>
                        <select
                          value={editFormData.priority}
                          onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                          style={{ ...styles.selectInput, marginBottom: "0.4rem" }}
                        >
                          <option value="High Priority">High Priority</option>
                          <option value="Medium Priority">Medium Priority</option>
                          <option value="Low Priority">Low Priority</option>
                        </select>
                        <textarea
                          rows={2}
                          value={editFormData.decisionReason}
                          onChange={(e) => setEditFormData({ ...editFormData, decisionReason: e.target.value })}
                          placeholder="हा प्रकल्प आधी का सुरू करत आहात? कारण लिहा..."
                          style={styles.textAreaInput}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: "700", color: "#b45309", fontSize: "0.78rem" }}>{p.priority}</div>
                        <div style={{ fontSize: "0.78rem", color: "#334155", marginTop: "0.2rem" }}>{p.decisionReason}</div>
                      </div>
                    )}
                  </td>

                  {/* Editable Progress */}
                  <td style={styles.td}>
                    {editingProjectId === p.id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData.progress}
                        onChange={(e) => setEditFormData({ ...editFormData, progress: Number(e.target.value) })}
                        style={{ width: "60px", padding: "0.2rem" }}
                      />
                    ) : (
                      <div>
                        <strong>{p.progress}%</strong>
                        <div style={styles.progressTrack}>
                          <div style={{ ...styles.progressFill, width: `${p.progress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    {editingProjectId === p.id ? (
                      <button onClick={() => saveDecision(p.id)} style={styles.saveBtn}>
                        <Save size={14} /> सेव्ह करा
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                        <button onClick={() => startEditing(p)} style={styles.editBtn}>
                          <Edit3 size={14} /> निर्णय बदला
                        </button>
                        <button onClick={() => downloadWordDoc(p)} style={styles.downloadBtnWord}>
                          <Download size={13} /> Word
                        </button>
                        <button onClick={() => downloadBudgetCSV(p)} style={styles.downloadBtnCsv}>
                          <Download size={13} /> CSV
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f4f7fa", fontFamily: "sans-serif" },
  header: { backgroundColor: "#0f2b48", color: "#fff", padding: "0.8rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { display: "flex", alignItems: "center", gap: "0.8rem" },
  logoutBtn: { backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem" },
  metricsContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", padding: "1.2rem 2rem 0 2rem" },
  metricCard: { backgroundColor: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.04)" },
  metricLabel: { fontSize: "0.78rem", color: "#64748b" },
  metricValue: { fontSize: "1.4rem", fontWeight: "800", color: "#0f172a" },
  content: { padding: "1.2rem 2rem" },
  tableCard: { backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" },
  toolbar: { padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" },
  searchBox: { display: "flex", alignItems: "center", gap: "0.4rem", background: "#f8fafc", border: "1px solid #cbd5e1", padding: "0.3rem 0.6rem", borderRadius: "4px" },
  searchInput: { border: "none", background: "transparent", outline: "none", fontSize: "0.82rem" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  tableHeadRow: { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
  th: { padding: "0.8rem", fontSize: "0.75rem", color: "#475569", textTransform: "uppercase" },
  tableRow: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "0.8rem", verticalAlign: "top", fontSize: "0.82rem" },
  stageTag: { backgroundColor: "#dbeafe", color: "#1e40af", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: "600" },
  selectInput: { width: "100%", padding: "0.3rem", fontSize: "0.78rem", border: "1px solid #cbd5e1", borderRadius: "4px" },
  textAreaInput: { width: "100%", padding: "0.3rem", fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "4px" },
  progressTrack: { height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", width: "80px", marginTop: "0.2rem" },
  progressFill: { height: "100%", backgroundColor: "#16a34a", borderRadius: "3px" },
  saveBtn: { backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" },
  editBtn: { backgroundColor: "#0f2b48", color: "#fff", border: "none", padding: "0.35rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" },
  downloadBtnWord: { backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "0.35rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" },
  downloadBtnCsv: { backgroundColor: "#059669", color: "#fff", border: "none", padding: "0.35rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }
};