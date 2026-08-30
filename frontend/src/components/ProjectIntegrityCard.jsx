// src/components/ProjectIntegrityCard.jsx

import React from "react";
import {
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import DataIntegrityWarning from "./DataIntegrityWarning";

export default function ProjectIntegrityCard({
  project,
}) {
  const title =
    project?.titleMr ||
    project?.titleEn ||
    "Unknown Project";

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>
          <ShieldAlert size={22} />
        </div>

        <div>
          <div style={styles.badge}>
            <AlertTriangle size={12} />
            DATA INTEGRITY ISSUE
          </div>

          <h3 style={styles.title}>
            {title}
          </h3>

          {project?.titleEn &&
            project?.titleMr && (
              <div style={styles.subtitle}>
                {project.titleEn}
              </div>
            )}
        </div>
      </div>

      <DataIntegrityWarning
        errors={project?.__integrityErrors || []}
      />

      <div style={styles.safeMessage}>
        <strong>Safe handling:</strong>{" "}
        This project has not been rendered as trusted
        project data. Other valid projects remain available.
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "1.1rem",
    boxShadow: "0 4px 15px rgba(127, 29, 29, 0.06)",
  },

  header: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
  },

  icon: {
    flexShrink: 0,
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    color: "#b91c1c",
    fontSize: "0.68rem",
    fontWeight: "800",
  },

  title: {
    margin: "0.25rem 0 0",
    color: "#0f2b48",
    fontSize: "1rem",
  },

  subtitle: {
    marginTop: "0.15rem",
    color: "#64748b",
    fontSize: "0.72rem",
  },

  safeMessage: {
    marginTop: "0.8rem",
    padding: "0.65rem",
    borderRadius: "7px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "0.72rem",
    lineHeight: 1.5,
  },
};