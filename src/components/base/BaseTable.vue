<template>
  <div class="base-table">
    <table class="base-table__table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="base-table__header-cell"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx" class="base-table__data-row">
          <td
            v-for="col in columns"
            :key="col.key"
            class="base-table__data-cell"
          >
            <slot
              :name="`cell-${col.key}`"
              :value="row[col.key]"
              :row="row"
              :index="idx"
            >
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.base-table {
  height: 100%;
  overflow: auto;
}

.base-table__table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.base-table__header-cell {
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: 600;
  padding: 8px;
  border: 1px solid darkgrey;
  text-align: left;
  background-color: lightgrey;
}

.base-table__data-row {
  background-color: white;
}

.base-table__data-cell {
  padding: 8px;
  border: 1px solid #eee;
}
</style>
