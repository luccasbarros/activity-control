import { type ActivityMetrics } from "@/lib/metrics";

const metricsConfig = [
  { key: "total", label: "Total" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In progress" },
  { key: "blocked", label: "Blocked" },
  { key: "done", label: "Done" },
] as const;

export function MetricCards({ metrics }: { metrics: ActivityMetrics }) {
  return (
    <section
      aria-labelledby="overview-heading"
      className="grid scroll-mt-28 gap-4"
      id="overview"
    >
      <div>
        <h2 className="text-2xl font-semibold text-ink" id="overview-heading">
          Overview
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          Current activity distribution by status.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metricsConfig.map((metric) => (
          <article key={metric.key} className="metric-card">
            <p className="text-sm font-medium text-slate">{metric.label}</p>
            <strong className="mt-2 block text-3xl font-semibold text-ink">
              {metrics[metric.key]}
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}
