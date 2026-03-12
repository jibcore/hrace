<template>
  <div class="racers-table">
    <div class="racers-table__title">Racers List 1 - {{ racers.length }}</div>
    <BaseTable :columns="COLUMNS" :rows="racers">
      <template #cell-color="{ value }">
        <div
          class="racers-table__color-cell"
          :style="{ backgroundColor: value }"
        />
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "./base/BaseTable.vue";

const COLUMNS = [
  { key: "name", label: "Horse Name" },
  { key: "condition", label: "Condition" },
  { key: "color", label: "Color" },
];

export default {
  name: "RacersTable",
  components: {
    BaseTable,
  },
  props: {
    racers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      COLUMNS,
    };
  },
};
</script>

<style scoped>
.racers-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow: hidden;
}
.racers-table__title {
  background-color: darkgoldenrod;
  font-size: 20px;
  padding: 10px;
}

.racers-table__color-cell {
  width: 100%;
  height: 20px;
}
</style>
