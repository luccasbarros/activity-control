"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ClipboardPlus,
  History,
  type LucideIcon,
} from "lucide-react";
import { UI_COPY } from "@/lib/copy";
import { ROUTES } from "@/lib/routes";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { href: ROUTES.dashboard, label: UI_COPY.dashboard.title, icon: BarChart3 },
  { href: ROUTES.activities, label: UI_COPY.activities.title, icon: Activity },
  { href: ROUTES.newActivity, label: UI_COPY.navigation.newActivityShort, icon: ClipboardPlus },
  { href: ROUTES.history, label: UI_COPY.history.title, icon: History },
];

function isActivePath(pathname: string, href: string) {
  if (href === ROUTES.activities) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label={UI_COPY.navigation.primary} className="sidebar-nav">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className="sidebar-nav-link"
            data-active={active ? "true" : "false"}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden="true" size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label={UI_COPY.navigation.mobile} className="mobile-bottom-nav">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className="mobile-bottom-link"
            data-active={active ? "true" : "false"}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden="true" size={19} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
