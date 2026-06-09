import { NOTICE_MESSAGES } from "./constants";

export type Notification = {
  type: "success" | "error";
  message: string;
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

  if (notice && notice in NOTICE_MESSAGES) {
    return {
      type: "success",
      message: NOTICE_MESSAGES[notice as keyof typeof NOTICE_MESSAGES],
    };
  }

  return null;
}
