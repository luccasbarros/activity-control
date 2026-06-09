# Design Reference

## Product Type

Activity Control is an internal operations tool. The interface should feel like a focused SaaS workspace, not a landing page.

## Reference Direction

The selected direction combines:

- Linear/GitHub-style issue management density;
- GitHub Projects-style status badges, lists, and board affordances;
- Vercel/GitHub-style neutral surfaces and clear product shell;
- Material-style adaptive mobile navigation;
- WCAG 2.2 accessibility constraints for touch targets, focus states, contrast, and predictable navigation.

Local visual references used during design review:

- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 101957.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102017.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102026.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102036.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102053.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102117.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102143.png`
- `C:\Users\2c\Pictures\Screenshots\Screenshot 2026-06-09 102152.png`

## Visual Principles

- Use a real application shell with navigation, account access, and product version.
- Keep colors neutral and functional.
- Use accent colors for state and priority, not decoration.
- Prefer dense but readable lists over decorative cards.
- Keep mobile navigation explicit and thumb-friendly.
- Avoid long one-page anchor navigation as the primary IA.
- Keep touch targets at least 44px where practical.
- Use icons to improve scan speed, but keep text labels on primary navigation.

## Layout Decisions

- Desktop: sidebar navigation plus top user/account area.
- Mobile: top app bar plus bottom navigation.
- Dashboard: separate route focused on operational state.
- Activities: separate route for filtering, pagination, and activity operations.
- Create activity: separate route to reduce clutter.
- History: separate route for operational auditability.

## UX Rules

- Dashboard answers: what needs attention now?
- Activity list answers: what work exists and how do I act on it?
- Create/edit flows should return to the previous working context with toast feedback.
- Critical and blocked work must be easy to spot.
- No page should require horizontal scrolling.
