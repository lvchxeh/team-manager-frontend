<template>
  <div id="app">
    <header class="app-header">
      <h1>🏐 球隊管理系統</h1>

      <!-- 導覽列：登入後才顯示 -->
      <nav v-if="loggedInUser">
      <router-link to="/members">隊員資料</router-link>
      <router-link to="/attendance">出席打卡</router-link>
      <router-link to="/stats">出席統計</router-link>
      <router-link to="/profile">個人資料</router-link>
      <button @click="logout">登出</button>
    </nav>

    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const loggedInUser = ref(localStorage.getItem('loggedInUser'))

// 監聽登入狀態
watchEffect(() => {
  loggedInUser.value = localStorage.getItem('loggedInUser')
})

// 登出功能
const logout = () => {
  localStorage.removeItem('loggedInUser')
  window.location.href = '/login'
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
}

nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

nav a {
  color: white;
  text-decoration: none;
}



button {
  background-color: white;
  color: #007bff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
