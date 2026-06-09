import { AppShell } from "@/components/app-shell";
import { requireCurrentUser } from "@/lib/auth";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await requireCurrentUser();

  return <AppShell user={currentUser}>{children}</AppShell>;
}
