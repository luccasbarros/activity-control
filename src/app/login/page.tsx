import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { getCurrentUser } from "@/lib/auth";
import { UI_COPY } from "@/lib/copy";
import { PRODUCT_NAME } from "@/lib/product";
import { ROUTES } from "@/lib/routes";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect(ROUTES.dashboard);
  }

  const params = (await searchParams) ?? {};
  const error = firstValue(params.error);

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-5 py-10">
      <section className="panel w-full">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate">
          {PRODUCT_NAME}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">
          {UI_COPY.login.signIn}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate">
          {UI_COPY.login.description}
        </p>

        {error ? <p className="alert mt-5">{error}</p> : null}

        <form action={loginAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-ink">
            <span>{UI_COPY.fields.email}</span>
            <input
              className="field"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue="admin@example.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            <span>{UI_COPY.fields.password}</span>
            <input
              className="field"
              name="password"
              type="password"
              autoComplete="current-password"
              defaultValue="ActivityControl123!"
              required
            />
          </label>

          <button className="primary-button w-full" type="submit">
            {UI_COPY.login.signIn}
          </button>
        </form>
      </section>
    </main>
  );
}
