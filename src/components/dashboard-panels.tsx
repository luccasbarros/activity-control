import {
  ActivityStatus,
  Category,
  Priority,
  type Activity,
} from "@prisma/client";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { UI_COPY } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";
import {
  categoryOptions,
  getLabel,
  priorityOptions,
  statusOptions,
} from "@/lib/options";
import { ROUTES } from "@/lib/routes";

type DashboardPanelsProps = {
  activities: Activity[];
};

const statusOrder = [
  ActivityStatus.PENDING,
  ActivityStatus.IN_PROGRESS,
  ActivityStatus.BLOCKED,
  ActivityStatus.DONE,
];

const priorityOrder = [
  Priority.CRITICAL,
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
];

function countBy<T extends string>(items: Activity[], getKey: (item: Activity) => T) {
  return items.reduce<Record<T, number>>(
    (acc, item) => {
      const key = getKey(item);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<T, number>,
  );
}

function maxCount(values: number[]) {
  return Math.max(1, ...values);
}

export function DashboardPanels({ activities }: DashboardPanelsProps) {
  const byStatus = countBy(activities, (activity) => activity.status);
  const byPriority = countBy(activities, (activity) => activity.priority);
  const byCategory = countBy(activities, (activity) => activity.category);
  const byTeam = countBy(activities, (activity) => activity.team);
  const teamItems = Object.entries(byTeam)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const statusMax = maxCount(statusOrder.map((status) => byStatus[status] ?? 0));
  const priorityMax = maxCount(
    priorityOrder.map((priority) => byPriority[priority] ?? 0),
  );
  const categoryMax = maxCount(
    Object.values(Category).map((category) => byCategory[category] ?? 0),
  );
  const teamMax = maxCount(teamItems.map(([, count]) => count));
  const alertActivities = activities
    .filter(
      (activity) =>
        activity.status === ActivityStatus.BLOCKED ||
        activity.priority === Priority.CRITICAL,
    )
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return (
    <div className="dashboard-grid">
      <section className="panel dashboard-panel">
        <PanelTitle title={UI_COPY.overview.statusDistribution} />
        <div className="bar-list">
          {statusOrder.map((status) => (
            <BarRow
              count={byStatus[status] ?? 0}
              key={status}
              label={getLabel(statusOptions, status)}
              max={statusMax}
              tone={status.toLowerCase()}
            />
          ))}
        </div>
      </section>

      <section className="panel dashboard-panel">
        <PanelTitle title={UI_COPY.overview.priorityDistribution} />
        <div className="bar-list">
          {priorityOrder.map((priority) => (
            <BarRow
              count={byPriority[priority] ?? 0}
              key={priority}
              label={getLabel(priorityOptions, priority)}
              max={priorityMax}
              tone={priority.toLowerCase()}
            />
          ))}
        </div>
      </section>

      <section className="panel dashboard-panel">
        <PanelTitle title={UI_COPY.overview.categoryMix} />
        <div className="bar-list">
          {Object.values(Category).map((category) => (
            <BarRow
              count={byCategory[category] ?? 0}
              key={category}
              label={getLabel(categoryOptions, category)}
              max={categoryMax}
              tone="neutral"
            />
          ))}
        </div>
      </section>

      <section className="panel dashboard-panel">
        <PanelTitle title={UI_COPY.overview.teamWorkload} />
        <div className="bar-list">
          {teamItems.map(([team, count]) => (
            <BarRow
              count={count}
              key={team}
              label={team}
              max={teamMax}
              tone="blue"
            />
          ))}
        </div>
      </section>

      <section className="panel dashboard-panel dashboard-panel-wide">
        <div className="panel-title-row">
          <PanelTitle title={UI_COPY.observability.operationalAlerts} />
          <Link className="inline-link" href={`${ROUTES.activities}?priority=CRITICAL`}>
            {UI_COPY.observability.viewCritical}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>

        {alertActivities.length === 0 ? (
          <div className="quiet-state">
            <ShieldAlert aria-hidden="true" size={20} />
            <span>{UI_COPY.observability.noAlerts}</span>
          </div>
        ) : (
          <div className="alert-list">
            {alertActivities.map((activity) => (
              <article className="alert-row" key={activity.id}>
                <AlertTriangle aria-hidden="true" size={18} />
                <div>
                  <strong>{activity.title}</strong>
                  <span>
                    {getLabel(priorityOptions, activity.priority)} priority ·{" "}
                    {getLabel(statusOptions, activity.status)} · Updated{" "}
                    {formatDateTime(activity.updatedAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PanelTitle({ title }: { title: string }) {
  return <h2 className="panel-title">{title}</h2>;
}

function BarRow({
  count,
  label,
  max,
  tone,
}: {
  count: number;
  label: string;
  max: number;
  tone: string;
}) {
  const width = `${Math.max(4, Math.round((count / max) * 100))}%`;

  return (
    <div className="bar-row">
      <div className="bar-row-header">
        <span>{label}</span>
        <strong>{count}</strong>
      </div>
      <div className="bar-track">
        <span className="bar-fill" data-tone={tone} style={{ width }} />
      </div>
    </div>
  );
}
