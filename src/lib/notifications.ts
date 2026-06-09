export type Notification = {
  type: "success" | "error";
  message: string;
};

const noticeMessages: Record<string, string> = {
  "activity-created": "Activity created.",
  "activity-updated": "Activity updated.",
  "activity-deleted": "Activity deleted.",
};

export function getNotification({
  error,
  notice,
}: {
  error?: string;
  notice?: string;
}): Notification | null {
  if (error) {
    return {
      type: "error",
      message: error,
    };
  }

  if (notice && noticeMessages[notice]) {
    return {
      type: "success",
      message: noticeMessages[notice],
    };
  }

  return null;
}
