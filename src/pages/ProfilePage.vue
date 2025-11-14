<template>
  <div class="profile-container">
    <h2>個人資料管理</h2>

    <p><strong>帳號 (學號)：</strong>{{ userData.username }}</p>

    <label>姓名：</label>
    <input v-model="userData.name" />

    <label>位置：</label>
    <input v-model="userData.position" />

    <p><strong>出席次數：</strong>{{ attendanceCount }}</p>

    <button @click="saveProfile">💾 儲存資料</button>

    <h3>🔒 修改密碼</h3>
    <input v-model="oldPassword" type="password" placeholder="舊密碼" />
    <input v-model="newPassword" type="password" placeholder="新密碼" />
    <button @click="changePassword">修改密碼</button>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loggedInUser = localStorage.getItem('loggedInUser')

const userData = ref({ username: '', password: '', name: '', position: '未設定' })
const attendanceRecords = ref([])
const message = ref('')

// 修改密碼欄位
const oldPassword = ref('')
const newPassword = ref('')

// 讀取使用者資料
onMounted(() => {
  if (loggedInUser) {
    const saved = localStorage.getItem(loggedInUser)
    if (saved) {
      userData.value = JSON.parse(saved)
    } else {
      userData.value = {
        username: loggedInUser,
        password: '未設定',
        name: loggedInUser,
        position: '未設定'
      }
    }
  }

  const stored = localStorage.getItem('attendanceRecords')
  if (stored) attendanceRecords.value = JSON.parse(stored)
})

// 個人出席次數
const attendanceCount = computed(() => {
  return attendanceRecords.value.filter(r => r.username === loggedInUser).length
})

// 儲存姓名/位置
const saveProfile = () => {
  localStorage.setItem(loggedInUser, JSON.stringify(userData.value))
  message.value = '✅ 個人資料已儲存'
  setTimeout(() => message.value = '', 1500)
}

// 修改密碼
const changePassword = () => {
  if (oldPassword.value !== userData.value.password) {
    message.value = '❌ 舊密碼錯誤'
    return
  }
  if (newPassword.value.trim() === '') {
    message.value = '❌ 新密碼不能為空'
    return
  }

  userData.value.password = newPassword.value
  localStorage.setItem(loggedInUser, JSON.stringify(userData.value))
  message.value = '✅ 密碼修改成功'
  oldPassword.value = ''
  newPassword.value = ''
}
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

p {
  margin: 8px 0;
  font-size: 16px;
}

label {
  margin-top: 10px;
}

input {
  padding: 6px;
  margin-bottom: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  margin-top: 10px;
  padding: 8px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #36996e;
}
</style>
