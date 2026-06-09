export const ACTIVITY_FIELD_LIMITS = {
  assignee: { max: 80, min: 2 },
  description: { max: 1000, min: 3 },
  team: { max: 80, min: 2 },
  title: { max: 120, min: 3 },
} as const;

export const FORM_FIELDS = {
  assignee: "assignee",
  category: "category",
  description: "description",
  email: "email",
  password: "password",
  priority: "priority",
  returnTo: "returnTo",
  status: "status",
  team: "team",
  title: "title",
} as const;

export const QUERY_PARAMS = {
  assignee: "assignee",
  category: "category",
  error: "error",
  notice: "notice",
  page: "page",
  pageSize: "pageSize",
  priority: "priority",
  team: "team",
} as const;

export const NOTICE_CODES = {
  activityCreated: "activity-created",
  activityDeleted: "activity-deleted",
  activityUpdated: "activity-updated",
} as const;

export const NOTICE_MESSAGES = {
  [NOTICE_CODES.activityCreated]: "Activity created.",
  [NOTICE_CODES.activityDeleted]: "Activity deleted.",
  [NOTICE_CODES.activityUpdated]: "Activity updated.",
} as const;

export const LOG_EVENTS = {
  activityCreated: "activity.created",
  activityDeleted: "activity.deleted",
  activityDeleteFailed: "activity.delete_failed",
  activityUpdated: "activity.updated",
  activityUpdateFailed: "activity.update_failed",
  authLoginFailed: "auth.login_failed",
  authLoginSucceeded: "auth.login_succeeded",
  authLogout: "auth.logout",
} as const;

export const LOG_FAILURE_REASONS = {
  invalidCredentials: "invalid_credentials",
  missingCredentials: "missing_credentials",
} as const;

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const TOAST_DURATION_MS = 4500;

export const ACTIVITY_CHANGE_SUMMARIES = {
  created: "Created activity.",
  deleted: "Deleted activity.",
} as const;

export const THEME_STORAGE_KEY = "activity-control-theme";
