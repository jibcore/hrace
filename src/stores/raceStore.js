import { generateRacers } from "../utils/helpers";
import {
  RACE_DISTANCES,
  RACERS_PER_RACE,
  TOTAL_RACERS_AVAILABLE,
  TICK_INTERVAL_MS,
} from "../constants/raceConstants";
import { raceSimulationService } from "../utils/raceSimulationService";

const state = () => ({
  racers: [],
  races: [],
  currentRaceId: 0,
  isRaceRunning: false,
  racePaused: false,
});

const mutations = {
  SET_RACERS(state, racers) {
    state.racers = racers;
  },
  SET_RACES(state, races) {
    state.races = races;
  },
  SET_CURRENT_RACE(state, raceId) {
    state.currentRaceId = raceId;
  },
  SET_RACE_RUNNING(state, value) {
    state.isRaceRunning = value;
  },
  TOGGLE_PAUSE(state, value) {
    state.racePaused = value ?? !state.racePaused;
  },
  UPDATE_RACER_PROGRESS(state, { raceId, racerId, progress }) {
    const race = state.races.find((r) => r.id === raceId);
    const racer = race?.racers.find((r) => r.id === racerId);

    if (racer) {
      racer.progress = progress;
    }
  },
  SET_RACER_FINISH_ORDER(state, { raceId, racerId, finishOrder }) {
    const race = state.races.find((r) => r.id === raceId);
    const racer = race?.racers.find((r) => r.id === racerId);

    if (racer && racer.finishOrder === null) {
      racer.finishOrder = finishOrder;
    }
  },
  FINALIZE_RACE(state, raceId) {
    const race = state.races.find((r) => r.id === raceId);
    if (!race) {
      return;
    }

    const sortedRacers = [...race.racers].sort(
      (a, b) => a.finishOrder - b.finishOrder,
    );

    sortedRacers.forEach((sortedRacer, index) => {
      const originalRacer = race.racers.find((r) => r.id === sortedRacer.id);
      if (originalRacer) {
        originalRacer.score = index + 1;
      }
    });
  },
};

const actions = {
  initRacers({ commit }) {
    commit("SET_RACERS", generateRacers(TOTAL_RACERS_AVAILABLE));
  },

  initRaces({ state, commit }) {
    if (!state.racers.length) {
      return;
    }

    const races = RACE_DISTANCES.map((distance, raceIndex) => {
      const shuffledRacers = [...state.racers].sort(() => Math.random() - 0.5);
      const selectedRacers = shuffledRacers.slice(0, RACERS_PER_RACE);

      const raceRacers = selectedRacers.map((racer, idx) => ({
        id: racer.id,
        position: idx + 1,
        progress: 0,
        score: 0,
        finishOrder: null,
      }));

      return {
        id: raceIndex + 1,
        racers: raceRacers,
        distance,
      };
    });

    raceSimulationService.clear();
    commit("SET_RACE_RUNNING", false);
    commit("SET_RACES", races);
    commit("SET_CURRENT_RACE", 0);
  },

  toggleRace({ state, commit, dispatch }) {
    if (!state.isRaceRunning) {
      commit("TOGGLE_PAUSE", false);
      dispatch("startRaceSeries");
    } else {
      commit("TOGGLE_PAUSE");
    }
  },

  stopRace({ commit }) {
    raceSimulationService.clear();
    commit("SET_RACE_RUNNING", false);
    commit("TOGGLE_PAUSE", false);
  },

  async startRaceSeries({ state, commit, dispatch }) {
    if (state.isRaceRunning) {
      return;
    }

    commit("SET_RACE_RUNNING", true);

    for (let i = state.currentRaceId; i < state.races.length; i++) {
      commit("SET_CURRENT_RACE", i);
      await dispatch("runSingleRace", state.races[i]);
    }

    commit("SET_RACE_RUNNING", false);
    commit("TOGGLE_PAUSE", false);
  },

  runSingleRace({ state, commit }, race) {
    if (!race) {
      return Promise.resolve();
    }

    return raceSimulationService.run({
      racers: state.racers,
      race,
      paused: () => state.racePaused,
      tickInterval: TICK_INTERVAL_MS,
      onProgress: (result) => {
        // Update progress for each racer in real-time
        result.progress.forEach(({ racerId, progress }) => {
          commit("UPDATE_RACER_PROGRESS", {
            raceId: race.id,
            racerId,
            progress,
          });
        });

        // Set finish order for racers as they finish
        result.finishedRacers.forEach(({ racerId, finishOrder }) => {
          commit("SET_RACER_FINISH_ORDER", {
            raceId: race.id,
            racerId,
            finishOrder,
          });
        });

        // Finalize race when all done
        if (result.isFinished) {
          commit("FINALIZE_RACE", race.id);
        }
      },
    });
  },
};

const getters = {
  getCurrentRace: (state, getters) =>
    getters.getRaces[state.currentRaceId] || null,
  getRacers: (state) => state.racers,
  isRaceRunning: (state) => state.isRaceRunning,
  racePaused: (state) => state.racePaused,
  getRaces: (state) => {
    const racerMap = new Map(state.racers.map((h) => [h.id, h]));

    return state.races.map((race) => ({
      ...race,
      racers: race.racers.map((racer) => ({
        ...racer,
        ...(racerMap.get(racer.id) || {}),
      })),
    }));
  },
  getCompletedRaces: (state, getters) => {
    return getters.getRaces.filter((race) => {
      // A race is completed when all racers have a score > 0
      return race.racers.every((racer) => racer.score > 0);
    });
  },
  getRaceResults: (state, getters) => {
    // Get races that have started (current race and previous completed ones)
    const startedRaces = getters.getRaces.filter(
      (race, index) => index <= state.currentRaceId,
    );

    return startedRaces.map((race) => {
      const isRaceCompleted = race.racers.every((racer) => racer.score > 0);
      const sortedRacers = [...race.racers].sort((a, b) => {
        if (isRaceCompleted) {
          // After race completes: sort by score (ascending - winner first)
          return a.score - b.score;
        } else {
          // During race: sort by progress (descending - who is ahead)
          return b.progress - a.progress;
        }
      });

      return {
        ...race,
        racers: sortedRacers,
      };
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
