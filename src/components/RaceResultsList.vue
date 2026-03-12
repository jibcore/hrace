<template>
  <div class="race-results-list">
    <div class="race-results-list__title">Results</div>

    <RaceResult v-for="race in races" :key="race.id" :race="race" />
  </div>
</template>

<script>
import RaceResult from "./RaceResult.vue";

export default {
  name: "RaceResultsList",
  components: {
    RaceResult,
  },
  props: {
    races: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.race-results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  position: relative;
}

.race-results-list__title {
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: darkseagreen;
  font-size: 20px;
  padding: 10px;
}
</style>
