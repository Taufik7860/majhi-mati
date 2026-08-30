export const projectTasks = [
  {
    id: "concept",
    name: "Concept Note",
    start: "2026-09-01",
    end: "2026-09-05",
    progress: 100,
    dependencies: "",
  },

  {
    id: "feasibility",
    name: "Feasibility Report",
    start: "2026-09-06",
    end: "2026-09-15",
    progress: 100,
    dependencies: "concept",
  },

  {
    id: "dpr",
    name: "Detailed Project Report (DPR)",
    start: "2026-09-16",
    end: "2026-09-30",
    progress: 75,
    dependencies: "feasibility",
  },

  {
    id: "admin",
    name: "Administrative Approval",
    start: "2026-10-01",
    end: "2026-10-10",
    progress: 50,
    dependencies: "dpr",
  },

  {
    id: "financial",
    name: "Financial Approval",
    start: "2026-10-11",
    end: "2026-10-20",
    progress: 25,
    dependencies: "admin",
  },

  {
    id: "tender",
    name: "Tender / Contract",
    start: "2026-10-21",
    end: "2026-11-05",
    progress: 0,
    dependencies: "financial",
  },

  {
    id: "phase1",
    name: "Phase 1 - Site Preparation",
    start: "2026-11-06",
    end: "2026-11-20",
    progress: 0,
    dependencies: "tender",
  },

  {
    id: "phase2",
    name: "Phase 2 - Main Development",
    start: "2026-11-21",
    end: "2027-01-15",
    progress: 0,
    dependencies: "phase1",
  },

  {
    id: "phase3",
    name: "Phase 3 - Testing & Inspection",
    start: "2027-01-16",
    end: "2027-01-30",
    progress: 0,
    dependencies: "phase2",
  },

  {
    id: "completion",
    name: "Project Completion",
    start: "2027-01-31",
    end: "2027-02-05",
    progress: 0,
    dependencies: "phase3",
  },
];