# UI Decisions

## Navigation

Use route-based navigation instead of section anchors:

- `/dashboard`
- `/activities`
- `/activities/new`
- `/history`

The root route redirects to `/dashboard`.

## Mobile Navigation

Use bottom navigation with icons and labels for the main destinations. Keep account/logout in the top bar to avoid crowding the bottom nav.

## Desktop Navigation

Use a persistent sidebar with product identity, primary routes, version, and a compact account area. Use a top bar for page context and theme/account actions.

## Dashboard

The dashboard should include:

- status metrics;
- priority distribution;
- category or team workload;
- blocked and critical alerts;
- recent operational changes.

Charts should be simple CSS bars, not a heavy charting library.

## Activity List

Use cards for this delivery because each activity has rich text and actions. Keep the structure denser and cleaner:

- badges first;
- title and description;
- team/assignee/timestamps;
- actions grouped in a compact footer.

Filters should stay visible on desktop and stack cleanly on mobile. Active-filter chips are preferred when time allows.

## Create/Edit

Create activity gets a dedicated route. Edit activity uses a modal so the user stays in list context and sees the confirmation toast after save.

## Theme

Support light and dark themes with CSS variables and a local preference toggle. Do not make the palette one-note.

## Observability

Use structured server logs for auth and activity mutations. Keep visible auditability through activity history and dashboard monitor cards.
