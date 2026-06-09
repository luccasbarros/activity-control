import { ActivityStatus, type Activity } from "@prisma/client";

export type ActivityMetrics = {
  total: number;
  pending: number;
  inProgress: number;
  blocked: number;
  done: number;
};

export function calculateActivityMetrics(
  activities: Pick<Activity, "status">[],
): ActivityMetrics {
  return activities.reduce<ActivityMetrics>(
    (metrics, activity) => {
      metrics.total += 1;

      if (activity.status === ActivityStatus.PENDING) {
        metrics.pending += 1;
      }

      if (activity.status === ActivityStatus.IN_PROGRESS) {
        metrics.inProgress += 1;
      }

      if (activity.status === ActivityStatus.BLOCKED) {
        metrics.blocked += 1;
      }

      if (activity.status === ActivityStatus.DONE) {
        metrics.done += 1;
      }

      return metrics;
    },
    {
      total: 0,
      pending: 0,
      inProgress: 0,
      blocked: 0,
      done: 0,
    },
  );
}
