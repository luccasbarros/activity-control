"use client";

import { type Activity } from "@prisma/client";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { UI_COPY } from "@/lib/copy";
import { ActivityForm } from "./activity-form";

type ActivityEditValues = Pick<
  Activity,
  | "assignee"
  | "category"
  | "description"
  | "priority"
  | "status"
  | "team"
  | "title"
>;

type ActivityEditDialogProps = {
  action: (formData: FormData) => void | Promise<void>;
  activity: ActivityEditValues;
  returnTo: string;
};

export function ActivityEditDialog({
  action,
  activity,
  returnTo,
}: ActivityEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="ghost-button" onClick={() => setOpen(true)} type="button">
        <Pencil aria-hidden="true" size={15} />
        {UI_COPY.actions.edit}
      </button>

      {open ? (
        <div
          className="modal-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <section
            aria-labelledby="edit-activity-title"
            aria-modal="true"
            className="modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <div>
                <p className="page-eyebrow">{UI_COPY.activities.eyebrow}</p>
                <h2 id="edit-activity-title">{UI_COPY.dialog.editActivity}</h2>
              </div>
              <button
                aria-label={UI_COPY.dialog.closeEdit}
                className="icon-button"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <ActivityForm
              action={action}
              defaultValues={activity}
              returnTo={returnTo}
              submitLabel={UI_COPY.actions.saveChanges}
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
