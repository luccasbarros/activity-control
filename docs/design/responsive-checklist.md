# Responsive Checklist

## Desktop

- Sidebar remains visible.
- Top user/account area does not wrap awkwardly.
- Dashboard charts and alerts fit without horizontal overflow.
- Activity cards preserve action grouping and metadata alignment.

## Tablet

- Sidebar can remain compact or content can reflow without clipping.
- Cards and charts use two-column layouts where space allows.
- Forms avoid cramped multi-column fields.

## Mobile

- Bottom navigation is visible and touch-friendly.
- Top bar account actions are reachable.
- Main content has no horizontal overflow.
- Form fields are single-column.
- Activity actions remain clear and separated from metadata.
- Toasts fit within the viewport.

## Automated Coverage

Playwright should verify:

- login page fits desktop, tablet, and mobile;
- dashboard route fits desktop, tablet, and mobile;
- activities route fits desktop, tablet, and mobile;
- mobile navigation can move between main routes;
- pagination and toast feedback remain usable on mobile;
- horizontal overflow is not present.
