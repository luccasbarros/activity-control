import { type Activity, ActivityStatus } from "@prisma/client";
import { deleteActivityAction, updateActivityAction } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { UI_COPY } from "@/lib/copy";
import {
  categoryOptions,
  getLabel,
  priorityOptions,
  statusOptions,
} from "@/lib/options";
import { ActivityEditDialog } from "./activity-edit-dialog";
import { ConfirmSubmitButton } from "./confirm-submit-button";

type ActivityTableProps = {
  activities: Activity[];
  returnTo: string;
};

export function ActivityTable({ activities, returnTo }: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <section className="empty-state">
        <h2 className="text-xl font-semibold text-ink">
          {UI_COPY.activities.emptyTitle}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          {UI_COPY.activities.emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {activities.map((activity) => (
        <article key={activity.id} className="activity-card">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={activity.status} />
                <span className="pill">
                  {getLabel(priorityOptions, activity.priority)}
                </span>
                <span className="pill">
                  {getLabel(categoryOptions, activity.category)}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-ink">
                {activity.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate">
                {activity.description}
              </p>
            </div>

            <div className="grid gap-2 text-sm text-slate lg:min-w-64">
              <Info label={UI_COPY.fields.team} value={activity.team} />
              <Info label={UI_COPY.fields.assignee} value={activity.assignee} />
              <Info label={UI_COPY.fields.created} value={formatDateTime(activity.createdAt)} />
              <Info label={UI_COPY.fields.updated} value={formatDateTime(activity.updatedAt)} />
            </div>
          </div>

          <div className="activity-actions">
            <ActivityEditDialog
              action={updateActivityAction.bind(null, activity.id)}
              activity={{
                assignee: activity.assignee,
                category: activity.category,
                description: activity.description,
                priority: activity.priority,
                status: activity.status,
                team: activity.team,
                title: activity.title,
              }}
              returnTo={returnTo}
            />
            <form action={deleteActivityAction.bind(null, activity.id)}>
              <input name="returnTo" type="hidden" value={returnTo} />
              <ConfirmSubmitButton
                className="danger-button"
                message={`Delete "${activity.title}"? This action cannot be undone.`}
              >
                <Trash2 aria-hidden="true" size={15} />
                {UI_COPY.actions.delete}
              </ConfirmSubmitButton>
            </form>
          </div>
        </article>
      ))}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="font-medium text-ink">{label}</span>
      <span className="text-right">{value}</span>
    </p>
  );
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const className =
    status === ActivityStatus.BLOCKED
      ? "status-badge status-blocked"
      : status === ActivityStatus.DONE
        ? "status-badge status-done"
        : status === ActivityStatus.IN_PROGRESS
          ? "status-badge status-progress"
          : "status-badge status-pending";

  return <span className={className}>{getLabel(statusOptions, status)}</span>;
}
