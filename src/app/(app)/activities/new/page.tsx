import { createActivityAction } from "@/app/actions";
import { ActivityForm } from "@/components/activity-form";
import { PageHeading } from "@/components/page-heading";

export const dynamic = "force-dynamic";

export default function NewActivityPage() {
  return (
    <div className="page-stack">
      <PageHeading
        description="Create a new internal activity with ownership, priority, category, and status."
        eyebrow="Activity operations"
        title="New activity"
      />

      <section className="panel">
        <ActivityForm
          action={createActivityAction}
          returnTo="/activities"
          submitLabel="Create activity"
        />
      </section>
    </div>
  );
}
