<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    
    <!-- Header (Simple version for Login) -->
    <div class="bg-blue-600 text-white p-4 shadow-md flex items-center space-x-3">
      <div class="bg-white text-blue-600 p-1.5 rounded-full">
        <!-- UPDATED: Volleyball/Ball Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"></path>
          <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"></path>
        </svg>
      </div>
      <span class="text-xl font-bold">球隊管理系統</span>
    </div>

    <!-- Login Form Card -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">
          {{ isRegister ? '註冊帳號' : '登入系統' }}
        </h2>
        
        <form @submit.prevent="isRegister ? register() : login()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">學號</label>
            <input 
              v-model="username"
              type="text" 
              placeholder="輸入學號"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input 
              v-model="password"
              type="password" 
              placeholder="輸入密碼"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-bold shadow-sm"
          >
            {{ isRegister ? '註冊' : '登入' }}
          </button>

          <!-- Message Display -->
          <div v-if="message" :class="['text-center text-sm font-medium', messageColor]">
            {{ message }}
          </div>

          <div class="text-center text-sm text-gray-500 mt-4">
            <button type="button" @click="toggleMode" class="text-blue-500 hover:underline hover:text-blue-700">
              {{ isRegister ? '返回登入' : '沒有帳號? 註冊新帳號' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['login-success'])

const username = ref('')
const password = ref('')
const message = ref('')
const isRegister = ref(false)
const isError = ref(false)

const messageColor = computed(() => isError.value ? 'text-red-500' : 'text-emerald-500')

const login = () => {
  const savedUser = localStorage.getItem(username.value)
  if (!savedUser) {
    isError.value = true
    message.value = '❌ 帳號不存在'
    return
  }

  const userData = JSON.parse(savedUser)
  if (userData.password === password.value) {
    isError.value = false
    message.value = '✅ 登入成功!'
    localStorage.setItem('loggedInUser', username.value)
    setTimeout(() => emit('login-success'), 800)
  } else {
    isError.value = true
    message.value = '❌ 密碼錯誤'
  }
}

const register = () => {
  if (!username.value || !password.value) {
    isError.value = true
    message.value = '請填寫完整資訊'
    return
  }
  if (localStorage.getItem(username.value)) {
    isError.value = true
    message.value = '⚠️ 帳號已存在'
    return
  }
  
  const userData = { 
    username: username.value, 
    password: password.value,
    name: username.value, // Default name
    role: '未設定'
  }
  localStorage.setItem(username.value, JSON.stringify(userData))
  
  isError.value = false
  message.value = '✅ 註冊成功，請登入'
  isRegister.value = false
  password.value = ''
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
  message.value = ''
  isError.value = false
}
</script>