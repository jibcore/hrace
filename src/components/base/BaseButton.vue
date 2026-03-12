<template>
  <button class="base-button" v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  inheritAttrs: false,
};
</script>

<style scoped>
.base-button {
  background-color: lightgray;
  border: none;
  border-radius: 2px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
}

.base-button:active {
  background-color: gray;
}
</style>
