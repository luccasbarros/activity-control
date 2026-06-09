import { type ActivityChange, ActivityChangeType } from "@prisma/client";
import { UI_COPY } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";

type ChangeHistoryProps = {
  changes: ActivityChange[];
};

const changeLabels = {
  [ActivityChangeType.CREATED]: "Created",
  [ActivityChangeType.UPDATED]: "Updated",
  [ActivityChangeType.DELETED]: "Deleted",
};

export function ChangeHistory({ changes }: ChangeHistoryProps) {
  if (changes.length === 0) {
    return (
      <section className="panel scroll-mt-28" id="recent-changes">
        <h2 className="text-2xl font-semibold text-ink">
          {UI_COPY.history.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          {UI_COPY.history.emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <section className="panel scroll-mt-28" id="recent-changes">
      <h2 className="text-2xl font-semibold text-ink">
        {UI_COPY.history.title}
      </h2>
      <ol className="mt-5 grid gap-3">
        {changes.map((change) => (
          <li key={change.id} className="history-item">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill">{changeLabels[change.type]}</span>
              <strong className="text-sm text-ink">{change.activityTitle}</strong>
            </div>
            <p className="mt-2 text-sm text-slate">{change.summary}</p>
            <p className="mt-2 text-xs font-medium text-slate">
              {change.actorName} · {formatDateTime(change.createdAt)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
