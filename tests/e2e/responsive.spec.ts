import { expect, type Page, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Internal activity control" }),
  ).toBeVisible();
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

    test(`dashboard fits ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await signIn(page);

      await expect(page.getByText("Signed in")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Recent changes" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Create activity" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Activity list" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Create activity" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Activity pagination" })).toBeVisible();

      await page.locator("summary", { hasText: "Edit activity" }).first().click();
      await expect(page.getByRole("button", { name: "Save changes" }).first()).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }

  test("pagination and toast remain usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);

    await expect(page.getByText(/^Page 1 of \d+$/)).toBeVisible();
    await page.getByRole("link", { name: "Next" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText(/^Page 2 of \d+$/)).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/?notice=activity-created");
    await expect(page.getByRole("status")).toContainText("Activity created");
    await expect(page.getByRole("button", { name: "Dismiss notification" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
