"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { UI_COPY } from "@/lib/copy";
import { PendingSubmitButton } from "./pending-submit-button";

type ActivityDeleteDialogProps = {
  action: (formData: FormData) => void | Promise<void>;
  activityTitle: string;
  returnTo: string;
};

export function ActivityDeleteDialog({
  action,
  activityTitle,
  returnTo,
}: ActivityDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  const modal = (
    <div
      className="modal-backdrop"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <section
        aria-labelledby="delete-activity-title"
        aria-modal="true"
        className="modal-panel modal-panel-sm"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">{UI_COPY.activities.eyebrow}</p>
            <h2 id="delete-activity-title">{UI_COPY.activityDelete.title}</h2>
          </div>
          <button
            aria-label={UI_COPY.dialog.closeDelete}
            className="icon-button"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="delete-dialog-body">
          <div className="delete-dialog-icon" aria-hidden="true">
            <Trash2 size={20} />
          </div>
          <div className="grid gap-2">
            <p>{UI_COPY.activityDelete.descriptionPrefix}</p>
            <p>
              <strong>{activityTitle}</strong>
            </p>
            <p>{UI_COPY.activityDelete.confirmationSuffix}</p>
          </div>
        </div>

        <form action={action} className="modal-actions">
          <input name="returnTo" type="hidden" value={returnTo} />
          <button
            className="ghost-button"
            onClick={() => setOpen(false)}
            type="button"
          >
            {UI_COPY.actions.cancel}
          </button>
          <PendingSubmitButton
            className="danger-button"
            pendingLabel={UI_COPY.loading.deleting}
          >
            <Trash2 aria-hidden="true" size={15} />
            {UI_COPY.actions.deleteActivity}
          </PendingSubmitButton>
        </form>
      </section>
    </div>
  );

  return (
    <>
      <button className="danger-button" onClick={() => setOpen(true)} type="button">
        <Trash2 aria-hidden="true" size={15} />
        {UI_COPY.actions.delete}
      </button>

      {open ? createPortal(modal, document.body) : null}
    </>
  );
}
