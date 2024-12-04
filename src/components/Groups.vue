<template>
  <div id="groups" class="groups" ref="root">
    <TransitionGroup>
      <Group
        v-if="groups"
        ref="group"
        v-for="(group, groupKey) in groups"
        v-model="groups[groupKey]"
      ></Group>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import Group from '@/components/Group.vue'
import { useGroupsStore } from '@/stores/groups'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'

const root = useTemplateRef('root')

const groupsStore = useGroupsStore()

const { groups } = storeToRefs(groupsStore)

// I ended up handling the filtering in the store
// const filteredGroups = computed(() =>
//   Object.values(groups.value).reduce(
//     (acc: Record<string, Group>, group: Group) => {
//       if (group.items.length > 0) {
//         acc[group.name] = group
//       }
//       return acc
//     },
//     {} as Record<string, Group>,
//   ),
// )
</script>

<style lang="css" scoped>
.groups {
  display: flex;
  align-items: flex-start;
  margin: 0 -10px;
  max-width: 1280px;
}

.group {
  margin: 0 10px;
}

/* TODO: fade in the groups */
</style>
