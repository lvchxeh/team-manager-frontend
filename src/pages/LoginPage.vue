<template>
  <div class="login-container">
    <h2>{{ isRegister ? '註冊帳號' : '登入系統' }}</h2>

    <input v-model="username" placeholder="帳號（學號）" />
    <input v-model="password" type="password" placeholder="密碼" />

    <button @click="isRegister ? register() : login()">
      {{ isRegister ? '註冊' : '登入' }}
    </button>

    <p>{{ message }}</p>

    <button class="toggle-btn" @click="toggleMode">
      {{ isRegister ? '返回登入' : '沒有帳號？註冊新帳號' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const message = ref('')
const isRegister = ref(false)
const router = useRouter()

// 登入
const login = () => {
  const savedUser = localStorage.getItem(username.value)
  if (!savedUser) {
    message.value = '❌ 帳號不存在，請先註冊。'
    return
  }

  const userData = JSON.parse(savedUser)
  if (userData.password === password.value) {
    message.value = `✅ 登入成功！歡迎 ${username.value}`
    localStorage.setItem('loggedInUser', username.value)
    setTimeout(() => router.push('/members'), 800)
  } else {
    message.value = '❌ 密碼錯誤。'
  }
}

// 註冊
const register = () => {
  if (localStorage.getItem(username.value)) {
    message.value = '⚠️ 帳號已存在。'
    return
  }
  const userData = { username: username.value, password: password.value }
  localStorage.setItem(username.value, JSON.stringify(userData))
  message.value = '✅ 註冊成功，請登入。'
  isRegister.value = false
  username.value = ''
  password.value = ''
}

// 切換登入/註冊
const toggleMode = () => {
  isRegister.value = !isRegister.value
  message.value = ''
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 60px auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

input {
  margin: 5px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.toggle-btn {
  background-color: transparent;
  color: #007bff;
  text-decoration: underline;
  margin-top: 10px;
}

p {
  color: #333;
  margin-top: 10px;
}
</style>
