"use client";

import { useEffect, useState } from "react";
import { type Notification } from "@/lib/notifications";

type ToastProps = {
  notification: Notification | null;
};

export function Toast({ notification }: ToastProps) {
  const [visible, setVisible] = useState(Boolean(notification));

  useEffect(() => {
    setVisible(Boolean(notification));

    if (!notification) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(false), 4500);

    return () => window.clearTimeout(timer);
  }, [notification]);

  if (!notification || !visible) {
    return null;
  }

  return (
    <div className={`toast toast-${notification.type}`} role="status">
      <p>{notification.message}</p>
      <button
        aria-label="Dismiss notification"
        className="toast-close"
        onClick={() => setVisible(false)}
        type="button"
      >
        ×
      </button>
    </div>
  );
}
