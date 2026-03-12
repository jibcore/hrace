const TICKS = 30;
const BASE_STEP = 100 / TICKS;
const MIN_SPEED_FACTOR = 0.5;
const RANDOM_SPEED_MIN = 0.9;
const RANDOM_SPEED_MAX = 1.15;

export const increaseProgress = (currentProgress, condition, maxCondition) => {
  const speedFactor = condition / maxCondition;
  const normalizedSpeed =
    MIN_SPEED_FACTOR + (1 - MIN_SPEED_FACTOR) * speedFactor;
  const randomMultiplier =
    Math.random() * (RANDOM_SPEED_MAX - RANDOM_SPEED_MIN) + RANDOM_SPEED_MIN;
  const inc = BASE_STEP * normalizedSpeed * randomMultiplier;

  return Math.min(currentProgress + inc, 100);
};
