import { expect, type Locator, type Page, test } from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function fillActivityForm(
  pageOrDialog: Page | Locator,
  values: {
    assignee: string;
    category: string;
    description: string;
    priority: string;
    status: string;
    team: string;
    title: string;
  },
) {
  await pageOrDialog.getByLabel("Title").fill(values.title);
  await pageOrDialog.getByLabel("Team").fill(values.team);
  await pageOrDialog.getByLabel("Assignee").fill(values.assignee);
  await pageOrDialog.getByLabel("Description").fill(values.description);
  await pageOrDialog.getByLabel("Priority").selectOption(values.priority);
  await pageOrDialog.getByLabel("Category").selectOption(values.category);
  await pageOrDialog.getByLabel("Status").selectOption(values.status);
}

test.describe("activity control core flows", () => {
  test("protects authenticated routes and clears the session on logout", async ({
    page,
  }) => {
    await page.goto("/activities");
    await expect(page).toHaveURL(/\/login$/);

    await signIn(page);
    await page.getByLabel("Open account menu").click();
    await page.getByRole("button", { name: "Logout" }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("creates, edits, cancels delete, deletes, and records history", async ({
    page,
  }) => {
    const suffix = uniqueSuffix();
    const title = `E2E activity ${suffix}`;
    const updatedTitle = `${title} updated`;

    await signIn(page);
    await page.goto("/activities/new");

    await fillActivityForm(page, {
      assignee: "E2E Owner",
      category: "FEATURE",
      description: "Created by an end-to-end test to validate the full activity workflow.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      team: "E2E Team",
      title,
    });
    await page.getByRole("button", { name: "Create activity" }).click();

    await expect(page).toHaveURL(/\/activities\?notice=activity-created/);
    await expect(page.getByRole("status")).toContainText("Activity created");
    await expect(page.getByText(title)).toBeVisible();

    const activityCard = page.locator("article").filter({ hasText: title });
    await activityCard.getByRole("button", { name: "Edit" }).click();

    const dialog = page.getByRole("dialog", { name: "Edit activity" });
    await fillActivityForm(dialog, {
      assignee: "E2E Owner",
      category: "FEATURE",
      description:
        "Updated by an end-to-end test to validate edit persistence and feedback.",
      priority: "LOW",
      status: "DONE",
      team: "E2E Team",
      title: updatedTitle,
    });
    await dialog.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByRole("status")).toContainText("Activity updated");
    await expect(page.getByText(updatedTitle)).toBeVisible();

    const updatedCard = page.locator("article").filter({ hasText: updatedTitle });
    let nativeDialogOpened = false;
    page.on("dialog", async (confirmation) => {
      nativeDialogOpened = true;
      await confirmation.dismiss();
    });

    await updatedCard.getByRole("button", { name: "Delete" }).click();
    const deleteDialog = page.getByRole("dialog", { name: "Delete activity" });
    await expect(deleteDialog).toBeVisible();
    await expect(deleteDialog).toContainText(updatedTitle);
    await expect(deleteDialog).toContainText("This action cannot be undone.");
    expect(nativeDialogOpened).toBe(false);

    await deleteDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(deleteDialog).toBeHidden();
    await expect(updatedCard).toBeVisible();

    await updatedCard.getByRole("button", { name: "Delete" }).click();
    await page
      .getByRole("dialog", { name: "Delete activity" })
      .getByRole("button", { name: "Delete activity" })
      .click();

    await expect(page.getByRole("status")).toContainText("Activity deleted");
    await expect(page.getByText(updatedTitle)).toBeHidden();

    await page.goto("/history");
    await expect(
      page.locator("li").filter({ hasText: updatedTitle }).filter({ hasText: "Deleted" }),
    ).toBeVisible();
  });

  test("applies combinable priority, team, and assignee filters", async ({
    page,
  }) => {
    const suffix = uniqueSuffix();
    const title = `Filtered activity ${suffix}`;
    const team = `Filter Team ${suffix}`;
    const assignee = `Filter Owner ${suffix}`;

    await signIn(page);
    await page.goto("/activities/new");

    await fillActivityForm(page, {
      assignee,
      category: "OPERATIONAL",
      description: "Created to validate combinable activity filters.",
      priority: "CRITICAL",
      status: "BLOCKED",
      team,
      title,
    });
    await page.getByRole("button", { name: "Create activity" }).click();

    await expect(page.getByText(title)).toBeVisible();

    const filterForm = page.getByRole("form", { name: "Activity filters" });
    await filterForm.getByLabel("Priority").selectOption("CRITICAL");
    await filterForm.getByLabel("Team").fill(team);
    await filterForm.getByLabel("Assignee").fill(assignee);
    await filterForm.getByRole("button", { name: "Apply" }).click();

    await expect(page).toHaveURL(/priority=CRITICAL/);
    const searchParams = new URL(page.url()).searchParams;
    expect(searchParams.get("team")).toBe(team);
    expect(searchParams.get("assignee")).toBe(assignee);
    const filteredCard = page.locator("article").filter({ hasText: title });
    await expect(filteredCard).toBeVisible();
    await expect(filteredCard.getByText("Critical")).toBeVisible();
    await expect(filteredCard.getByText("Blocked")).toBeVisible();

    await filteredCard.getByRole("button", { name: "Delete" }).click();
    await page
      .getByRole("dialog", { name: "Delete activity" })
      .getByRole("button", { name: "Delete activity" })
      .click();
    await expect(page.getByRole("status")).toContainText("Activity deleted");
  });

  test("serves baseline security headers", async ({ page }) => {
    const response = await page.goto("/login");
    const headers = response?.headers() ?? {};

    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  });
});
