import { expect, type Page, test } from "@playwright/test";
import { UI_COPY } from "../../src/lib/copy";
import { THEME_STORAGE_KEY } from "../../src/lib/constants";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.clientWidth;
    const scrollWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
    );
    const offenders = Array.from(document.querySelectorAll("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          tagName: element.tagName.toLowerCase(),
          text: element.textContent?.trim().slice(0, 80) ?? "",
          left: Math.floor(rect.left),
          right: Math.ceil(rect.right),
          width: Math.ceil(rect.width),
        };
      })
      .filter(
        (element) =>
          element.width > 0 &&
          (element.left < -1 || element.right > documentWidth + 1),
      )
      .slice(0, 5);

    return {
      documentWidth,
      offenders,
      scrollWidth,
    };
  });

  expect(
    overflow.scrollWidth,
    `Expected no horizontal overflow. Offenders: ${JSON.stringify(
      overflow.offenders,
    )}`,
  ).toBeLessThanOrEqual(overflow.documentWidth + 1);
}

test.describe("responsive activity control experience", () => {
  for (const viewport of viewports) {
    test(`login page fits ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/login");

      await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });

    test(`dashboard route fits ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await signIn(page);

      await expect(page.getByRole("navigation", { name: "Primary navigation" }).or(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      )).toBeVisible();
      await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Status distribution" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Operational alerts" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "History" })).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });

    test(`activities route fits ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await signIn(page);
      await page.goto("/activities");

      await expect(page.getByRole("heading", { name: "Activities" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
      await expect(page.getByRole("link", { name: "New activity" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Activity pagination" })).toBeVisible();

      await page.getByRole("button", { name: "Edit" }).first().click();
      await expect(page.getByRole("button", { name: "Save changes" }).first()).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }

  test("pagination and toast remain usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);
    await page.goto("/activities");

    await expect(page.getByText(/^Page 1 of \d+$/)).toBeVisible();
    await page.getByRole("link", { name: "Next" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText(/^Page 2 of \d+$/)).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/activities?notice=activity-created");
    await expect(page.getByRole("status")).toContainText("Activity created");
    await expect(page.getByRole("button", { name: "Dismiss notification" })).toBeVisible();
    await expect(page.locator(".toast-progress")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const toast = document.querySelector(".toast");
          const rect = toast?.getBoundingClientRect();

          return rect
            ? Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2)
            : Number.POSITIVE_INFINITY;
        }),
      )
      .toBeLessThan(32);
    await expectNoHorizontalOverflow(page);

    await page.route("**/activities*pageSize=10*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });
    await page.goto("/activities");
    await page.getByLabel("Page size").selectOption("10");
    const pageSizeClick = page.getByRole("button", { name: "Set" }).click();
    await expect(page.getByRole("button", { name: "Updating" })).toBeVisible();
    await pageSizeClick;
    await expect(page).toHaveURL(/pageSize=10/);
  });

  test("mobile bottom navigation moves between routes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);

    const mobileNav = page.getByRole("navigation", {
      name: "Mobile navigation",
    });

    await mobileNav.getByRole("link", { name: "Activities" }).click();
    await expect(page).toHaveURL(/\/activities$/);
    await expect(page.getByRole("heading", { name: "Activities" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await mobileNav.getByRole("link", { name: "New" }).click();
    await expect(page).toHaveURL(/\/activities\/new$/);
    await expect(page.getByRole("heading", { name: "New activity" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await mobileNav.getByRole("link", { name: "History" }).click();
    await expect(page).toHaveURL(/\/history$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "History" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("theme toggle applies and persists the selected theme", async ({
    page,
  }) => {
    await page.addInitScript((storageKey) => {
      if (!window.localStorage.getItem(storageKey)) {
        window.localStorage.setItem(storageKey, "light");
      }
    }, THEME_STORAGE_KEY);

    await page.setViewportSize({ width: 1440, height: 900 });
    await signIn(page);

    const documentRoot = page.locator("html");

    await expect(documentRoot).toHaveAttribute("data-theme", "light");
    await page
      .getByRole("button", { name: UI_COPY.theme.switchToDark })
      .click();
    await expect(documentRoot).toHaveAttribute("data-theme", "dark");
    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) => window.localStorage.getItem(storageKey),
          THEME_STORAGE_KEY,
        ),
      )
      .toBe("dark");

    await page.reload();
    await expect(documentRoot).toHaveAttribute("data-theme", "dark");
    await expectNoHorizontalOverflow(page);
  });
});
