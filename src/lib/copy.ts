export const UI_COPY = {
  account: {
    logout: "Logout",
    openMenu: "Open account menu",
  },
  actions: {
    apply: "Apply",
    clear: "Clear",
    createActivity: "Create activity",
    delete: "Delete",
    edit: "Edit",
    newActivity: "New activity",
    saveChanges: "Save changes",
    set: "Set",
  },
  activityDelete: {
    confirmationSuffix: "This action cannot be undone.",
  },
  activities: {
    description: "Filter, review, edit, and delete internal activities.",
    emptyDescription:
      "Create a new activity or clear the active filters to see more records.",
    emptyTitle: "No activities found",
    eyebrow: "Activity operations",
    filtersDescription:
      "Filters are encoded in the URL so the same view can be reproduced after refresh.",
    title: "Activities",
  },
  dashboard: {
    description:
      "Track status, risk, workload, and recent operational movement.",
    eyebrow: "Operations overview",
    title: "Dashboard",
  },
  dialog: {
    closeEdit: "Close edit dialog",
    editActivity: "Edit activity",
  },
  fields: {
    assignee: "Assignee",
    category: "Category",
    created: "Created",
    description: "Description",
    email: "Email",
    pageSize: "Page size",
    password: "Password",
    priority: "Priority",
    status: "Status",
    team: "Team",
    title: "Title",
    updated: "Updated",
  },
  filters: {
    allCategories: "All categories",
    allPriorities: "All priorities",
    assigneePlaceholder: "Alex",
    teamPlaceholder: "Platform",
  },
  formPlaceholders: {
    assignee: "Alex Morgan",
    description: "Describe the activity, context, and expected outcome.",
    team: "Platform",
    title: "Review onboarding flow",
  },
  history: {
    description:
      "Review recent create, update, and delete events recorded by Server Actions.",
    emptyDescription: "Changes will appear here after activity operations.",
    eyebrow: "Operational monitor",
    title: "History",
  },
  login: {
    description: "Use the seeded local account to review the authenticated dashboard.",
    signIn: "Sign in",
  },
  navigation: {
    newActivityShort: "New",
    mobile: "Mobile navigation",
    primary: "Primary navigation",
  },
  newActivity: {
    description:
      "Create a new internal activity with ownership, priority, category, and status.",
    title: "New activity",
  },
  notifications: {
    activityCreated: "Activity created.",
    activityDeleted: "Activity deleted.",
    activityUpdated: "Activity updated.",
    dismiss: "Dismiss notification",
  },
  observability: {
    noAlerts: "No blocked or critical activities.",
    operationalAlerts: "Operational alerts",
    viewCritical: "View critical",
  },
  overview: {
    categoryMix: "Category mix",
    currentDistribution: "Current activity distribution by status.",
    priorityDistribution: "Priority distribution",
    statusDistribution: "Status distribution",
    teamWorkload: "Team workload",
    title: "Overview",
  },
  pagination: {
    ariaLabel: "Activity pagination",
    next: "Next",
    pageLabel: "Page",
    pageOfLabel: "of",
    previous: "Previous",
    resetSize: "Reset size",
    showingLabel: "Showing",
    activitiesLabel: "activities",
  },
  product: {
    topbarTitle: "Activity operations",
    workspace: "Operations workspace",
  },
  theme: {
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
  },
} as const;

export const VALIDATION_MESSAGES = {
  activityNotFound: "Activity not found.",
  invalidActivity: "Invalid activity.",
  invalidCategory: "Select a valid category.",
  invalidPriority: "Select a valid priority.",
  invalidStatus: "Select a valid status.",
  loginMissingCredentials: "Email and password are required.",
  loginInvalidCredentials: "Invalid email or password.",
  requiredAssignee: "Assignee is required.",
  requiredDescription: "Description is required.",
  requiredTeam: "Team is required.",
  requiredTitle: "Title is required.",
} as const;

export const FORM_LIMIT_MESSAGES = {
  assigneeMax: "Assignee must have at most 80 characters.",
  assigneeMin: "Assignee must have at least 2 characters.",
  descriptionMax: "Description must have at most 1000 characters.",
  descriptionMin: "Description must have at least 3 characters.",
  teamMax: "Team must have at most 80 characters.",
  teamMin: "Team must have at least 2 characters.",
  titleMax: "Title must have at most 120 characters.",
  titleMin: "Title must have at least 3 characters.",
} as const;
