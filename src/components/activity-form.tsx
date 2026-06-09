import { type Activity } from "@prisma/client";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "@/lib/options";
import { UI_COPY } from "@/lib/copy";

type ActivityFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<Activity>;
  submitLabel: string;
  compact?: boolean;
  returnTo?: string;
};

export function ActivityForm({
  action,
  defaultValues,
  submitLabel,
  compact = false,
  returnTo,
}: ActivityFormProps) {
  return (
    <form action={action} className={compact ? "space-y-4" : "space-y-5"}>
      {returnTo ? <input name="returnTo" type="hidden" value={returnTo} /> : null}

      <div
        className={
          compact
            ? "grid gap-4 md:grid-cols-2"
            : "grid gap-4 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_0.8fr_0.8fr]"
        }
      >
        <Field label={UI_COPY.fields.title}>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            minLength={3}
            maxLength={120}
            className="field"
            placeholder={UI_COPY.formPlaceholders.title}
          />
        </Field>

        <Field label={UI_COPY.fields.team}>
          <input
            name="team"
            defaultValue={defaultValues?.team ?? ""}
            required
            minLength={2}
            maxLength={80}
            className="field"
            placeholder={UI_COPY.formPlaceholders.team}
          />
        </Field>

        <Field label={UI_COPY.fields.assignee}>
          <input
            name="assignee"
            defaultValue={defaultValues?.assignee ?? ""}
            required
            minLength={2}
            maxLength={80}
            className="field"
            placeholder={UI_COPY.formPlaceholders.assignee}
          />
        </Field>
      </div>

      <Field label={UI_COPY.fields.description}>
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          required
          minLength={3}
          maxLength={1000}
          rows={compact ? 3 : 4}
          className="field resize-y"
          placeholder={UI_COPY.formPlaceholders.description}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={UI_COPY.fields.priority}>
          <select
            name="priority"
            defaultValue={defaultValues?.priority ?? "MEDIUM"}
            className="field"
            required
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={UI_COPY.fields.category}>
          <select
            name="category"
            defaultValue={defaultValues?.category ?? "FEATURE"}
            className="field"
            required
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={UI_COPY.fields.status}>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "PENDING"}
            className="field"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="primary-button">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}
