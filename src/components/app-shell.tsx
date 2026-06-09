import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { type CurrentUser } from "@/lib/auth";
import { UI_COPY } from "@/lib/copy";
import { PRODUCT_INITIALS, PRODUCT_NAME, PRODUCT_VERSION } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import {
  MobileBottomNavigation,
  SidebarNavigation,
} from "./app-navigation";
import { ThemeToggle } from "./theme-toggle";

type AppShellProps = {
  children: React.ReactNode;
  user: CurrentUser;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppShell({ children, user }: AppShellProps) {
  const initials = getInitials(user.name);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="brand" href={ROUTES.dashboard}>
          <span className="brand-mark">{PRODUCT_INITIALS}</span>
          <span>
            <strong>{PRODUCT_NAME}</strong>
            <small>{UI_COPY.product.workspace}</small>
          </span>
        </Link>

        <SidebarNavigation />

        <div className="sidebar-footer">
          <p className="version-label">v{PRODUCT_VERSION}</p>
          <div className="sidebar-user">
            <span className="avatar">{initials}</span>
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div>
            <p className="topbar-kicker">{PRODUCT_NAME}</p>
            <p className="topbar-title">{UI_COPY.product.topbarTitle}</p>
          </div>

          <div className="topbar-actions">
            <ThemeToggle />
            <details className="account-menu">
              <summary
                aria-label={UI_COPY.account.openMenu}
                className="account-summary"
              >
                <span className="avatar">{initials}</span>
                <UserCircle aria-hidden="true" size={18} />
              </summary>
              <div className="account-popover">
                <div className="account-identity">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <form action={logoutAction}>
                  <button className="menu-action" type="submit">
                    <LogOut aria-hidden="true" size={16} />
                    {UI_COPY.account.logout}
                  </button>
                </form>
              </div>
            </details>
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>

      <MobileBottomNavigation />
    </div>
  );
}
