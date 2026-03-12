<template>
  <section class="race-track">
    <span class="race-track__title">
      Race #{{ race.id }}, Distance: {{ race.distance }}m
    </span>
    <div class="race-track__lanes-list">
      <TrackLane v-for="racer in race.racers" :key="racer.id" :racer="racer" />
    </div>
  </section>
</template>

<script>
import TrackLane from "./TrackLane.vue";

export default {
  name: "RaceTrack",
  components: { TrackLane },
  props: {
    race: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.race-track {
  display: grid;
  gap: 20px;
  align-content: baseline;
  overflow-y: auto;
  overflow-x: hidden;
}

.race-track__title {
  font-size: 25px;
  color: red;
  font-weight: bold;
  justify-self: center;
}

.race-track__lanes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
