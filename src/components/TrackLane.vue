<template>
  <div class="track-lane">
    <div class="track-lane__position" :style="positionStyle">
      {{ racer.position }}
    </div>

    <div class="track-lane__track">
      <div class="track-lane__racer-icon" :style="racerStyles">🐎</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrackLane",
  props: {
    racer: { type: Object, required: true },
  },
  computed: {
    positionStyle() {
      return {
        "background-color": this.racer.color,
      };
    },
    racerStyles() {
      return {
        left: `${this.racer.progress}%`,
      };
    },
  },
};
</script>

<style scoped>
.track-lane {
  display: grid;
  grid-template-columns: 10% auto;
}

.track-lane__position {
  display: flex;
  height: 100%;
  font-weight: bold;
  align-items: center;
  justify-content: center;
}

.track-lane__track {
  position: relative;
  height: 50px;
  background: repeating-linear-gradient(
    45deg,
    #eee,
    #eee 10px,
    #ddd 10px,
    #ddd 20px
  );
}

.track-lane__racer-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  transition: left 0.2s linear;
}
</style>
