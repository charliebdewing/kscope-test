<template>
  <div class="file-drop-container">
    <h2>Upload Files</h2>
    <div class="input-row">
      <div class="file-input">
        <label for="employeeFile">Employee File (CSV/JSON)</label>
        <input
          type="file"
          id="employeeFile"
          accept=".csv, .json"
          @change="handleFileChange('employee', $event)"
        />
        <!-- Couldn't get this working -->
        <!-- <div class="drop-zone" @drop.prevent="handleDrop('employee', $event)" @dragover.prevent>
        Drop Employee File Here
      </div> -->
      </div>
      <div class="file-input">
        <label for="groupFile">Team File (CSV/JSON)</label>
        <input
          type="file"
          id="groupFile"
          accept=".csv, .json"
          @change="handleFileChange('group', $event)"
        />
        <!-- Couldn't get this working -->
        <!-- <div class="drop-zone" @drop.prevent="handleDrop('group', $event)" @dragover.prevent>
        Drop Group File Here
      </div> -->
      </div>

      <button class="groups-button" role="button" :disabled="!filesReady" @click="showGroups">
        <span class="text">Show Groups</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupsStore } from '@/stores/groups'

const employeeFile = ref<File | null>(null)
const groupFile = ref<File | null>(null)
const groupsStore = useGroupsStore()
import { storeToRefs } from 'pinia'

const { groups } = storeToRefs(groupsStore)

const filesReady = computed(() => employeeFile.value && groupFile.value)

function handleFileChange(type: string, event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  if (type === 'employee') {
    employeeFile.value = file
  } else if (type === 'group') {
    groupFile.value = file
  }
}

// TODO: Implement drag and drop
// function handleDrop(type: string, event: DragEvent) {
//   const file = event.dataTransfer?.files[0] || null
//   if (type === 'employee') {
//     employeeFile.value = file
//   } else if (type === 'group') {
//     groupFile.value = file
//   }
// }

function showGroups() {
  if (employeeFile.value && groupFile.value) {
    groupsStore.updateGroups(employeeFile.value, groupFile.value)
  }
}
</script>

<style scoped>
.file-drop-container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f8f9fa;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
}

.input-row {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 3rem;
}

.file-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drop-zone {
  border: 2px dashed #ccc;
  padding: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* CSS */
.groups-button {
  align-items: center;
  background-image: linear-gradient(135deg, #f34079 40%, #fc894d);
  border: 0;
  border-radius: 10px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: 'Codec cold', sans-serif;
  font-size: 16px;
  font-weight: 700;
  height: 54px;
  justify-content: center;
  letter-spacing: 0.4px;
  line-height: 1;
  max-width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.groups-button:active {
  outline: 0;
}

.groups-button:hover {
  outline: 0;
}

.groups-button span {
  transition: all 200ms;
}

.groups-button:hover span {
  transform: scale(0.9);
  opacity: 0.75;
}

@media screen and (max-width: 991px) {
  .groups-button {
    font-size: 15px;
    height: 50px;
  }

  .groups-button span {
    line-height: 50px;
  }
}
</style>
