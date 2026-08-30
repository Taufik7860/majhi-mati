// src/utils/projectValidation.js

export const LIFECYCLE_STAGES = [
  "Concept Note",
  "Feasibility Report",
  "DPR",
  "Administrative Approval",
  "Financial Approval",
  "Tender / Contract",
  "Execution",
  "Completed",
];

export const PROJECT_PRIORITIES = [
  "High Priority",
  "Medium Priority",
  "Low Priority",
];

export const PHASE_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "Delayed",
];

/**
 * Check whether a value is a valid finite number.
 */
export function isValidNumber(value) {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    typeof Number(value) === "number" &&
    Number.isFinite(Number(value))
  );
}

/**
 * Check whether a value is a valid date.
 */
export function isValidDate(value) {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

/**
 * Check date order.
 */
export function isValidDateRange(startDate, endDate) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return new Date(startDate) <= new Date(endDate);
}

/**
 * Validate budget breakdown.
 */
export function validateBudgetBreakdown(project, errors) {
  if (!Array.isArray(project.budgetBreakdown)) {
    errors.push({
      field: "budgetBreakdown",
      message: "Budget breakdown is missing or invalid.",
    });

    return;
  }

  let totalBreakdown = 0;

  project.budgetBreakdown.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors.push({
        field: `budgetBreakdown[${index}]`,
        message: "Budget item is invalid.",
      });

      return;
    }

    if (!item.item || typeof item.item !== "string") {
      errors.push({
        field: `budgetBreakdown[${index}].item`,
        message: "Budget item name is missing.",
      });
    }

    if (!isValidNumber(item.cost)) {
      errors.push({
        field: `budgetBreakdown[${index}].cost`,
        message: "Budget cost must be a valid number.",
      });

      return;
    }

    const cost = Number(item.cost);

    if (cost < 0) {
      errors.push({
        field: `budgetBreakdown[${index}].cost`,
        message: "Budget cost cannot be negative.",
      });
    }

    totalBreakdown += cost;
  });

  if (
    isValidNumber(project.budget) &&
    totalBreakdown > Number(project.budget)
  ) {
    errors.push({
      field: "budgetBreakdown",
      message: "Budget breakdown exceeds the approved project budget.",
    });
  }
}

/**
 * Validate project phases.
 */
export function validateProjectPhases(project, errors) {
  if (!Array.isArray(project.phases)) {
    errors.push({
      field: "phases",
      message: "Project phases are missing or invalid.",
    });

    return;
  }

  project.phases.forEach((phase, index) => {
    if (!phase || typeof phase !== "object") {
      errors.push({
        field: `phases[${index}]`,
        message: "Project phase is invalid.",
      });

      return;
    }

    if (!phase.name || typeof phase.name !== "string") {
      errors.push({
        field: `phases[${index}].name`,
        message: "Phase name is missing.",
      });
    }

    if (!phase.status || !PHASE_STATUSES.includes(phase.status)) {
      errors.push({
        field: `phases[${index}].status`,
        message: "Phase status is invalid.",
      });
    }

    /*
     * Support both:
     * startDate / endDate
     *
     * and:
     * start_date / end_date
     */
    const startDate = phase.startDate || phase.start_date;
    const endDate = phase.endDate || phase.end_date;

    /*
     * If dates exist, validate them.
     * We don't force old projects to have dates if
     * your existing data model doesn't contain them.
     */
    if (startDate || endDate) {
      if (!isValidDate(startDate)) {
        errors.push({
          field: `phases[${index}].startDate`,
          message: "Phase start date is invalid.",
        });
      }

      if (!isValidDate(endDate)) {
        errors.push({
          field: `phases[${index}].endDate`,
          message: "Phase end date is invalid.",
        });
      }

      if (
        isValidDate(startDate) &&
        isValidDate(endDate) &&
        new Date(startDate) > new Date(endDate)
      ) {
        errors.push({
          field: `phases[${index}]`,
          message: "Phase start date cannot be after end date.",
        });
      }
    }
  });
}

/**
 * Main project validation function.
 */
export function validateProject(project) {
  const errors = [];

  if (!project || typeof project !== "object") {
    return {
      valid: false,
      errors: [
        {
          field: "project",
          message: "Project data is missing or invalid.",
        },
      ],
    };
  }

  // -----------------------------
  // Required project fields
  // -----------------------------

  if (
    project.id === null ||
    project.id === undefined ||
    project.id === ""
  ) {
    errors.push({
      field: "id",
      message: "Project ID is missing.",
    });
  }

  if (
    !project.titleMr ||
    typeof project.titleMr !== "string" ||
    !project.titleMr.trim()
  ) {
    errors.push({
      field: "titleMr",
      message: "Marathi project title is missing.",
    });
  }

  if (
    !project.titleEn ||
    typeof project.titleEn !== "string" ||
    !project.titleEn.trim()
  ) {
    errors.push({
      field: "titleEn",
      message: "English project title is missing.",
    });
  }

  if (
    !project.location ||
    typeof project.location !== "string" ||
    !project.location.trim()
  ) {
    errors.push({
      field: "location",
      message: "Project location is missing.",
    });
  }

  // -----------------------------
  // Budget
  // -----------------------------

  if (!isValidNumber(project.budget)) {
    errors.push({
      field: "budget",
      message: "Project budget is not a valid number.",
    });
  } else if (Number(project.budget) < 0) {
    errors.push({
      field: "budget",
      message: "Project budget cannot be negative.",
    });
  }

  // -----------------------------
  // Progress
  // -----------------------------

  if (!isValidNumber(project.progress)) {
    errors.push({
      field: "progress",
      message: "Project progress is not a valid number.",
    });
  } else {
    const progress = Number(project.progress);

    if (progress < 0 || progress > 100) {
      errors.push({
        field: "progress",
        message: "Project progress must be between 0 and 100.",
      });
    }
  }

  // -----------------------------
  // Lifecycle
  // -----------------------------

  if (!LIFECYCLE_STAGES.includes(project.lifecycleStage)) {
    errors.push({
      field: "lifecycleStage",
      message: "Project lifecycle stage is invalid.",
    });
  }

  // -----------------------------
  // Priority
  // -----------------------------

  if (!PROJECT_PRIORITIES.includes(project.priority)) {
    errors.push({
      field: "priority",
      message: "Project priority is invalid.",
    });
  }

  // -----------------------------
  // Decision reason
  // -----------------------------

  if (
    project.decisionReason === null ||
    project.decisionReason === undefined
  ) {
    errors.push({
      field: "decisionReason",
      message: "Project decision reason is missing.",
    });
  }

  // -----------------------------
  // Contractor
  // -----------------------------

  if (
    project.contractor !== undefined &&
    project.contractor !== null &&
    typeof project.contractor !== "string"
  ) {
    errors.push({
      field: "contractor",
      message: "Contractor information is invalid.",
    });
  }

  // -----------------------------
  // Financial utilization
  // -----------------------------

  if (project.financialUtilization !== undefined) {
    if (!isValidNumber(project.financialUtilization)) {
      errors.push({
        field: "financialUtilization",
        message: "Financial utilization is invalid.",
      });
    } else if (Number(project.financialUtilization) < 0) {
      errors.push({
        field: "financialUtilization",
        message: "Financial utilization cannot be negative.",
      });
    } else if (
      isValidNumber(project.budget) &&
      Number(project.financialUtilization) > Number(project.budget)
    ) {
      errors.push({
        field: "financialUtilization",
        message: "Financial utilization exceeds project budget.",
      });
    }
  }

  // -----------------------------
  // Project dates
  // -----------------------------

  const projectStartDate =
    project.startDate || project.start_date;

  const projectEndDate =
    project.endDate || project.end_date;

  if (projectStartDate || projectEndDate) {
    if (!isValidDate(projectStartDate)) {
      errors.push({
        field: "startDate",
        message: "Project start date is invalid.",
      });
    }

    if (!isValidDate(projectEndDate)) {
      errors.push({
        field: "endDate",
        message: "Project end date is invalid.",
      });
    }

    if (
      isValidDate(projectStartDate) &&
      isValidDate(projectEndDate) &&
      !isValidDateRange(projectStartDate, projectEndDate)
    ) {
      errors.push({
        field: "projectDates",
        message: "Project start date cannot be after end date.",
      });
    }
  }

  // -----------------------------
  // Budget breakdown
  // -----------------------------

  if (project.budgetBreakdown !== undefined) {
    validateBudgetBreakdown(project, errors);
  }

  // -----------------------------
  // Phases
  // -----------------------------

  if (project.phases !== undefined) {
    validateProjectPhases(project, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate multiple projects without
 * crashing the whole dashboard.
 */
export function validateProjects(projects) {
  if (!Array.isArray(projects)) {
    return {
      validProjects: [],
      invalidProjects: [],
      allValid: false,
    };
  }

  const validProjects = [];
  const invalidProjects = [];

  projects.forEach((project) => {
    const validation = validateProject(project);

    if (validation.valid) {
      validProjects.push({
        ...project,
        __integrityValid: true,
        __integrityErrors: [],
      });
    } else {
      invalidProjects.push({
        ...project,
        __integrityValid: false,
        __integrityErrors: validation.errors,
      });

      if (import.meta.env.DEV) {
        console.error(
          "Project data integrity error:",
          project,
          validation.errors
        );
      }
    }
  });

  return {
    validProjects,
    invalidProjects,
    allValid: invalidProjects.length === 0,
  };
}

/**
 * Safe progress value for UI.
 *
 * This function does NOT hide corruption.
 * It returns null when invalid so UI can show
 * a warning instead of a fake progress value.
 */
export function getSafeProgress(value) {
  if (!isValidNumber(value)) {
    return null;
  }

  const progress = Number(value);

  if (progress < 0 || progress > 100) {
    return null;
  }

  return progress;
}

/**
 * Safe currency formatting.
 */
export function formatSafeCurrency(value) {
  if (!isValidNumber(value) || Number(value) < 0) {
    return "माहिती उपलब्ध नाही";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}