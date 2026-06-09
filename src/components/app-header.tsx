import { logoutAction } from "@/app/login/actions";
import { type CurrentUser } from "@/lib/auth";

export function AppHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate">
          Activity Control
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">
          Internal activity control
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate">
          A local operations board for registering, filtering, and tracking
          internal team activities with Prisma and SQLite.
        </p>
      </div>

      <div className="panel flex flex-wrap items-center gap-3 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">
            Signed in
          </p>
          <p className="text-sm font-semibold text-ink">{user.name}</p>
        </div>
        <form action={logoutAction}>
          <button className="ghost-button" type="submit">
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
