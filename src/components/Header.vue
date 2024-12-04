<template>
  <header class="header">
    <img src="@/assets/logo-white.svg" alt="Logo" class="logo" />
  </header>
</template>

<style scoped>
.header {
  background-color: #9f1ef6;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.logo {
  height: 40px;
}
</style>
