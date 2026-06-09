import { type Activity, ActivityStatus } from "@prisma/client";
import { deleteActivityAction, updateActivityAction } from "@/app/actions";
import { formatDateTime } from "@/lib/format";
import {
  categoryOptions,
  getLabel,
  priorityOptions,
  statusOptions,
} from "@/lib/options";
import { ActivityForm } from "./activity-form";
import { ConfirmSubmitButton } from "./confirm-submit-button";

type ActivityTableProps = {
  activities: Activity[];
  returnTo: string;
};

export function ActivityTable({ activities, returnTo }: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <section className="empty-state">
        <h2 className="text-xl font-semibold text-ink">No activities found</h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          Create a new activity or clear the active filters to see more records.
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
              <Info label="Team" value={activity.team} />
              <Info label="Assignee" value={activity.assignee} />
              <Info label="Created" value={formatDateTime(activity.createdAt)} />
              <Info label="Updated" value={formatDateTime(activity.updatedAt)} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <details className="w-full rounded-md border border-line bg-white p-4 lg:w-auto lg:min-w-full">
              <summary className="cursor-pointer text-sm font-semibold text-ink">
                Edit activity
              </summary>
              <div className="mt-4">
                <ActivityForm
                  action={updateActivityAction.bind(null, activity.id)}
                  defaultValues={activity}
                  returnTo={returnTo}
                  submitLabel="Save changes"
                  compact
                />
              </div>
            </details>

            <form action={deleteActivityAction.bind(null, activity.id)}>
              <input name="returnTo" type="hidden" value={returnTo} />
              <ConfirmSubmitButton
                className="danger-button"
                message={`Delete "${activity.title}"? This action cannot be undone.`}
              >
                Delete
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
