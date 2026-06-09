const sectionNavigationItems = [
  { href: "#overview", label: "Overview" },
  { href: "#recent-changes", label: "Recent changes" },
  { href: "#create-activity", label: "Create activity" },
  { href: "#activity-list", label: "Activity list" },
] as const;

export function SectionNavigation() {
  return (
    <nav aria-label="Dashboard sections" className="section-nav">
      {sectionNavigationItems.map((item) => (
        <a className="section-nav-link" href={item.href} key={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
