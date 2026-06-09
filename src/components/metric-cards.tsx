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
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {metricsConfig.map((metric) => (
        <article key={metric.key} className="metric-card">
          <p className="text-sm font-medium text-slate">{metric.label}</p>
          <strong className="mt-2 block text-3xl font-semibold text-ink">
            {metrics[metric.key]}
          </strong>
        </article>
      ))}
    </section>
  );
}
