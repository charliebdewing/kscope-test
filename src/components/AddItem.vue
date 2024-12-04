<template>
  <!-- Id have liked to have made it disabled when adding new item -->
  <button @click="handleClick" class="add-button">
    <img src="@/assets/add-icon.svg" alt="Add Icon" />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['clicked'])

const handleClick = () => {
  emit('clicked')
}
</script>

<style scoped>
.add-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 56px;
  height: 56px;
  transition: transform 0.2s;
  z-index: 1;
}

.add-button:hover {
  transform: scale(1.1);
}

.add-button img {
  width: auto;
  height: 100%;
}
</style>
