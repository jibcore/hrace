<template>
  <div class="race-result">
    <div class="race-result__title">
      #{{ race.id }} Race - {{ race.distance }}m
    </div>
    <BaseTable :columns="columns" :rows="race.racers">
      <template #cell-color="{ value }">
        <div
          class="race-result__color-cell"
          :style="{ backgroundColor: value }"
        />
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "./base/BaseTable.vue";

const COLUMNS = [
  { key: "position", label: "Position" },
  { key: "name", label: "Name" },
  { key: "score", label: "Score" },
  { key: "color", label: "Color" },
];

export default {
  name: "RaceResult",
  components: {
    BaseTable,
  },
  props: {
    race: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      columns: COLUMNS,
    };
  },
};
</script>

<style scoped>
.race-result {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.race-result__title {
  padding: 8px;
  font-weight: bold;
  background-color: chocolate;
  text-align: center;
}

.race-result__color-cell {
  width: 100%;
  height: 10px;
}
</style>
