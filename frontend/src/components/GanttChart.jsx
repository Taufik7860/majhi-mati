import { useMemo } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
  },
  ONGOING: {
    label: "Ongoing",
    icon: Clock3,
  },
  DELAYED: {
    label: "Delayed",
    icon: AlertTriangle,
  },
  PENDING: {
    label: "Pending",
    icon: Clock3,
  },
};

function getDaysBetween(start, end) {
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

export default function ProjectGantt({
  phases = [],
  editable = false,
  onUpdatePhase,
}) {
  const timeline = useMemo(() => {
    if (!phases.length) {
      return {
        start: new Date(),
        end: new Date(),
        totalDays: 1,
      };
    }

    const dates = phases.flatMap((phase) => [
      new Date(phase.start_date),
      new Date(phase.end_date),
    ]);

    const start = new Date(
      Math.min(...dates.map((date) => date.getTime()))
    );

    const end = new Date(
      Math.max(...dates.map((date) => date.getTime()))
    );

    const totalDays = getDaysBetween(start, end);

    return {
      start,
      end,
      totalDays,
    };
  }, [phases]);

  const getPosition = (date) => {
    const current = new Date(date);

    const diff =
      (current.getTime() - timeline.start.getTime()) /
      (1000 * 60 * 60 * 24);

    return Math.max(
      0,
      Math.min(100, (diff / timeline.totalDays) * 100)
    );
  };

  const getWidth = (start, end) => {
    const left = getPosition(start);
    const right = getPosition(end);

    return Math.max(2, right - left);
  };

  if (!phases.length) {
    return (
      <div className="gantt-empty">
        <CalendarDays size={32} />

        <h3>No project phases available</h3>

        <p>
          Project timeline will appear here once phases
          are added.
        </p>
      </div>
    );
  }

  return (
    <section className="gantt-card">
      <div className="gantt-header">
        <div>
          <div className="gantt-title">
            <CalendarDays size={22} />

            Project Development Timeline
          </div>

          <p>
            Phase-wise development monitoring
          </p>
        </div>

        <div className="gantt-legend">
          <span>
            <i className="legend-completed"></i>
            Completed
          </span>

          <span>
            <i className="legend-ongoing"></i>
            Ongoing
          </span>

          <span>
            <i className="legend-pending"></i>
            Pending
          </span>
        </div>
      </div>

      <div className="gantt-body">

        {/* Timeline header */}

        <div className="gantt-row gantt-axis">

          <div className="gantt-phase-name">
            Project Phase
          </div>

          <div className="gantt-timeline">
            <span>
              {timeline.start.toLocaleDateString()}
            </span>

            <span>
              {timeline.end.toLocaleDateString()}
            </span>
          </div>

        </div>

        {/* Phase rows */}

        {phases.map((phase) => {
          const status =
            STATUS_CONFIG[phase.status] ||
            STATUS_CONFIG.PENDING;

          const StatusIcon = status.icon;

          return (
            <div
              className="gantt-row"
              key={phase.id}
            >

              <div className="gantt-phase-name">

                <strong>
                  {phase.phase_name}
                </strong>

                <small>
                  {phase.start_date} →{" "}
                  {phase.end_date}
                </small>

                <span
                  className={`gantt-status ${phase.status?.toLowerCase()}`}
                >
                  <StatusIcon size={12} />

                  {status.label}
                </span>

              </div>

              <div className="gantt-timeline">

                <div
                  className="gantt-bar"
                  style={{
                    left: `${getPosition(
                      phase.start_date
                    )}%`,

                    width: `${getWidth(
                      phase.start_date,
                      phase.end_date
                    )}%`,
                  }}
                >

                  <div
                    className="gantt-progress"
                    style={{
                      width: `${phase.progress || 0}%`,
                    }}
                  />

                  <span>
                    {phase.progress || 0}%
                  </span>

                </div>

              </div>

              {editable && (
                <div className="gantt-edit">

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={phase.progress || 0}
                    onChange={(e) =>
                      onUpdatePhase?.(
                        phase.id,
                        {
                          progress:
                            Number(e.target.value),
                        }
                      )
                    }
                  />

                  <select
                    value={
                      phase.status || "PENDING"
                    }
                    onChange={(e) =>
                      onUpdatePhase?.(
                        phase.id,
                        {
                          status:
                            e.target.value,
                        }
                      )
                    }
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="ONGOING">
                      Ongoing
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="DELAYED">
                      Delayed
                    </option>
                  </select>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </section>
  );
}