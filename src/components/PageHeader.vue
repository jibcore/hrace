<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: tomato;
  padding: 16px;
}

.page-header__title {
  font-size: 24px;
  margin: 0;
}

.page-header__actions {
  display: flex;
  gap: 8px;
}
</style>
