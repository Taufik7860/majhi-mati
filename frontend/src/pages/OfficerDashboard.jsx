import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  LogOut,
  Search,
  Download,
  Edit3,
  Save,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MapPin,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react";

import { supabase } from "../lib/supabase";

/* =========================================================
   GOVERNMENT PROJECT LIFECYCLE
========================================================= */

const LIFECYCLE_STAGES = [
  "Concept Note",
  "Feasibility Report",
  "DPR",
  "Administrative Approval",
  "Financial Approval",
  "Tender / Contract",
];

/* =========================================================
   INITIAL PROJECT DATA
========================================================= */

const INITIAL_PROJECTS = [
  {
    id: 1,
    titleMr: "सौर पथदिवे योजना",
    titleEn: "Solar Street Light Installation Project",
    location: "Kopargaon - Ward 3",
    budget: 1250000,

    lifecycleStage: "Tender / Contract",

    priority: "High Priority",

    decisionReason:
      "वॉर्ड ३ मध्ये रात्रीच्या वेळी नागरिकांच्या सुरक्षिततेसाठी आणि वीज बचतीसाठी हा प्रकल्प प्राधान्याने निवडण्यात आला आहे.",

    progress: 75,

    contractor: "Maharashtra Green Energy Ltd.",

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

    /* GANTT DATA */

    phases: [
      {
        id: "p1",
        name: "Concept Note",
        start: "2026-06-01",
        end: "2026-06-05",
        status: "completed",
        progress: 100,
      },
      {
        id: "p2",
        name: "Feasibility Report",
        start: "2026-06-06",
        end: "2026-06-15",
        status: "completed",
        progress: 100,
      },
      {
        id: "p3",
        name: "DPR",
        start: "2026-06-16",
        end: "2026-06-25",
        status: "completed",
        progress: 100,
      },
      {
        id: "p4",
        name: "Administrative Approval",
        start: "2026-06-26",
        end: "2026-07-05",
        status: "completed",
        progress: 100,
      },
      {
        id: "p5",
        name: "Financial Approval",
        start: "2026-07-06",
        end: "2026-07-15",
        status: "completed",
        progress: 100,
      },
      {
        id: "p6",
        name: "Tender / Contract",
        start: "2026-07-16",
        end: "2026-08-10",
        status: "active",
        progress: 75,
      },
      {
        id: "p7",
        name: "Installation",
        start: "2026-08-11",
        end: "2026-09-15",
        status: "upcoming",
        progress: 0,
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

    phases: [
      {
        id: "p1",
        name: "Concept Note",
        start: "2026-07-01",
        end: "2026-07-05",
        status: "completed",
        progress: 100,
      },
      {
        id: "p2",
        name: "Feasibility Report",
        start: "2026-07-06",
        end: "2026-07-15",
        status: "completed",
        progress: 100,
      },
      {
        id: "p3",
        name: "DPR",
        start: "2026-07-16",
        end: "2026-07-25",
        status: "completed",
        progress: 100,
      },
      {
        id: "p4",
        name: "Administrative Approval",
        start: "2026-07-26",
        end: "2026-08-20",
        status: "active",
        progress: 40,
      },
      {
        id: "p5",
        name: "Financial Approval",
        start: "2026-08-21",
        end: "2026-09-05",
        status: "upcoming",
        progress: 0,
      },
      {
        id: "p6",
        name: "Tender / Contract",
        start: "2026-09-06",
        end: "2026-09-25",
        status: "upcoming",
        progress: 0,
      },
      {
        id: "p7",
        name: "Road Construction",
        start: "2026-09-26",
        end: "2026-11-30",
        status: "upcoming",
        progress: 0,
      },
    ],
  },
];

/* =========================================================
   DATE HELPERS
========================================================= */

function getDateDifference(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   GANTT CHART COMPONENT
========================================================= */

function ProjectGantt({ project }) {
  const phases = project?.phases || [];

  const projectStart = useMemo(() => {
    if (!phases.length) return new Date();

    return new Date(
      Math.min(
        ...phases.map((phase) =>
          new Date(phase.start).getTime()
        )
      )
    );
  }, [phases]);

  const projectEnd = useMemo(() => {
    if (!phases.length) return new Date();

    return new Date(
      Math.max(
        ...phases.map((phase) =>
          new Date(phase.end).getTime()
        )
      )
    );
  }, [phases]);

  const totalDays = getDateDifference(
    projectStart,
    projectEnd
  );

  const getLeft = (start) => {
    const difference =
      (new Date(start).getTime() -
        projectStart.getTime()) /
      (1000 * 60 * 60 * 24);

    return `${(difference / totalDays) * 100}%`;
  };

  const getWidth = (start, end) => {
    const days = getDateDifference(start, end);

    return `${Math.max(
      4,
      (days / totalDays) * 100
    )}%`;
  };

  return (
    <div style={styles.ganttCard}>
      <div style={styles.ganttHeader}>
        <div>
          <div style={styles.ganttTitle}>
            <CalendarDays size={20} />
            Phase-wise Gantt Chart
          </div>

          <div style={styles.ganttSubtitle}>
            {project.titleMr} • Project Timeline
          </div>
        </div>

        <div style={styles.ganttLegend}>
          <LegendItem
            type="completed"
            label="Completed"
          />

          <LegendItem
            type="active"
            label="In Progress"
          />

          <LegendItem
            type="upcoming"
            label="Upcoming"
          />
        </div>
      </div>

      <div style={styles.ganttBody}>
        {/* HEADER */}

        <div style={styles.ganttTimelineHeader}>
          <div style={styles.phaseNameHeader}>
            Project Phase
          </div>

          <div style={styles.timelineHeader}>
            <span>
              {formatDate(projectStart)}
            </span>

            <span>
              {formatDate(projectEnd)}
            </span>
          </div>
        </div>

        {/* PHASE ROWS */}

        {phases.map((phase) => (
          <div
            key={phase.id}
            style={styles.ganttRow}
          >
            <div style={styles.phaseName}>
              <strong>{phase.name}</strong>

              <span>
                {formatDate(phase.start)} →{" "}
                {formatDate(phase.end)}
              </span>
            </div>

            <div style={styles.timelineArea}>
              <div
                style={{
                  ...styles.ganttBar,
                  left: getLeft(phase.start),
                  width: getWidth(
                    phase.start,
                    phase.end
                  ),
                  ...getStatusStyle(
                    phase.status
                  ),
                }}
              >
                <div
                  style={{
                    ...styles.ganttProgress,
                    width: `${phase.progress}%`,
                  }}
                />

                <span style={styles.ganttBarText}>
                  {phase.progress}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.ganttFooter}>
        <div>
          <strong>Total Project Duration:</strong>{" "}
          {totalDays} days
        </div>

        <div>
          <strong>Overall Progress:</strong>{" "}
          {project.progress}%
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   GANTT LEGEND
========================================================= */

function LegendItem({ type, label }) {
  return (
    <div style={styles.legendItem}>
      <span
        style={{
          ...styles.legendDot,
          ...getStatusStyle(type),
        }}
      />

      {label}
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "completed") {
    return {
      backgroundColor: "#16a34a",
    };
  }

  if (status === "active") {
    return {
      backgroundColor: "#0284c7",
    };
  }

  return {
    backgroundColor: "#94a3b8",
  };
}

/* =========================================================
   MAIN OFFICER DASHBOARD
========================================================= */

export default function OfficerDashboard() {
  const navigate = useNavigate();

  const [officerName, setOfficerName] =
    useState("Municipal Officer");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [citizenComplaints, setCitizenComplaints] =
    useState([]);

  const [projects, setProjects] =
    useState(INITIAL_PROJECTS);

  const [editingProjectId, setEditingProjectId] =
    useState(null);

  const [selectedProjectId, setSelectedProjectId] =
    useState(INITIAL_PROJECTS[0].id);

  const [editFormData, setEditFormData] =
    useState({});

  /* =====================================================
     LOAD LOGGED IN USER
  ===================================================== */

  useEffect(() => {
    const userData =
      localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(userData);

      const role = String(
        parsed.role || ""
      ).toLowerCase();

      const officerRoles = [
        "officer",
        "municipal_officer",
        "municipal_admin",
        "super_admin",
      ];

      if (!officerRoles.includes(role)) {
        navigate("/citizen/dashboard");
        return;
      }

      if (parsed.full_name) {
        setOfficerName(parsed.full_name);
      }
    } catch (error) {
      console.error(
        "User parsing error:",
        error
      );

      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from("citizen_complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Complaint fetch error:", error);
        return;
      }

      setCitizenComplaints(data || []);
    };

    fetchComplaints();
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =====================================================
     EDIT PROJECT
  ===================================================== */

  const startEditing = (project) => {
    setEditingProjectId(project.id);

    setEditFormData({
      lifecycleStage:
        project.lifecycleStage,

      priority:
        project.priority,

      decisionReason:
        project.decisionReason,

      progress:
        project.progress,
    });
  };

  /* =====================================================
     SAVE PROJECT
  ===================================================== */

  const saveDecision = (id) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...editFormData,
            }
          : project
      )
    );

    setEditingProjectId(null);

    alert(
      "प्रकल्प निर्णय आणि प्रगती यशस्वीरीत्या अपडेट झाली!"
    );
  };

  /* =====================================================
     WORD DOWNLOAD
  ===================================================== */

  const downloadWordDoc = (project) => {
    const content = `
<html>
<head>
<meta charset="UTF-8">
<title>${project.titleEn}</title>
</head>

<body>

<h1>${project.titleMr}</h1>

<h2>${project.titleEn}</h2>

<p>
<strong>Location:</strong>
${project.location}
</p>

<p>
<strong>Budget:</strong>
₹${project.budget.toLocaleString(
      "en-IN"
    )}
</p>

<p>
<strong>Lifecycle Stage:</strong>
${project.lifecycleStage}
</p>

<p>
<strong>Priority:</strong>
${project.priority}
</p>

<p>
<strong>Decision Reason:</strong>
${project.decisionReason}
</p>

<p>
<strong>Progress:</strong>
${project.progress}%
</p>

<p>
<strong>Contractor:</strong>
${project.contractor}
</p>

<h2>Project Phases</h2>

<ul>

${project.phases
  .map(
    (phase) => `
<li>
<strong>${phase.name}</strong>
-
${phase.start}
to
${phase.end}
-
${phase.progress}%
</li>
`
  )
  .join("")}

</ul>

</body>
</html>
`;

    const blob = new Blob(
      ["\ufeff", content],
      {
        type: "application/msword",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download = `${project.titleEn}_Official_Report.doc`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     CSV DOWNLOAD
  ===================================================== */

  const downloadBudgetCSV = (project) => {
    let csv =
      "Budget Head,Cost (INR)\n";

    project.budgetBreakdown.forEach(
      (row) => {
        csv += `"${row.item}",${row.cost}\n`;
      }
    );

    csv += `"Total Budget",${project.budget}\n`;

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download = `${project.titleEn}_Budget.csv`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredProjects =
    projects.filter((project) => {
      const search =
        searchQuery.toLowerCase();

      return (
        project.titleMr.includes(
          searchQuery
        ) ||
        project.titleEn
          .toLowerCase()
          .includes(search) ||
        project.location
          .toLowerCase()
          .includes(search)
      );
    });

  const selectedProject =
    projects.find(
      (project) =>
        project.id === selectedProjectId
    ) || projects[0];

  /* =====================================================
     METRICS
  ===================================================== */

  const totalProjects =
    projects.length;

  const tenderProjects =
    projects.filter(
      (project) =>
        project.lifecycleStage ===
        "Tender / Contract"
    ).length;

  const approvalProjects =
    projects.filter(
      (project) =>
        project.lifecycleStage ===
        "Administrative Approval"
    ).length;

  const averageProgress =
    projects.length
      ? Math.round(
          projects.reduce(
            (sum, project) =>
              sum + project.progress,
            0
          ) / projects.length
        )
      : 0;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div style={styles.page}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBox}>
            <Building2 size={25} />
          </div>

          <div>
            <h2 style={styles.headerTitle}>
              माझी माती • अधिकारी पोर्टल
            </h2>

            <span
              style={styles.headerSubtitle}
            >
              Phase-wise Development
              Monitoring & Governance
            </span>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.officerInfo}>
            <span style={styles.officerLabel}>
              अधिकृत अधिकारी
            </span>

            <strong>
              {officerName}
            </strong>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            <LogOut size={15} />

            लॉगआउट
          </button>
        </div>
      </header>

      {/* =================================================
          PAGE INTRO
      ================================================= */}

      <section style={styles.hero}>
        <div>
          <div style={styles.heroEyebrow}>
            GOVERNMENT PROJECT MONITORING
          </div>

          <h1 style={styles.heroTitle}>
            प्रकल्प संनियंत्रण व निर्णय प्रणाली
          </h1>

          <p style={styles.heroText}>
            सरकारी प्रकल्पांचे टप्पानुसार
            नियोजन, प्रगती, अर्थसंकल्प आणि
            निर्णय पारदर्शकपणे व्यवस्थापित करा.
          </p>
        </div>

        <div style={styles.heroIcon}>
          <BarChart3 size={40} />
        </div>
      </section>

      {/* =================================================
          METRICS
      ================================================= */}

      <section style={styles.metricsContainer}>
        <MetricCard
          icon={<FileText size={21} />}
          label="एकूण प्रकल्प"
          value={totalProjects}
          description="Total Projects"
          type="blue"
        />

        <MetricCard
          icon={<CheckCircle2 size={21} />}
          label="टेंडर टप्प्यात"
          value={tenderProjects}
          description="Tender / Contract"
          type="green"
        />

        <MetricCard
          icon={<Clock3 size={21} />}
          label="प्रशासकीय मान्यता"
          value={approvalProjects}
          description="Administrative Approval"
          type="orange"
        />

        <MetricCard
          icon={<TrendingUp size={21} />}
          label="सरासरी प्रगती"
          value={`${averageProgress}%`}
          description="Overall Progress"
          type="purple"
        />
      </section>

      <main style={styles.content}>
        {/* =================================================
            PROJECT SELECTOR
        ================================================= */}

        <section style={styles.projectSelectorCard}>
          <div>
            <div style={styles.sectionEyebrow}>
              PROJECT TIMELINE
            </div>

            <h2 style={styles.sectionTitle}>
              Phase-wise Gantt Chart
            </h2>

            <p style={styles.sectionDescription}>
              प्रकल्पाच्या प्रत्येक टप्प्याची
              सुरुवात, समाप्ती आणि प्रगती
              एका timeline मध्ये पहा.
            </p>
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) =>
              setSelectedProjectId(
                Number(e.target.value)
              )
            }
            style={styles.projectSelect}
          >
            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.titleMr} —{" "}
                {project.location}
              </option>
            ))}
          </select>
        </section>

        {/* =================================================
            GANTT
        ================================================= */}

        {selectedProject && (
          <ProjectGantt
            project={selectedProject}
          />
        )}

        {/* =================================================
            PROJECT MANAGEMENT
        ================================================= */}

        <section style={styles.tableCard}>
          <div style={styles.toolbar}>
            <div>
              <div style={styles.sectionEyebrow}>
                PROJECT MANAGEMENT
              </div>

              <h2 style={styles.tableTitle}>
                प्रकल्प प्राधान्य व प्रगती
                संनियंत्रण
              </h2>

              <p style={styles.tableSubtitle}>
                Citizen visibility आणि
                Officer decision management
              </p>
            </div>

            <div style={styles.searchBox}>
              <Search
                size={17}
                color="#64748b"
              />

              <input
                type="text"
                placeholder="प्रकल्प शोधा..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>
                    प्रकल्प
                  </th>

                  <th style={styles.th}>
                    सरकारी टप्पा
                  </th>

                  <th style={styles.th}>
                    निर्णय व कारण
                  </th>

                  <th style={styles.th}>
                    प्रगती
                  </th>

                  <th
                    style={{
                      ...styles.th,
                      textAlign:
                        "right",
                    }}
                  >
                    कृती
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map(
                  (project) => (
                    <tr
                      key={project.id}
                      style={
                        styles.tableRow
                      }
                    >
                      {/* PROJECT */}

                      <td style={styles.td}>
                        <div
                          style={
                            styles.projectName
                          }
                        >
                          {project.titleMr}
                        </div>

                        <div
                          style={
                            styles.projectEnglish
                          }
                        >
                          {
                            project.titleEn
                          }
                        </div>

                        <div
                          style={
                            styles.location
                          }
                        >
                          <MapPin
                            size={13}
                          />

                          {
                            project.location
                          }
                        </div>

                        <div
                          style={
                            styles.budget
                          }
                        >
                          ₹
                          {project.budget.toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </td>

                      {/* STAGE */}

                      <td style={styles.td}>
                        {editingProjectId ===
                        project.id ? (
                          <select
                            value={
                              editFormData.lifecycleStage
                            }
                            onChange={(e) =>
                              setEditFormData(
                                {
                                  ...editFormData,
                                  lifecycleStage:
                                    e.target
                                      .value,
                                }
                              )
                            }
                            style={
                              styles.selectInput
                            }
                          >
                            {LIFECYCLE_STAGES.map(
                              (stage) => (
                                <option
                                  key={stage}
                                  value={stage}
                                >
                                  {stage}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <span
                            style={
                              styles.stageTag
                            }
                          >
                            {
                              project.lifecycleStage
                            }
                          </span>
                        )}
                      </td>

                      {/* DECISION */}

                      <td
                        style={{
                          ...styles.td,
                          minWidth:
                            "270px",
                        }}
                      >
                        {editingProjectId ===
                        project.id ? (
                          <div>
                            <select
                              value={
                                editFormData.priority
                              }
                              onChange={(e) =>
                                setEditFormData(
                                  {
                                    ...editFormData,
                                    priority:
                                      e.target
                                        .value,
                                  }
                                )
                              }
                              style={{
                                ...styles.selectInput,
                                marginBottom:
                                  "8px",
                              }}
                            >
                              <option>
                                High Priority
                              </option>

                              <option>
                                Medium Priority
                              </option>

                              <option>
                                Low Priority
                              </option>
                            </select>

                            <textarea
                              rows={4}
                              value={
                                editFormData.decisionReason
                              }
                              onChange={(e) =>
                                setEditFormData(
                                  {
                                    ...editFormData,
                                    decisionReason:
                                      e.target
                                        .value,
                                  }
                                )
                              }
                              placeholder="प्रकल्प प्राधान्याचे कारण..."
                              style={
                                styles.textAreaInput
                              }
                            />
                          </div>
                        ) : (
                          <div>
                            <div
                              style={
                                styles.priority
                              }
                            >
                              {
                                project.priority
                              }
                            </div>

                            <div
                              style={
                                styles.reason
                              }
                            >
                              {
                                project.decisionReason
                              }
                            </div>
                          </div>
                        )}
                      </td>

                      {/* PROGRESS */}

                      <td style={styles.td}>
                        {editingProjectId ===
                        project.id ? (
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                editFormData.progress
                              }
                              onChange={(e) =>
                                setEditFormData(
                                  {
                                    ...editFormData,
                                    progress:
                                      Math.min(
                                        100,
                                        Math.max(
                                          0,
                                          Number(
                                            e.target
                                              .value
                                          )
                                        )
                                      ),
                                  }
                                )
                              }
                              style={
                                styles.progressInput
                              }
                            />

                            <span>
                              %
                            </span>
                          </div>
                        ) : (
                          <div
                            style={
                              styles.progressContainer
                            }
                          >
                            <div
                              style={
                                styles.progressTop
                              }
                            >
                              <strong>
                                {
                                  project.progress
                                }
                                %
                              </strong>

                              <span>
                                {
                                  project.progress >=
                                  100
                                    ? "Complete"
                                    : "In progress"
                                }
                              </span>
                            </div>

                            <div
                              style={
                                styles.progressTrack
                              }
                            >
                              <div
                                style={{
                                  ...styles.progressFill,
                                  width: `${project.progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          ...styles.td,
                          textAlign:
                            "right",
                        }}
                      >
                        {editingProjectId ===
                        project.id ? (
                          <button
                            onClick={() =>
                              saveDecision(
                                project.id
                              )
                            }
                            style={
                              styles.saveBtn
                            }
                          >
                            <Save size={14} />

                            सेव्ह
                          </button>
                        ) : (
                          <div
                            style={
                              styles.actionGroup
                            }
                          >
                            <button
                              onClick={() =>
                                startEditing(
                                  project
                                )
                              }
                              style={
                                styles.editBtn
                              }
                            >
                              <Edit3
                                size={14}
                              />

                              निर्णय
                            </button>

                            <button
                              onClick={() =>
                                downloadWordDoc(
                                  project
                                )
                              }
                              style={
                                styles.wordBtn
                              }
                            >
                              <Download
                                size={14}
                              />

                              Word
                            </button>

                            <button
                              onClick={() =>
                                downloadBudgetCSV(
                                  project
                                )
                              }
                              style={
                                styles.csvBtn
                              }
                            >
                              <Download
                                size={14}
                              />

                              CSV
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
            CITIZEN COMPLAINTS
        ================================================= */}

        <section style={styles.tableCard}>
          <div style={styles.toolbar}>
            <div>
              <div style={styles.sectionEyebrow}>
                CITIZEN COMPLAINTS
              </div>

              <h2 style={styles.tableTitle}>
                नागरिक तक्रारी आणि सपोर्ट टोकन
              </h2>

              <p style={styles.tableSubtitle}>
                All complaint data received from citizens is synced from Supabase.
              </p>
            </div>
          </div>

          <div style={styles.complaintList}>
            {citizenComplaints.length === 0 ? (
              <div style={styles.emptyComplaints}>
                <div style={styles.emptyIcon}>📋</div>
                <p style={styles.emptyText}>No citizen complaints received yet.</p>
                <p style={styles.emptySubtext}>Complaints will appear here when citizens submit them.</p>
              </div>
            ) : (
              citizenComplaints.map((complaint) => (
                <div key={complaint.id} style={styles.complaintCard}>
                  {/* Header with token and status */}
                  <div style={styles.complaintHeader}>
                    <div style={styles.complaintTokenSection}>
                      <div style={styles.complaintToken}>{complaint.token}</div>
                      <div style={styles.complaintName}>{complaint.citizen_name}</div>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          complaint.status === "new"
                            ? "#dbeafe"
                            : complaint.status === "in_progress"
                              ? "#fef3c7"
                              : "#dcfce7",
                        color:
                          complaint.status === "new"
                            ? "#0c4a6e"
                            : complaint.status === "in_progress"
                              ? "#92400e"
                              : "#166534",
                      }}
                    >
                      {complaint.status || "new"}
                    </span>
                  </div>

                  {/* Subject */}
                  <div style={styles.complaintSubject}>{complaint.subject}</div>

                  {/* Description */}
                  <div style={styles.complaintText}>{complaint.description}</div>

                  {/* Attachment and metadata */}
                  <div style={styles.complaintFooter}>
                    <div style={styles.complaintMeta}>
                      <span style={styles.metaTime}>
                        📅 {new Date(complaint.created_at).toLocaleString("en-IN")}
                      </span>
                      {complaint.uploaded_file_name && (
                        <a
                          href={complaint.uploaded_file_url}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.attachmentLink}
                        >
                          📎 {complaint.uploaded_file_name}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* =================================================
            TRANSPARENCY NOTICE
        ================================================= */}

        <section
          style={
            styles.transparencyCard
          }
        >
          <div
            style={
              styles.transparencyIcon
            }
          >
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h3
              style={
                styles.transparencyTitle
              }
            >
              Citizen Visibility Enabled
            </h3>

            <p
              style={
                styles.transparencyText
              }
            >
              अधिकारी स्तरावर अपडेट केलेले
              project priority, progress आणि
              decision reason नागरिक dashboard
              मध्ये read-only स्वरूपात दाखवता
              येतील. यामुळे प्रकल्प निवडण्यामागील
              कारणे आणि कामाची प्रगती
              पारदर्शक राहते.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  description,
  type,
}) {
  const colors = {
    blue: "#0284c7",
    green: "#16a34a",
    orange: "#d97706",
    purple: "#7c3aed",
  };

  return (
    <div
      style={{
        ...styles.metricCard,
        borderTop: `3px solid ${colors[type]}`,
      }}
    >
      <div
        style={{
          ...styles.metricIcon,
          color: colors[type],
        }}
      >
        {icon}
      </div>

      <div style={styles.metricInfo}>
        <div style={styles.metricLabel}>
          {label}
        </div>

        <div style={styles.metricValue}>
          {value}
        </div>

        <div
          style={styles.metricDescription}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f4f8fb 0%, #eef4f7 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#0f172a",
  },

  /* HEADER */

  header: {
    minHeight: "72px",
    background:
      "linear-gradient(135deg, #082f49, #0f2b48)",
    color: "#fff",
    padding: "0 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 5px 20px rgba(15,43,72,0.16)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  logoBox: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background:
      "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fef08a",
  },

  headerTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 800,
  },

  headerSubtitle: {
    display: "block",
    marginTop: "3px",
    fontSize: "11px",
    color: "#cbd5e1",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  officerInfo: {
    display: "flex",
    flexDirection: "column",
    textAlign: "right",
    fontSize: "13px",
  },

  officerLabel: {
    fontSize: "10px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  logoutBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#dc2626",
    color: "#fff",
    padding:
      "9px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 700,
    fontSize: "12px",
  },

  /* HERO */

  hero: {
    margin: "25px 32px 0",
    padding: "25px 28px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #ffffff, #f8fbfd)",
    border:
      "1px solid #dbe5ec",
    boxShadow:
      "0 8px 30px rgba(15,43,72,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroEyebrow: {
    color: "#0284c7",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  heroTitle: {
    margin:
      "6px 0 7px",
    fontSize: "26px",
    color: "#0f2b48",
  },

  heroText: {
    margin: 0,
    color: "#64748b",
    maxWidth: "650px",
    fontSize: "13px",
    lineHeight: 1.7,
  },

  heroIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e0f2fe",
    color: "#0284c7",
  },

  /* METRICS */

  metricsContainer: {
    padding:
      "20px 32px",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "15px",
  },

  metricCard: {
    background: "#fff",
    borderRadius: "13px",
    padding: "18px",
    display: "flex",
    gap: "13px",
    alignItems: "center",
    borderLeft:
      "1px solid #e2e8f0",
    borderRight:
      "1px solid #e2e8f0",
    borderBottom:
      "1px solid #e2e8f0",
    boxShadow:
      "0 5px 18px rgba(15,43,72,0.05)",
  },

  metricIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  metricInfo: {
    flex: 1,
  },

  metricLabel: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 700,
  },

  metricValue: {
    marginTop: "3px",
    fontSize: "24px",
    fontWeight: 900,
    color: "#0f172a",
  },

  metricDescription: {
    color: "#94a3b8",
    fontSize: "10px",
    marginTop: "1px",
  },

  /* CONTENT */

  content: {
    padding:
      "0 32px 40px",
  },

  /* PROJECT SELECTOR */

  projectSelectorCard: {
    marginBottom: "15px",
    background: "#fff",
    border:
      "1px solid #dbe5ec",
    borderRadius: "15px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  sectionEyebrow: {
    fontSize: "9px",
    color: "#0284c7",
    fontWeight: 900,
    letterSpacing: "1px",
  },

  sectionTitle: {
    margin:
      "4px 0 2px",
    color: "#0f2b48",
    fontSize: "19px",
  },

  sectionDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
  },

  projectSelect: {
    minWidth: "300px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "9px",
    padding:
      "10px 12px",
    background: "#fff",
    color: "#0f172a",
    outline: "none",
    fontSize: "12px",
    fontWeight: 600,
  },

  /* GANTT */

  ganttCard: {
    background: "#fff",
    border:
      "1px solid #dbe5ec",
    borderRadius: "15px",
    marginBottom: "20px",
    overflow: "hidden",
    boxShadow:
      "0 6px 22px rgba(15,43,72,0.05)",
  },

  ganttHeader: {
    padding:
      "18px 20px",
    borderBottom:
      "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ganttTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f2b48",
  },

  ganttSubtitle: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "11px",
  },

  ganttLegend: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "10px",
    color: "#64748b",
    fontWeight: 600,
  },

  legendDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    display: "inline-block",
  },

  ganttBody: {
    padding:
      "18px 20px 10px",
    overflowX: "auto",
  },

  ganttTimelineHeader: {
    display: "grid",
    gridTemplateColumns:
      "220px 1fr",
    minWidth: "700px",
    marginBottom: "7px",
  },

  phaseNameHeader: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "9px",
  },

  ganttRow: {
    display: "grid",
    gridTemplateColumns:
      "220px 1fr",
    minWidth: "700px",
    minHeight: "48px",
    borderTop:
      "1px solid #f1f5f9",
    alignItems: "center",
  },

  phaseName: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    paddingRight: "12px",
    fontSize: "11px",
    color: "#334155",
  },

  timelineArea: {
    height: "34px",
    position: "relative",
    background:
      "repeating-linear-gradient(90deg, #f8fafc 0, #f8fafc 1px, transparent 1px, transparent 10%)",
    borderRadius: "7px",
  },

  ganttBar: {
    position: "absolute",
    top: "7px",
    height: "20px",
    minWidth: "32px",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow:
      "0 2px 6px rgba(15,43,72,0.15)",
  },

  ganttProgress: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    background:
      "rgba(255,255,255,0.25)",
  },

  ganttBarText: {
    position: "absolute",
    right: "7px",
    top: "2px",
    color: "#fff",
    fontSize: "9px",
    fontWeight: 800,
    lineHeight: "16px",
  },

  ganttFooter: {
    padding:
      "12px 20px",
    background: "#f8fafc",
    borderTop:
      "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#475569",
  },

  /* TABLE */

  tableCard: {
    background: "#fff",
    border:
      "1px solid #dbe5ec",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow:
      "0 6px 22px rgba(15,43,72,0.05)",
  },

  toolbar: {
    padding:
      "19px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom:
      "1px solid #e2e8f0",
    gap: "20px",
  },

  tableTitle: {
    margin:
      "4px 0 2px",
    fontSize: "17px",
    color: "#0f2b48",
  },

  tableSubtitle: {
    margin: 0,
    fontSize: "10px",
    color: "#94a3b8",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#f8fafc",
    border:
      "1px solid #cbd5e1",
    padding:
      "8px 11px",
    borderRadius: "8px",
    minWidth: "220px",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "11px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
    textAlign: "left",
    minWidth: "1050px",
  },

  tableHeadRow: {
    background:
      "linear-gradient(90deg, #f8fafc, #f1f5f9)",
  },

  th: {
    padding:
      "12px 13px",
    fontSize: "10px",
    color: "#475569",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  tableRow: {
    borderBottom:
      "1px solid #edf2f7",
  },

  td: {
    padding:
      "13px",
    verticalAlign:
      "top",
    fontSize: "11px",
  },

  projectName: {
    fontWeight: 800,
    fontSize: "13px",
    color: "#0f2b48",
  },

  projectEnglish: {
    marginTop: "2px",
    fontSize: "9px",
    color: "#94a3b8",
  },

  location: {
    marginTop: "7px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#64748b",
    fontSize: "10px",
  },

  budget: {
    marginTop: "5px",
    color: "#15803d",
    fontWeight: 800,
    fontSize: "11px",
  },

  stageTag: {
    display: "inline-block",
    background: "#e0f2fe",
    color: "#075985",
    border:
      "1px solid #bae6fd",
    padding:
      "5px 8px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: 800,
  },

  priority: {
    color: "#b45309",
    background: "#fef3c7",
    borderRadius: "5px",
    display: "inline-block",
    padding:
      "4px 7px",
    fontSize: "9px",
    fontWeight: 800,
  },

  reason: {
    marginTop: "6px",
    color: "#475569",
    lineHeight: 1.5,
    fontSize: "10px",
  },

  selectInput: {
    width: "100%",
    padding:
      "7px 8px",
    fontSize: "10px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "6px",
    outline: "none",
    background: "#fff",
  },

  textAreaInput: {
    width: "100%",
    padding:
      "8px",
    fontSize: "10px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "6px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },

  progressContainer: {
    minWidth: "120px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "7px",
    fontSize: "10px",
  },

  progressTrack: {
    width: "100%",
    height: "7px",
    background: "#e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #0284c7, #16a34a)",
    borderRadius: "20px",
    transition:
      "width 0.3s ease",
  },

  progressInput: {
    width: "55px",
    padding:
      "6px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "5px",
  },

  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "5px",
    flexWrap: "wrap",
  },

  editBtn: {
    background: "#0f2b48",
    color: "#fff",
    border: "none",
    padding:
      "7px 9px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  wordBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding:
      "7px 9px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  csvBtn: {
    background: "#059669",
    color: "#fff",
    border: "none",
    padding:
      "7px 9px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding:
      "8px 12px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  /* TRANSPARENCY */

  transparencyCard: {
    marginTop: "18px",
    padding:
      "18px 20px",
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
    border:
      "1px solid #bbf7d0",
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
  },

  transparencyIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  transparencyTitle: {
    margin:
      "1px 0 5px",
    fontSize: "14px",
    color: "#166534",
  },

  transparencyText: {
    margin: 0,
    fontSize: "11px",
    color: "#3f6212",
    lineHeight: 1.7,
  },

  /* COMPLAINTS SECTION */

  complaintList: {
    padding: "0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "16px",
  },

  complaintCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(15, 43, 72, 0.08)",
    transition: "all 0.3s ease",
    ":hover": {
      boxShadow: "0 8px 20px rgba(15, 43, 72, 0.15)",
    },
  },

  complaintHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },

  complaintTokenSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  complaintToken: {
    fontSize: "13px",
    fontWeight: "900",
    color: "#0f2b48",
    letterSpacing: "0.5px",
  },

  complaintName: {
    fontSize: "12px",
    color: "#475569",
    fontWeight: "600",
  },

  statusBadge: {
    padding: "6px 11px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "capitalize",
    border: "1px solid transparent",
    display: "inline-block",
  },

  complaintSubject: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f2b48",
    marginBottom: "8px",
    lineHeight: 1.4,
  },

  complaintText: {
    fontSize: "12px",
    color: "#475569",
    lineHeight: 1.6,
    marginBottom: "12px",
    padding: "8px 0",
  },

  complaintFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },

  complaintMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "11px",
    color: "#64748b",
    flex: 1,
  },

  metaTime: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#64748b",
  },

  attachmentLink: {
    color: "#0284c7",
    textDecoration: "none",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 0",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    ":hover": {
      color: "#075985",
      background: "#f0f9ff",
    },
  },

  emptyComplaints: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#64748b",
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },

  emptyIcon: {
    fontSize: "48px",
    opacity: 0.5,
  },

  emptyText: {
    margin: "0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  },

  emptySubtext: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  linkStyle: {
    color: "#0284c7",
    textDecoration: "none",
  },
};