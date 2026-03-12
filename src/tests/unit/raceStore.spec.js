import Vue from "vue";
import Vuex from "vuex";
import { describe, it, expect, beforeEach, vi } from "vitest";
import raceStore from "../../stores/raceStore";
import {
  RACE_DISTANCES,
  RACERS_PER_RACE,
  TOTAL_RACERS_AVAILABLE,
} from "../../constants/raceConstants";

Vue.use(Vuex);

vi.mock("../../utils/raceSimulationService", () => ({
  raceSimulationService: {
    clear: vi.fn(),
    run: vi.fn(),
  },
}));

describe("raceStore", () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        raceStore,
      },
    });
  });

  it("initializes racers correctly", () => {
    store.dispatch("raceStore/initRacers");
    const racers = store.getters["raceStore/getRacers"];
    expect(racers).toHaveLength(TOTAL_RACERS_AVAILABLE);
    expect(racers[0]).toHaveProperty("id");
    expect(racers[0]).toHaveProperty("name");
    expect(racers[0]).toHaveProperty("condition");
    expect(racers[0]).toHaveProperty("color");
  });

  it("initializes races correctly", () => {
    store.dispatch("raceStore/initRacers");
    store.dispatch("raceStore/initRaces");

    const races = store.getters["raceStore/getRaces"];
    expect(races).toHaveLength(RACE_DISTANCES.length);
    expect(races[0].racers).toHaveLength(RACERS_PER_RACE);
    expect(races[0]).toHaveProperty("distance");
    expect(races[0].racers[0]).toHaveProperty("progress");
  });

  it("generates racers with correct properties", () => {
    store.dispatch("raceStore/initRacers");
    const racers = store.getters["raceStore/getRacers"];

    racers.forEach((racer, index) => {
      expect(racer.id).toBe(index + 1);
      expect(racer.name).toBe(`Horse ${index + 1}`);
      expect(racer.condition).toBeGreaterThanOrEqual(1);
      expect(racer.condition).toBeLessThanOrEqual(100);
      expect(racer.color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it("initializes races with correct distances", () => {
    store.dispatch("raceStore/initRacers");
    store.dispatch("raceStore/initRaces");

    const races = store.getters["raceStore/getRaces"];
    races.forEach((race, index) => {
      expect(race.distance).toBe(RACE_DISTANCES[index]);
      expect(race.id).toBe(index + 1);
    });
  });

  it("toggles pause state", () => {
    expect(store.state.raceStore.racePaused).toBe(false);
    store.commit("raceStore/TOGGLE_PAUSE");
    expect(store.state.raceStore.racePaused).toBe(true);
    store.commit("raceStore/TOGGLE_PAUSE", false);
    expect(store.state.raceStore.racePaused).toBe(false);
  });

  it("updates racer progress", () => {
    store.dispatch("raceStore/initRacers");
    store.dispatch("raceStore/initRaces");

    const raceId = 1;
    const racerId = store.state.raceStore.races[0].racers[0].id;

    store.commit("raceStore/UPDATE_RACER_PROGRESS", {
      raceId,
      racerId,
      progress: 50,
    });

    const updated = store.state.raceStore.races[0].racers.find(
      (r) => r.id === racerId,
    );
    expect(updated.progress).toBe(50);
  });

  it("sets correct score (finish order) when racers finish", () => {
    store.dispatch("raceStore/initRacers");
    store.dispatch("raceStore/initRaces");

    const race = store.state.raceStore.races[0];

    race.racers.forEach((racer, index) => {
      racer.progress = 100;
      racer.finishOrder = index + 1;
    });

    store.commit("raceStore/FINALIZE_RACE", race.id);

    const scores = race.racers.map((r) => r.score);

    expect(new Set(scores).size).toBe(race.racers.length);
    expect(Math.min(...scores)).toBe(1);
    expect(Math.max(...scores)).toBe(race.racers.length);
  });

  it("sets racer finish order correctly", () => {
    store.dispatch("raceStore/initRacers");
    store.dispatch("raceStore/initRaces");

    const raceId = 1;
    const racerId = store.state.raceStore.races[0].racers[0].id;

    store.commit("raceStore/SET_RACER_FINISH_ORDER", {
      raceId,
      racerId,
      finishOrder: 1,
    });

    const updated = store.state.raceStore.races[0].racers.find(
      (r) => r.id === racerId,
    );
    expect(updated.finishOrder).toBe(1);
  });

  it("runSingleRace dispatches raceSimulationService.run", async () => {
    const { raceSimulationService } =
      await import("../../utils/raceSimulationService");

    raceSimulationService.run.mockResolvedValue({
      progress: [],
      finishedRacers: [],
      isFinished: true,
    });

    store.dispatch("raceStore/initRacers");
    store.dispatch("raceStore/initRaces");

    const race = store.getters["raceStore/getRaces"][0];
    await store.dispatch("raceStore/runSingleRace", race);

    expect(raceSimulationService.run).toHaveBeenCalledWith(
      expect.objectContaining({
        race: expect.objectContaining({ id: race.id }),
        paused: expect.any(Function),
        tickInterval: expect.any(Number),
        onProgress: expect.any(Function),
      }),
    );
  });

  it("runSingleRace handles missing race", async () => {
    const result = await store.dispatch("raceStore/runSingleRace", null);
    expect(result).toBeUndefined();
  });
});
