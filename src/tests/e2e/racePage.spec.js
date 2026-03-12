import { test, expect } from "@playwright/test";
import {
  TOTAL_RACERS_AVAILABLE,
  RACERS_PER_RACE,
} from "../../constants/raceConstants";

test.describe("Race Page E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the race page correctly", async ({ page }) => {
    await expect(page.locator("text=Horse Racing")).toBeVisible();

    await expect(
      page.locator("button:has-text('Generate Program')"),
    ).toBeVisible();
    await expect(page.locator("button:has-text('Start Race')")).toBeVisible();

    const startRaceBtn = page.locator("button:has-text('Start Race')");
    await expect(startRaceBtn).toBeDisabled();
  });

  test("generates program with racers and races", async ({ page }) => {
    await page.click("button:has-text('Generate Program')");

    await expect(page.locator("text=Racers List")).toBeVisible();

    const racerRows = page.locator(".racers-table tbody tr");
    await expect(racerRows).toHaveCount(TOTAL_RACERS_AVAILABLE);

    await expect(page.locator("button:has-text('Start Race')")).toBeEnabled();

    await expect(page.locator(".race-track")).toBeVisible();
    await expect(page.locator("text=Race #1")).toBeVisible();

    await expect(page.locator("text=Results")).toBeVisible();
  });

  test("starts race and shows pause button", async ({ page }) => {
    await page.click("button:has-text('Generate Program')");

    await expect(page.locator(".race-track")).toBeVisible();

    await page.click("button:has-text('Start Race')");

    await expect(page.locator("button:has-text('Pause Race')")).toBeVisible();

    await page.waitForTimeout(500);

    await expect(page.locator(".race-track__lanes-list")).toBeVisible();
  });

  test("pauses and resumes race", async ({ page }) => {
    await page.click("button:has-text('Generate Program')");

    await expect(page.locator(".race-track")).toBeVisible();

    await page.click("button:has-text('Start Race')");
    await expect(page.locator("button:has-text('Pause Race')")).toBeVisible();

    await page.click("button:has-text('Pause Race')");

    await expect(page.locator("button:has-text('Resume Race')")).toBeVisible();

    await page.click("button:has-text('Resume Race')");

    await expect(page.locator("button:has-text('Pause Race')")).toBeVisible();
  });

  test("displays race track lanes correctly", async ({ page }) => {
    await page.click("button:has-text('Generate Program')");

    const trackLanes = page.locator(".track-lane");
    await expect(trackLanes).toHaveCount(RACERS_PER_RACE);
  });

  test("displays racer information in table", async ({ page }) => {
    await page.click("button:has-text('Generate Program')");

    const racersTable = page.locator(".racers-table");
    await expect(racersTable.locator("text=Horse Name")).toBeVisible();
    await expect(racersTable.locator("text=Condition")).toBeVisible();
    await expect(racersTable.locator("text=Color")).toBeVisible();

    await expect(page.locator("td:has-text('Horse 1')").first()).toBeVisible();

    const colorCell = page.locator(".racers-table__color-cell").first();
    await expect(colorCell).toBeVisible();
  });

  test("multiple races are displayed in results", async ({ page }) => {
    await page.click("button:has-text('Generate Program')");

    await expect(page.locator(".race-results-list")).toBeVisible();
  });
});
