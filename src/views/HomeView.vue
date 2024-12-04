<template>
  <main :class="{ blur: !showGroups }">
    <FileDrop :class="{ hide: showGroups }"></FileDrop>
    <Groups v-if="showGroups" />
  </main>
</template>

<script setup lang="ts">
import FileDrop from '@/components/FileDrop.vue'
import Groups from '@/components/Groups.vue'

import { useGroupsStore } from '@/stores/groups'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const groupsStore = useGroupsStore()

const { groups } = storeToRefs(groupsStore)

const showGroups = computed(() => !!Object.keys(groups.value || {}).length)
</script>

<style>
main {
  display: flex;
  margin-top: 100px;
  position: relative;
}

main.blur:before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: grey;
}

.file-drop-container {
  transition: transform 0.3s;
  transform: translate(0, 0);
  z-index: 1000;
  bottom: 0;
}

.file-drop-container:hover {
  /* transform: translate(0, 0); */
}

.file-drop-container.hide:not(:hover) {
  transform: translate(0, 75%);
}
</style>
