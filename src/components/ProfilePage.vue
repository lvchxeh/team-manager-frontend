<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-sm space-y-8">
      
      <!-- Profile Edit Section -->
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">個人資料管理</h2>
        <div class="space-y-5">
          
          <!-- Read-only Fields -->
          <div class="grid grid-cols-1 gap-1">
             <label class="text-sm font-medium text-gray-500">學號</label>
             <div class="text-gray-800 text-lg font-medium">{{ userData.studentId }}</div>
          </div>

          <div>
             <label class="block text-gray-700 font-medium mb-2">姓名</label>
             <input 
               v-model="userData.name" 
               type="text"
               class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
             />
          </div>
          
          <div>
            <label class="block text-gray-700 font-medium mb-2">角色 :</label>
            <select v-model="userData.role" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>舉球員 (S)</option>
              <option>攔中手 (MB)</option>
              <option>主攻手 (OH)</option>
              <option>輔攻手 (OPP)</option>
              <option>自由球員 (L)</option>
              <option>未設定</option>
            </select>
          </div>

          <!-- Save Button -->
          <button 
            @click="saveProfile"
            class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded flex items-center justify-center space-x-2 font-medium mt-4 w-full sm:w-auto transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            <span>儲存資料</span>
          </button>
        </div>
      </div>

      <!-- Password Change Section -->
      <div class="pt-6 border-t border-gray-100">
         <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
           修改密碼
         </h3>
         <div class="space-y-4">
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">舊密碼</label>
             <input v-model="oldPassword" type="password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">新密碼</label>
             <input v-model="newPassword" type="password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
           </div>
           <button 
             @click="changePassword"
             class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-medium mt-2 w-full shadow-sm transition-colors"
           >
             修改密碼
           </button>
           
           <p v-if="message" :class="['text-center text-sm mt-2', isError ? 'text-red-500' : 'text-emerald-600']">
             {{ message }}
           </p>
         </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loggedInUser = localStorage.getItem('loggedInUser')
const userData = ref({ studentId: '', password: '', name: '', role: '未設定' })
const message = ref('')
const isError = ref(false)
const oldPassword = ref('')
const newPassword = ref('')

onMounted(() => {
  if (loggedInUser) {
    // 1. Load ALL members
    const allMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]')
    
    // 2. Find CURRENT user in the list
    const currentUserData = allMembers.find(m => m.studentId === loggedInUser)

    if (currentUserData) {
      userData.value = { ...currentUserData }
    } else {
      // Fallback if not found in main list (e.g. direct register via Login Page)
      const saved = localStorage.getItem(loggedInUser)
      if(saved) {
         const parsed = JSON.parse(saved)
         // Map old format to new format if needed
         userData.value = { 
           studentId: parsed.username || loggedInUser, 
           name: parsed.name || loggedInUser, 
           role: parsed.role || '未設定',
           password: parsed.password
         }
      } else {
         userData.value = { studentId: loggedInUser, password: '...', name: loggedInUser, role: '未設定' }
      }
    }
  }
})

const saveToAllStorage = () => {
  // 1. Load list
  const members = JSON.parse(localStorage.getItem('teamMembers') || '[]')
  
  // 2. Find index
  const index = members.findIndex(m => m.studentId === loggedInUser)
  
  if (index !== -1) {
     // Update existing in list
     members[index] = { ...members[index], ...userData.value }
  } else {
     // Add if missing (edge case)
     members.push({ ...userData.value, id: Date.now() })
  }

  // 3. Save list
  localStorage.setItem('teamMembers', JSON.stringify(members))

  // 4. SYNC: Also update individual key for Login Page
  const loginData = {
    username: userData.value.studentId,
    password: userData.value.password,
    name: userData.value.name,
    role: userData.value.role
  }
  localStorage.setItem(loggedInUser, JSON.stringify(loginData))
}

const saveProfile = () => {
  saveToAllStorage()
  isError.value = false
  message.value = '✅ 個人資料已儲存 (同步更新至隊員列表)'
  setTimeout(() => message.value = '', 2000)
}

const changePassword = () => {
  if (oldPassword.value !== userData.value.password) {
    isError.value = true
    message.value = '❌ 舊密碼錯誤'
    return
  }
  if (!newPassword.value) {
    isError.value = true
    message.value = '❌ 新密碼不能為空'
    return
  }

  userData.value.password = newPassword.value
  saveToAllStorage()
  
  isError.value = false
  message.value = '✅ 密碼修改成功'
  oldPassword.value = ''
  newPassword.value = ''
  setTimeout(() => message.value = '', 2000)
}
</script>