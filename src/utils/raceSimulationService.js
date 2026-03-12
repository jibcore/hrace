import { increaseProgress } from "./progressHelper";

/**
 * Race simulation logic.
 */
class RaceSimulationService {
  constructor() {
    this._interval = null;
  }

  /**
   * Cancels any currently running race simulation.
   */
  clear() {
    if (this._interval !== null) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  /**
   * Runs a single race simulation, resolving the returned Promise when all racers have finished.
   *
   * @param {Object} options
   * @param {Array} options.racers - Array of racer objects with id, condition
   * @param {Object} options.race - Race object with id and racers array
   * @param {Function|boolean} options.paused - Either a boolean or a getter function that returns current paused state
   * @param {Function} options.onProgress - Callback called on each tick with progress data
   * @param {number} options.tickInterval - Interval in ms between ticks (default: 150)
   * @returns {Promise<{finishedRacers: Array, finalProgress: Array}>} - Results
   */
  run({ racers, race, paused, onProgress, tickInterval = 150 }) {
    return new Promise((resolve) => {
      // Map racers to their race-specific state (progress, finishOrder)
      const racersData = race.racers.map((racer) => {
        const racerInfo = racers.find((r) => r.id === racer.id);
        return {
          id: racer.id,
          progress: racer.progress ?? 0,
          condition: racerInfo?.condition ?? 0,
          finishOrder: null,
        };
      });

      const maxCondition = Math.max(...racersData.map((r) => r.condition)) || 1;

      const finishedRacers = [];

      const updateProgress = () => {
        // Check pause state - support both static boolean and getter function
        const isPaused = typeof paused === "function" ? paused() : paused;
        if (isPaused) {
          return null; // Skip this tick
        }

        racersData.forEach((racer) => {
          if (racer.progress >= 100) {
            return;
          }

          racer.progress = increaseProgress(
            racer.progress,
            racer.condition,
            maxCondition,
          );

          // Track finish order
          if (racer.progress >= 100) {
            finishedRacers.push({
              racerId: racer.id,
              finishOrder: finishedRacers.length + 1,
            });
          }
        });

        const result = {
          progress: racersData.map((r) => ({
            racerId: r.id,
            progress: r.progress,
          })),
          finishedRacers: [...finishedRacers],
          isFinished: racersData.every((r) => r.progress >= 100),
        };

        // Call progress callback if provided
        if (onProgress) {
          onProgress(result);
        }

        return result;
      };

      this.clear();

      this._interval = setInterval(() => {
        const result = updateProgress();

        if (result && result.isFinished) {
          this.clear();
          resolve(result);
        }
      }, tickInterval);

      // Initial progress update
      updateProgress();
    });
  }
}

export const raceSimulationService = new RaceSimulationService();
