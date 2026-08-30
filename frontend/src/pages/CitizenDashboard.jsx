import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import piexif from "piexifjs";
import {
  LogOut,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  Building2,
  MessageSquare,
  CalendarDays,
  X,
  TrendingUp,
  FileText,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CitizenDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [selectedProject, setSelectedProject] = useState(null);
  const [showGantt, setShowGantt] = useState(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [submittingSupport, setSubmittingSupport] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [supportForm, setSupportForm] = useState({
    name: "",
    subject: "",
    description: "",
    uploadedFile: null,
  });

  /*
  =========================================================
  GOVERNMENT PROJECT DATA
  =========================================================
  */

  const [projects] = useState([
    {
      id: 1,

      titleMr: "सौर पथदिवे योजना",

      titleEn: "Solar Street Light Installation Project",

      location: "Kopargaon - Ward 3",

      budget: 1250000,

      lifecycleStage: "Tender / Contract",

      priority: "High Priority",

      decisionReason:
        "सुरक्षा आणि वीज बचत: वॉर्ड ३ मध्ये रात्रीच्या वेळी सुरक्षिततेसाठी तातडीने सौर दिव्यांची गरज आहे.",

      progress: 75,

      contractor: "Maharashtra Green Energy Ltd.",

      startDate: "2026-01-05",

      endDate: "2026-06-30",

      phases: [
        {
          name: "Concept Note",
          status: "Completed",
          start: "2026-01-05",
          end: "2026-01-20",
          progress: 100,
        },

        {
          name: "Feasibility Report",
          status: "Completed",
          start: "2026-01-21",
          end: "2026-02-10",
          progress: 100,
        },

        {
          name: "DPR",
          status: "Completed",
          start: "2026-02-11",
          end: "2026-02-28",
          progress: 100,
        },

        {
          name: "Administrative Approval",
          status: "Completed",
          start: "2026-03-01",
          end: "2026-03-10",
          progress: 100,
        },

        {
          name: "Financial Approval",
          status: "Completed",
          start: "2026-03-11",
          end: "2026-03-20",
          progress: 100,
        },

        {
          name: "Tender / Contract",
          status: "Completed",
          start: "2026-03-21",
          end: "2026-04-05",
          progress: 100,
        },

        {
          name: "Pole & Panel Installation",
          status: "In Progress",
          start: "2026-04-06",
          end: "2026-06-15",
          progress: 75,
        },

        {
          name: "Final Inspection",
          status: "Pending",
          start: "2026-06-16",
          end: "2026-06-30",
          progress: 0,
        },
      ],

      budgetBreakdown: [
        {
          item: "Solar Panels & Batteries",
          cost: 700000,
        },
        {
          item: "Poles & Wiring Work",
          cost: 350000,
        },
        {
          item: "Installation & Labor",
          cost: 200000,
        },
      ],
    },

    {
      id: 2,

      titleMr: "मुख्य रस्ता काँक्रीटीकरण",

      titleEn: "Main Road Concrete Paving Phase 1",

      location: "Kopargaon - Ward 5",

      budget: 4500000,

      lifecycleStage: "Administrative Approval",

      priority: "High Priority",

      decisionReason:
        "पावसाळ्यात जलजमाव आणि वाहतूक कोंडी टाळण्यासाठी या मुख्य रस्त्याचे काँक्रीटीकरण प्राधान्याने निवडले आहे.",

      progress: 40,

      contractor: "Shree Infra Projects Ltd.",

      startDate: "2026-01-10",

      endDate: "2026-09-30",

      phases: [
        {
          name: "Concept Note",
          status: "Completed",
          start: "2026-01-10",
          end: "2026-01-25",
          progress: 100,
        },

        {
          name: "Feasibility Report",
          status: "Completed",
          start: "2026-01-26",
          end: "2026-02-15",
          progress: 100,
        },

        {
          name: "DPR",
          status: "Completed",
          start: "2026-02-16",
          end: "2026-03-10",
          progress: 100,
        },

        {
          name: "Administrative Approval",
          status: "In Progress",
          start: "2026-03-11",
          end: "2026-04-15",
          progress: 40,
        },

        {
          name: "Financial Approval",
          status: "Pending",
          start: "2026-04-16",
          end: "2026-05-15",
          progress: 0,
        },

        {
          name: "Tender / Contract",
          status: "Pending",
          start: "2026-05-16",
          end: "2026-06-15",
          progress: 0,
        },

        {
          name: "Road Construction",
          status: "Pending",
          start: "2026-06-16",
          end: "2026-09-15",
          progress: 0,
        },

        {
          name: "Final Inspection",
          status: "Pending",
          start: "2026-09-16",
          end: "2026-09-30",
          progress: 0,
        },
      ],

      budgetBreakdown: [
        {
          item: "Raw Material (Concrete/Steel)",
          cost: 2800000,
        },
        {
          item: "Machinery & Labor",
          cost: 1200000,
        },
        {
          item: "Drainage Construction",
          cost: 500000,
        },
      ],
    },
  ]);

  /*
  =========================================================
  LOGOUT
  =========================================================
  */

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("user");

    navigate("/");
  };

  const handleSupportChange = (event) => {
    const { name, value } = event.target;

    setSupportForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSupportFile = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const binary = e.target?.result;
        const exifData = piexif.load(binary);
        
        // Check for GPS (geolocation) data in EXIF
        const gpsIFD = exifData.get("0th")[piexif.ImageIFD.GPSInfo];
        
        if (!gpsIFD) {
          // Show warning with user-requested message
          alert("⚠️ Geotagged photo you need to upload!");
        }

        // Always proceed with upload regardless of geotag status
        if (previewImage && previewImage.startsWith("blob:")) {
          URL.revokeObjectURL(previewImage);
        }

        const nextPreview = URL.createObjectURL(file);
        setPreviewImage(nextPreview);

        setSupportForm((previous) => ({
          ...previous,
          uploadedFile: file,
        }));
      } catch (error) {
        // Even if there's an error reading EXIF, still allow upload
        alert("⚠️ Geotagged photo you need to upload!");
        
        if (previewImage && previewImage.startsWith("blob:")) {
          URL.revokeObjectURL(previewImage);
        }

        const nextPreview = URL.createObjectURL(file);
        setPreviewImage(nextPreview);

        setSupportForm((previous) => ({
          ...previous,
          uploadedFile: file,
        }));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSupportSubmit = async (event) => {
    event.preventDefault();

    if (
      !supportForm.name.trim() ||
      !supportForm.subject.trim() ||
      !supportForm.description.trim()
    ) {
      return;
    }

    setSubmittingSupport(true);

    try {
      const citizenName = supportForm.name.trim();
      const subject = supportForm.subject.trim();
      const description = supportForm.description.trim();

      const generateToken = () => {
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const timePart = String(Date.now()).slice(-4);
        const safeName = citizenName.replace(/\s+/g, "").slice(0, 3).toUpperCase();

        return `MMD-${safeName}-${dateStamp}-${timePart}`;
      };

      const token = generateToken();
      let uploadedFileName = "";
      let uploadedFileUrl = "";

      if (supportForm.uploadedFile) {
        const file = supportForm.uploadedFile;
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("citizen-complaints")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message || "Image upload failed.");
        }

        uploadedFileName = file.name;
        uploadedFileUrl = supabase.storage
          .from("citizen-complaints")
          .getPublicUrl(uploadData.path).data.publicUrl;
      }

      const { data: complaint, error: insertError } = await supabase
        .from("citizen_complaints")
        .insert([
          {
            citizen_name: citizenName,
            subject,
            description,
            uploaded_file_name: uploadedFileName,
            uploaded_file_url: uploadedFileUrl,
            status: "new",
            token,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message || "Complaint could not be saved.");
      }

      setGeneratedToken({
        token: complaint.token,
        name: complaint.citizen_name,
        subject: complaint.subject,
        description: complaint.description,
        uploadedFile: complaint.uploaded_file_name,
        uploadedImage: uploadedFileUrl || previewImage || null,
        date: new Date(complaint.created_at).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });

      setSupportForm({
        name: "",
        subject: "",
        description: "",
        uploadedFile: null,
      });

      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(null);

      setSupportOpen(false);
    } catch (error) {
      alert(error.message || "Unable to create support token.");
    } finally {
      setSubmittingSupport(false);
    }
  };

  /*
  =========================================================
  WORD DOWNLOAD
  =========================================================
  */

  const downloadWordDoc = (project) => {
    const content = `
      <html>

      <head>
        <meta charset="UTF-8">
        <title>${project.titleEn}</title>
      </head>

      <body>

        <h1>${project.titleMr}</h1>

        <h3>${project.titleEn}</h3>

        <p>
          <b>स्थान / Location:</b>
          ${project.location}
        </p>

        <p>
          <b>बजेट / Budget:</b>
          ₹${project.budget.toLocaleString("en-IN")}
        </p>

        <p>
          <b>सरकारी टप्पा / Stage:</b>
          ${project.lifecycleStage}
        </p>

        <p>
          <b>प्राधान्य / Priority:</b>
          ${project.priority}
        </p>

        <p>
          <b>निवडण्याचे कारण:</b>
          ${project.decisionReason}
        </p>

        <p>
          <b>कामाची प्रगती:</b>
          ${project.progress}%
        </p>

        <p>
          <b>ठेकेदार:</b>
          ${project.contractor}
        </p>

        <h3>Project Timeline</h3>

        <table border="1" cellpadding="6">

          <tr>
            <th>Phase</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
            <th>Progress</th>
          </tr>

          ${project.phases
            .map(
              (phase) => `
              <tr>
                <td>${phase.name}</td>
                <td>${phase.status}</td>
                <td>${phase.start}</td>
                <td>${phase.end}</td>
                <td>${phase.progress}%</td>
              </tr>
            `
            )
            .join("")}

        </table>

      </body>

      </html>
    `;

    const blob = new Blob(["\ufeff", content], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${project.titleEn}_Report.doc`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  /*
  =========================================================
  CSV DOWNLOAD
  =========================================================
  */

  const downloadBudgetCSV = (project) => {
    let csvContent =
      "Item / Head,Cost (INR)\n";

    project.budgetBreakdown.forEach((row) => {
      csvContent += `"${row.item}",${row.cost}\n`;
    });

    csvContent += `"Total Budget",${project.budget}\n`;

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${project.titleEn}_Budget.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  /*
  =========================================================
  PROJECT GANTT
  =========================================================
  */

  const ProjectGantt = ({ project }) => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);

    const totalTime = end.getTime() - start.getTime();

    const getLeft = (date) => {
      const current = new Date(date);

      return (
        ((current.getTime() - start.getTime()) / totalTime) *
        100
      );
    };

    const getWidth = (startDate, endDate) => {
      const phaseStart = new Date(startDate);
      const phaseEnd = new Date(endDate);

      return (
        ((phaseEnd.getTime() - phaseStart.getTime()) /
          totalTime) *
        100
      );
    };

    const getStatusStyle = (status) => {
      if (status === "Completed") {
        return styles.ganttCompleted;
      }

      if (status === "In Progress") {
        return styles.ganttProgress;
      }

      return styles.ganttPending;
    };

    return (
      <div style={styles.ganttContainer}>

        <div style={styles.ganttHeader}>

          <div>
            <h3 style={styles.ganttTitle}>
              <CalendarDays size={19} />
              प्रकल्प Gantt Chart
            </h3>

            <p style={styles.ganttSubtitle}>
              Phase-wise Development Monitoring Timeline
            </p>
          </div>

          <button
            onClick={() => setShowGantt(null)}
            style={styles.closeIconButton}
          >
            <X size={18} />
          </button>

        </div>

        {/* TIMELINE HEADER */}

        <div style={styles.ganttTimelineHeader}>

          <div style={styles.phaseColumn}>
            Phase / टप्पा
          </div>

          <div style={styles.timelineColumn}>

            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>

          </div>

        </div>

        {/* PHASES */}

        <div>

          {project.phases.map((phase, index) => {

            const left = Math.max(
              0,
              Math.min(100, getLeft(phase.start))
            );

            const width = Math.max(
              3,
              Math.min(
                100 - left,
                getWidth(
                  phase.start,
                  phase.end
                )
              )
            );

            return (
              <div
                key={index}
                style={styles.ganttRow}
              >

                <div style={styles.phaseColumn}>

                  <div style={styles.phaseName}>
                    {phase.name}
                  </div>

                  <div
                    style={{
                      ...styles.phaseStatus,
                      color:
                        phase.status === "Completed"
                          ? "#15803d"
                          : phase.status ===
                            "In Progress"
                          ? "#b45309"
                          : "#64748b",
                    }}
                  >
                    {phase.status}
                  </div>

                </div>

                <div style={styles.timelineColumn}>

                  <div
                    style={{
                      ...styles.ganttBar,
                      ...getStatusStyle(
                        phase.status
                      ),

                      left: `${left}%`,

                      width: `${width}%`,
                    }}
                  >

                    <span>
                      {phase.progress}%
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* LEGEND */}

        <div style={styles.ganttLegend}>

          <div>
            <span
              style={{
                ...styles.legendDot,
                backgroundColor: "#16a34a",
              }}
            />

            Completed
          </div>

          <div>
            <span
              style={{
                ...styles.legendDot,
                backgroundColor: "#f59e0b",
              }}
            />

            In Progress
          </div>

          <div>
            <span
              style={{
                ...styles.legendDot,
                backgroundColor: "#cbd5e1",
              }}
            />

            Pending
          </div>

        </div>

      </div>
    );
  };

  /*
  =========================================================
  RETURN
  =========================================================
  */

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <header style={styles.header}>

        <div style={styles.headerLeft}>

          <div style={styles.headerIcon}>
            <Building2 size={22} />
          </div>

          <div>

            <h2 style={styles.headerTitle}>
              माझी माती • नागरिक पोर्टल
            </h2>

            <span style={styles.headerSubtitle}>
              विकास कामे पारदर्शकता व्यासपीठ
            </span>

          </div>

        </div>

        <div style={styles.headerRight}>

          <span style={styles.userName}>
            {user.full_name || "Citizen User"}
          </span>

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            <LogOut size={14} />
            बाहेर पडा
          </button>

        </div>

      </header>

      <main style={styles.content}>

        {/* WELCOME */}

        <section style={styles.welcomeBanner}>

          <div>

            <div style={styles.welcomeSmall}>
              नागरिक विकास निरीक्षण
            </div>

            <h2 style={styles.welcomeTitle}>
              नमस्कार, {user.full_name || "नागरिक"} 👋
            </h2>

            <p style={styles.welcomeText}>
              तुमच्या क्षेत्रातील सरकारी विकास प्रकल्प,
              त्यांची प्रगती, बजेट, निर्णयाचे कारण आणि
              संपूर्ण टाइमलाइन पारदर्शकपणे पाहा.
            </p>

          </div>

          <div style={styles.bannerActions}>
            <button
              onClick={() => setSupportOpen(true)}
              style={styles.supportBtn}
            >
              <MessageSquare size={16} />
              Officer Support
            </button>

            <div style={styles.welcomeIcon}>
              <TrendingUp size={35} />
            </div>
          </div>

        </section>

        {generatedToken && (
          <div style={styles.tokenBanner}>
            <div>
              <div style={styles.tokenLabel}>Token Generated</div>
              <div style={styles.tokenCode}>{generatedToken.token}</div>
            </div>

            <div style={styles.tokenMeta}>
              <strong>{generatedToken.subject}</strong>
              <span>
                {generatedToken.name} • {generatedToken.date}
              </span>
            </div>

            {generatedToken.uploadedImage && (
              <img
                src={generatedToken.uploadedImage}
                alt="Uploaded complaint reference"
                style={styles.tokenImage}
              />
            )}
          </div>
        )}

        {/* PROJECT TITLE */}

        <div style={styles.sectionHeader}>

          <div>

            <h3 style={styles.sectionTitle}>
              विकास प्रकल्प
            </h3>

            <p style={styles.sectionSubtitle}>
              Active Government Projects
            </p>

          </div>

          <div style={styles.projectCount}>
            {projects.length} Projects
          </div>

        </div>

        {/* PROJECT GRID */}

        <div style={styles.projectGrid}>

          {projects.map((p) => (

            <div
              key={p.id}
              style={styles.card}
            >

              {/* CARD TOP */}

              <div style={styles.cardHeader}>

                <span style={styles.stageTag}>
                  {p.lifecycleStage}
                </span>

                <span style={styles.priorityTag}>
                  {p.priority}
                </span>

              </div>

              {/* TITLE */}

              <h4 style={styles.projectTitle}>
                {p.titleMr}
              </h4>

              <div style={styles.projectEnglish}>
                {p.titleEn}
              </div>

              {/* INFO */}

              <div style={styles.infoRow}>
                <MapPin size={14} />
                {p.location}
              </div>

              <div style={styles.infoRow}>
                <strong>बजेट:</strong>

                <span>
                  ₹{p.budget.toLocaleString("en-IN")}
                </span>
              </div>

              <div style={styles.infoRow}>
                <strong>ठेकेदार:</strong>

                <span>
                  {p.contractor}
                </span>
              </div>

              {/* DECISION REASON */}

              <div style={styles.reasonBox}>

                <MessageSquare
                  size={17}
                />

                <div>

                  <strong>
                    अधिकृत निवड निर्णय
                  </strong>

                  <p style={styles.reasonText}>
                    {p.decisionReason}
                  </p>

                </div>

              </div>

              {/* PROGRESS */}

              <div style={styles.progressSection}>

                <div style={styles.progressHeader}>

                  <span>
                    एकूण कामाची प्रगती
                  </span>

                  <strong>
                    {p.progress}%
                  </strong>

                </div>

                <div style={styles.progressTrack}>

                  <div
                    style={{
                      ...styles.progressFill,

                      width: `${p.progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* ACTIONS */}

              <div style={styles.cardActions}>

                <button
                  onClick={() =>
                    setShowGantt(p)
                  }
                  style={styles.ganttButton}
                >
                  <CalendarDays size={15} />
                  Gantt Chart
                </button>

                <button
                  onClick={() =>
                    setSelectedProject(p)
                  }
                  style={styles.viewBtn}
                >
                  <Eye size={15} />
                  टप्पे
                </button>

              </div>

              {/* DOWNLOAD */}

              <div style={styles.downloadRow}>

                <button
                  onClick={() =>
                    downloadWordDoc(p)
                  }
                  style={styles.downloadBtnWord}
                >
                  <FileText size={14} />
                  Project Word
                </button>

                <button
                  onClick={() =>
                    downloadBudgetCSV(p)
                  }
                  style={styles.downloadBtnCsv}
                >
                  <Download size={14} />
                  Budget CSV
                </button>

              </div>

            </div>

          ))}

        </div>

      </main>

      {/* =================================================
          GANTT MODAL
      ================================================= */}

      {showGantt && (

        <div style={styles.modalOverlay}>

          <div style={styles.ganttModal}>

            <ProjectGantt
              project={showGantt}
            />

          </div>

        </div>

      )}

      {/* =================================================
          PHASE MODAL
      ================================================= */}

      {supportOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.supportModal}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Officer Query / Token</h3>
                <p style={styles.modalSubtitle}>
                  Upload photo and generate a support token for officer follow-up
                </p>
              </div>

              <button
                onClick={() => setSupportOpen(false)}
                style={styles.closeIconButton}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} style={styles.supportForm}>
              <label style={styles.formGroup}>
                <span style={styles.label}>Citizen Name</span>
                <input
                  name="name"
                  value={supportForm.name}
                  onChange={handleSupportChange}
                  placeholder="नाव भरा"
                  style={styles.textInput}
                />
              </label>

              <label style={styles.formGroup}>
                <span style={styles.label}>Subject</span>
                <input
                  name="subject"
                  value={supportForm.subject}
                  onChange={handleSupportChange}
                  placeholder="उदाहरण: रस्ता, पाणी, प्रकाश, विकास प्रश्न"
                  style={styles.textInput}
                />
              </label>

              <label style={styles.formGroup}>
                <span style={styles.label}>Describe your concern</span>
                <textarea
                  name="description"
                  value={supportForm.description}
                  onChange={handleSupportChange}
                  placeholder="तुमचा प्रश्न किंवा तक्रार स्पष्ट लिहा..."
                  style={styles.textArea}
                />
              </label>

              <label style={styles.formGroup}>
                <span style={styles.label}>Upload Photo</span>
                <div style={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSupportFile}
                    style={styles.fileInput}
                  />

                  {previewImage ? (
                    <div style={styles.previewWrap}>
                      <img
                        src={previewImage}
                        alt="Complaint preview"
                        style={styles.previewImage}
                      />
                      <span style={styles.uploadName}>{supportForm.uploadedFile?.name || "Selected image"}</span>
                    </div>
                  ) : (
                    <span style={styles.uploadPlaceholder}>Choose image for reference</span>
                  )}
                </div>
              </label>

              <div style={styles.officerNote}>
                <strong>Municipal Officer Contact:</strong>
                <span>Kopargaon Municipal Council • Support Desk</span>
              </div>

              <button type="submit" style={styles.generateTokenBtn}>
                Generate Token & Contact Officer
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (

        <div style={styles.modalOverlay}>

          <div style={styles.modalContent}>

            <div style={styles.modalHeader}>

              <div>

                <h3 style={styles.modalTitle}>
                  {selectedProject.titleMr}
                </h3>

                <p style={styles.modalSubtitle}>
                  Government Project Lifecycle
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedProject(null)
                }
                style={styles.closeIconButton}
              >
                <X size={18} />
              </button>

            </div>

            <div style={styles.phaseList}>

              {selectedProject.phases.map(
                (phase, index) => (

                  <div
                    key={index}
                    style={styles.phaseItem}
                  >

                    <div
                      style={
                        styles.phaseLeft
                      }
                    >

                      {phase.status ===
                      "Completed" ? (
                        <CheckCircle2
                          color="#16a34a"
                          size={19}
                        />
                      ) : (
                        <Clock
                          color={
                            phase.status ===
                            "In Progress"
                              ? "#d97706"
                              : "#94a3b8"
                          }
                          size={19}
                        />
                      )}

                      <div>

                        <strong>
                          {phase.name}
                        </strong>

                        <div
                          style={
                            styles.phaseDates
                          }
                        >
                          {phase.start} →{" "}
                          {phase.end}
                        </div>

                      </div>

                    </div>

                    <span
                      style={{
                        ...styles.phaseBadge,

                        backgroundColor:
                          phase.status ===
                          "Completed"
                            ? "#dcfce7"
                            : phase.status ===
                              "In Progress"
                            ? "#fef3c7"
                            : "#f1f5f9",

                        color:
                          phase.status ===
                          "Completed"
                            ? "#166534"
                            : phase.status ===
                              "In Progress"
                            ? "#92400e"
                            : "#64748b",
                      }}
                    >
                      {phase.status}
                    </span>

                  </div>

                )
              )}

            </div>

            <button
              onClick={() =>
                setSelectedProject(null)
              }
              style={styles.closeBtn}
            >
              बंद करा
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

/*
=========================================================
STYLES
=========================================================
*/

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef6fb 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#0f172a",
  },

  header: {
    background:
      "linear-gradient(135deg, #0f2b48, #164e63)",
    color: "#fff",
    padding: "0.9rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 4px 16px rgba(15,43,72,0.18)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.12)",
    color: "#fef08a",
  },

  headerTitle: {
    margin: 0,
    fontSize: "1.08rem",
    fontWeight: 800,
  },

  headerSubtitle: {
    fontSize: "0.72rem",
    color: "#cbd5e1",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  userName: {
    fontSize: "0.84rem",
    fontWeight: 600,
  },

  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "0.48rem 0.8rem",
    borderRadius: 7,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.78rem",
    fontWeight: 700,
  },

  content: {
    padding: "1.6rem",
    maxWidth: 1250,
    margin: "0 auto",
  },

  welcomeBanner: {
    background:
      "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
    border:
      "1px solid #bae6fd",
    borderLeft:
      "5px solid #0284c7",
    borderRadius: 14,
    padding: "1.25rem 1.4rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 8px 25px rgba(2,132,199,0.08)",
  },

  welcomeSmall: {
    color: "#0369a1",
    fontSize: "0.72rem",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  welcomeTitle: {
    margin: "0.25rem 0",
    color: "#0f2b48",
    fontSize: "1.35rem",
  },

  welcomeText: {
    margin: 0,
    color: "#475569",
    fontSize: "0.82rem",
    maxWidth: 760,
    lineHeight: 1.6,
  },

  bannerActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },

  supportBtn: {
    background:
      "linear-gradient(135deg, #0f2b48, #0d4d74)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "0.7rem 1rem",
    fontSize: "0.76rem",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    boxShadow: "0 8px 18px rgba(15, 43, 72, 0.15)",
  },

  welcomeIcon: {
    width: 65,
    height: 65,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    color: "#0284c7",
    boxShadow:
      "0 6px 20px rgba(2,132,199,0.12)",
  },

  tokenBanner: {
    marginTop: "1rem",
    background:
      "linear-gradient(135deg, #eff6ff, #ecfeff)",
    border: "1px solid #bfdbfe",
    borderLeft: "5px solid #2563eb",
    borderRadius: 12,
    padding: "0.9rem 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  tokenLabel: {
    fontSize: "0.68rem",
    textTransform: "uppercase",
    color: "#1d4ed8",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  tokenCode: {
    marginTop: "0.2rem",
    fontSize: "1.2rem",
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "0.05em",
  },

  tokenMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    color: "#334155",
    fontSize: "0.74rem",
    textAlign: "right",
    gap: "0.15rem",
  },

  tokenImage: {
    width: 90,
    height: 90,
    objectFit: "contain",
    borderRadius: 10,
    border: "1px solid #bbf7d0",
    background: "#ffffff",
    padding: 4,
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1.7rem",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f2b48",
    fontSize: "1.15rem",
  },

  sectionSubtitle: {
    margin: "0.15rem 0 0",
    color: "#64748b",
    fontSize: "0.75rem",
  },

  projectCount: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "0.4rem 0.75rem",
    borderRadius: 20,
    fontSize: "0.72rem",
    fontWeight: 800,
  },

  supportModal: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "80vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
    padding: "1.1rem 1.1rem 1.2rem",
    border: "1px solid #e2e8f0",
  },

  supportForm: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
    marginTop: "0.8rem",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    color: "#334155",
    fontSize: "0.72rem",
    fontWeight: 700,
  },

  label: {
    color: "#0f172a",
    fontWeight: 800,
  },

  textInput: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "0.75rem 0.8rem",
    fontSize: "0.82rem",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
  },

  textArea: {
    width: "100%",
    minHeight: 110,
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "0.75rem 0.8rem",
    fontSize: "0.82rem",
    color: "#0f172a",
    background: "#f8fafc",
    resize: "vertical",
    outline: "none",
  },

  uploadBox: {
    border: "1px dashed #7dd3fc",
    borderRadius: 10,
    background: "#f0f9ff",
    padding: "0.75rem 0.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
  },

  fileInput: {
    width: "100%",
    color: "#0f172a",
    fontSize: "0.74rem",
  },

  previewWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "center",
    width: "100%",
  },

  previewImage: {
    display: "block",
    maxWidth: 220,
    width: "100%",
    maxHeight: 140,
    objectFit: "contain",
    borderRadius: 10,
    border: "1px solid #bae6fd",
    background: "#ffffff",
    padding: 6,
  },

  uploadPlaceholder: {
    fontSize: "0.72rem",
    color: "#475569",
  },

  uploadName: {
    fontSize: "0.72rem",
    color: "#0f766e",
    fontWeight: 700,
  },

  officerNote: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    padding: "0.7rem 0.8rem",
    borderRadius: 10,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "0.72rem",
  },

  generateTokenBtn: {
    background: "linear-gradient(135deg, #0f2b48, #0b6ea8)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "0.8rem 1rem",
    fontSize: "0.8rem",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(15, 43, 72, 0.14)",
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(370px, 1fr))",
    gap: "1.2rem",
    marginTop: "1rem",
  },

  card: {
    background: "#fff",
    border:
      "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "1.15rem",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
    transition: "transform 0.2s ease",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  stageTag: {
    background: "#dbeafe",
    color: "#1e40af",
    fontSize: "0.68rem",
    padding: "0.28rem 0.55rem",
    borderRadius: 5,
    fontWeight: 800,
  },

  priorityTag: {
    background: "#fef3c7",
    color: "#b45309",
    fontSize: "0.68rem",
    padding: "0.28rem 0.55rem",
    borderRadius: 5,
    fontWeight: 800,
  },

  projectTitle: {
    margin: "0.75rem 0 0.2rem",
    color: "#0f2b48",
    fontSize: "1rem",
  },

  projectEnglish: {
    color: "#64748b",
    fontSize: "0.72rem",
    marginBottom: "0.7rem",
  },

  infoRow: {
    fontSize: "0.78rem",
    color: "#334155",
    margin: "0.35rem 0",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },

  reasonBox: {
    background:
      "linear-gradient(135deg, #f0f9ff, #f8fafc)",
    border:
      "1px solid #bae6fd",
    padding: "0.7rem",
    borderRadius: 9,
    marginTop: "0.9rem",
    display: "flex",
    gap: "0.55rem",
    color: "#0369a1",
    fontSize: "0.75rem",
  },

  reasonText: {
    margin: "0.25rem 0 0",
    color: "#334155",
    lineHeight: 1.5,
  },

  progressSection: {
    marginTop: "1rem",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.74rem",
    color: "#475569",
    marginBottom: "0.35rem",
  },

  progressTrack: {
    height: 9,
    background: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #0284c7, #16a34a)",
    borderRadius: 10,
    transition: "width 0.4s ease",
  },

  cardActions: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "0.45rem",
    marginTop: "1rem",
  },

  ganttButton: {
    background:
      "linear-gradient(135deg, #0f2b48, #164e63)",
    color: "#fff",
    border: "none",
    padding: "0.55rem",
    borderRadius: 7,
    fontSize: "0.74rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
    fontWeight: 700,
  },

  viewBtn: {
    background: "#f1f5f9",
    color: "#0f2b48",
    border: "1px solid #cbd5e1",
    padding: "0.55rem",
    borderRadius: 7,
    fontSize: "0.74rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
    fontWeight: 700,
  },

  downloadRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.45rem",
    marginTop: "0.45rem",
  },

  downloadBtnWord: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.5rem",
    borderRadius: 7,
    fontSize: "0.72rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    fontWeight: 700,
  },

  downloadBtnCsv: {
    background: "#059669",
    color: "#fff",
    border: "none",
    padding: "0.5rem",
    borderRadius: 7,
    fontSize: "0.72rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    fontWeight: 700,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.62)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },

  ganttModal: {
    width: "100%",
    maxWidth: 1050,
    maxHeight: "90vh",
    overflow: "auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.25)",
  },

  ganttContainer: {
    padding: "1.25rem",
  },

  ganttHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },

  ganttTitle: {
    margin: 0,
    color: "#0f2b48",
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    fontSize: "1.05rem",
  },

  ganttSubtitle: {
    margin: "0.25rem 0 0",
    color: "#64748b",
    fontSize: "0.73rem",
  },

  closeIconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ganttTimelineHeader: {
    display: "flex",
    border:
      "1px solid #e2e8f0",
    background: "#f8fafc",
  },

  ganttRow: {
    display: "flex",
    minHeight: 60,
    borderLeft:
      "1px solid #e2e8f0",
    borderRight:
      "1px solid #e2e8f0",
    borderBottom:
      "1px solid #e2e8f0",
  },

  phaseColumn: {
    width: 245,
    minWidth: 245,
    padding: "0.65rem",
    fontSize: "0.72rem",
    borderRight:
      "1px solid #e2e8f0",
    background: "#fff",
  },

  timelineColumn: {
    flex: 1,
    position: "relative",
    minWidth: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundImage:
      "linear-gradient(to right, #eef2f7 1px, transparent 1px)",
    backgroundSize: "11.11% 100%",
  },

  phaseName: {
    fontWeight: 800,
    color: "#334155",
    lineHeight: 1.3,
  },

  phaseStatus: {
    fontSize: "0.65rem",
    marginTop: "0.2rem",
    fontWeight: 700,
  },

  ganttBar: {
    position: "absolute",
    height: 26,
    borderRadius: 7,
    minWidth: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 7,
    boxSizing: "border-box",
    fontSize: "0.64rem",
    fontWeight: 800,
    color: "#fff",
    boxShadow:
      "0 3px 8px rgba(15,23,42,0.12)",
  },

  ganttCompleted: {
    background:
      "linear-gradient(90deg, #15803d, #22c55e)",
  },

  ganttProgress: {
    background:
      "linear-gradient(90deg, #d97706, #f59e0b)",
  },

  ganttPending: {
    background: "#cbd5e1",
    color: "#475569",
  },

  ganttLegend: {
    display: "flex",
    gap: "1.2rem",
    paddingTop: "1rem",
    fontSize: "0.7rem",
    color: "#475569",
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    display: "inline-block",
    marginRight: 5,
  },

  modalContent: {
    background: "#fff",
    padding: "1.4rem",
    borderRadius: 14,
    width: "90%",
    maxWidth: 620,
    maxHeight: "85vh",
    overflow: "auto",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.25)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  modalTitle: {
    margin: 0,
    color: "#0f2b48",
  },

  modalSubtitle: {
    margin: "0.2rem 0",
    color: "#64748b",
    fontSize: "0.72rem",
  },

  phaseList: {
    marginTop: "1rem",
  },

  phaseItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom:
      "1px solid #f1f5f9",
    gap: "1rem",
  },

  phaseLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    fontSize: "0.8rem",
  },

  phaseDates: {
    fontSize: "0.65rem",
    color: "#94a3b8",
    marginTop: "0.15rem",
  },

  phaseBadge: {
    fontSize: "0.65rem",
    padding: "0.25rem 0.5rem",
    borderRadius: 20,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  closeBtn: {
    marginTop: "1rem",
    width: "100%",
    background: "#0f2b48",
    color: "#fff",
    border: "none",
    padding: "0.6rem",
    borderRadius: 7,
    cursor: "pointer",
    fontWeight: 700,
  },
};