import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { raceSimulationService } from "../../utils/raceSimulationService";
import { generateRacers } from "../../utils/helpers";
import {
  RACE_DISTANCES,
  RACERS_PER_RACE,
  TICK_INTERVAL_MS,
} from "../../constants/raceConstants";

describe("raceSimulationService", () => {
  beforeEach(() => {
    raceSimulationService.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    raceSimulationService.clear();
    vi.useRealTimers();
  });

  const createMockRace = (racers, distance = RACE_DISTANCES[0]) => ({
    id: 1,
    distance,
    racers: racers.map((r) => ({
      id: r.id,
      position: r.id,
      progress: 0,
      score: 0,
      finishOrder: null,
    })),
  });

  describe("clear()", () => {
    it("does not throw when no interval is running", () => {
      expect(() => raceSimulationService.clear()).not.toThrow();
    });

    it("clears an existing interval", () => {
      const racers = generateRacers(RACERS_PER_RACE);
      const race = createMockRace(racers);

      const promise = raceSimulationService.run({
        racers,
        race,
        paused: false,
        tickInterval: TICK_INTERVAL_MS,
      });

      // Clear the interval immediately
      raceSimulationService.clear();

      // Advance past one tick - if interval wasn't cleared, this would resolve the promise
      vi.advanceTimersByTime(TICK_INTERVAL_MS + 1);

      // Promise should not resolve (interval was cleared)
      let resolved = false;
      promise.then(() => {
        resolved = true;
      });
      vi.runAllTimers();
      expect(resolved).toBe(false);
    });
  });

  describe("run()", () => {
    it("returns progress data when race finishes", async () => {
      const racers = generateRacers(RACERS_PER_RACE);
      const race = createMockRace(racers);

      const promise = raceSimulationService.run({
        racers,
        race,
        paused: false,
        tickInterval: TICK_INTERVAL_MS,
      });

      // Advance until race completes (10 racers need more ticks)
      for (let i = 0; i < 100; i++) {
        vi.advanceTimersByTime(TICK_INTERVAL_MS);
      }

      const result = await promise;

      expect(result).toHaveProperty("progress");
      expect(result).toHaveProperty("finishedRacers");
      expect(result).toHaveProperty("isFinished");
      expect(result.isFinished).toBe(true);
    });

    it("tracks finish order when racer reaches 100%", async () => {
      const racers = generateRacers(1);
      const race = createMockRace(racers);

      const promise = raceSimulationService.run({
        racers,
        race,
        paused: false,
        tickInterval: TICK_INTERVAL_MS,
      });

      // Simulate completion
      for (let i = 0; i < 30; i++) {
        vi.advanceTimersByTime(TICK_INTERVAL_MS);
      }

      const result = await promise;

      expect(result.finishedRacers).toContainEqual({
        racerId: 1,
        finishOrder: 1,
      });
    });

    it("does not finish when paused", async () => {
      const racers = generateRacers(RACERS_PER_RACE);
      const race = createMockRace(racers);

      const promise = raceSimulationService.run({
        racers,
        race,
        paused: true,
        tickInterval: TICK_INTERVAL_MS,
      });

      // Try to advance many timers - should not complete
      vi.advanceTimersByTime(15000);

      // Promise should still be pending (not resolved)
      let resolved = false;
      promise.then(() => {
        resolved = true;
      });

      // Run pending promises but don't advance more timers
      vi.runOnlyPendingTimers();
      expect(resolved).toBe(false);
    });

    it("returns a promise that resolves when race finishes", async () => {
      const racers = generateRacers(1);
      const race = createMockRace(racers);

      const promise = raceSimulationService.run({
        racers,
        race,
        paused: false,
        tickInterval: TICK_INTERVAL_MS,
      });

      for (let i = 0; i < 30; i++) {
        vi.advanceTimersByTime(TICK_INTERVAL_MS);
      }

      await expect(promise).resolves.toBeDefined();
    });

    it("handles race with no racers", async () => {
      const race = createMockRace([]);

      const promise = raceSimulationService.run({
        racers: [],
        race,
        paused: false,
        tickInterval: TICK_INTERVAL_MS,
      });

      vi.advanceTimersByTime(TICK_INTERVAL_MS);

      const result = await promise;
      expect(result.isFinished).toBe(true);
    });
  });
});
