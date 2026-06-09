"use client";

import Link from "next/link";
import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from "react";
import { ButtonSpinner } from "./button-spinner";

type PendingLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  href: string;
  pendingLabel: string;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

export function PendingLink({
  children,
  className,
  href,
  onClick,
  pendingLabel,
  ...props
}: PendingLinkProps) {
  const [pending, setPending] = useState(false);

  return (
    <Link
      {...props}
      aria-busy={pending}
      className={className}
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !isModifiedClick(event)) {
          setPending(true);
        }
      }}
    >
      {pending ? (
        <>
          <ButtonSpinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Link>
  );
}
