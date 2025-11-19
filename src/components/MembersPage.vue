<template>
  <div class="max-w-6xl mx-auto space-y-6">
    
    <!-- Add Button -->
    <div class="bg-white p-4 rounded shadow-sm flex justify-start">
      <button 
        @click="openAddModal"
        class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center space-x-2 font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>新增隊員</span>
      </button>
    </div>

    <!-- Members Table -->
    <div class="bg-white rounded shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">隊員列表</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th class="px-6 py-4 font-medium">學號</th>
              <th class="px-6 py-4 font-medium">姓名</th>
              <th class="px-6 py-4 font-medium">角色</th>
              <th class="px-6 py-4 font-medium text-center">密碼</th>
              <th class="px-6 py-4 font-medium text-center">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
            <tr v-for="member in members" :key="member.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">{{ member.studentId }}</td>
              <td class="px-6 py-4">{{ member.name }}</td>
              <td class="px-6 py-4">{{ member.role }}</td>
              
              <!-- Password Column -->
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <span class="font-mono w-20 text-right">
                    {{ visiblePasswords[member.id] ? member.password : '••••••' }}
                  </span>
                  <button @click="togglePassword(member.id)" class="text-gray-400 hover:text-gray-600">
                    <svg v-if="visiblePasswords[member.id]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 flex justify-center space-x-3">
                <button @click="openEditModal(member)" class="text-blue-500 hover:text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button @click="deleteMember(member.id)" class="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">
            {{ isEdit ? '編輯隊員' : '新增隊員' }}
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">學號</label>
            <input v-model="formData.studentId" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input v-model="formData.name" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select v-model="formData.role" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input v-model="formData.password" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
          <button @click="saveMember" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-medium shadow-sm">
            儲存
          </button>
          <button @click="showModal = false" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-medium shadow-sm">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// State
const members = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const visiblePasswords = reactive({})

// Available Roles
const roles = [
  '舉球員 (S)', 
  '攔中手 (MB)', 
  '主攻手 (OH)', 
  '輔攻手 (OPP)', 
  '自由球員 (L)',
  '未設定'
]

// Form Data Structure
const formData = reactive({
  id: null,
  studentId: '',
  name: '',
  role: '未設定',
  password: ''
})

// 1. Load Data on Start
onMounted(() => {
  const stored = localStorage.getItem('teamMembers')
  if (stored) {
    members.value = JSON.parse(stored)
  } else {
    // Default Mock Data
    members.value = [
      { id: 1, studentId: '123', name: '52', role: '攔中手 (MB)', password: 'pass1' },
      { id: 2, studentId: '1', name: '1', role: '舉球員 (S)', password: 'pass2' },
      { id: 3, studentId: '2', name: '2', role: '主攻手 (OH)', password: 'pass3' },
      { id: 4, studentId: '3', name: '3', role: '自由球員 (L)', password: 'pass4' },
      { id: 5, studentId: '4', name: '4', role: '輔攻手 (OPP)', password: 'pass5' },
    ]
    saveToStorage()
  }
})

// Helper: Save to LocalStorage
const saveToStorage = () => {
  localStorage.setItem('teamMembers', JSON.stringify(members.value))
}

// 2. Toggle Password Visibility
const togglePassword = (id) => {
  visiblePasswords[id] = !visiblePasswords[id]
}

// 3. Open Modal for Adding
const openAddModal = () => {
  isEdit.value = false
  // Reset Form
  Object.assign(formData, {
    id: Date.now(),
    studentId: '',
    name: '',
    role: '未設定',
    password: ''
  })
  showModal.value = true
}

// 4. Open Modal for Editing
const openEditModal = (member) => {
  isEdit.value = true
  // Copy member data to form
  Object.assign(formData, { ...member })
  showModal.value = true
}

// 5. Save (Add or Update)
const saveMember = () => {
  if (!formData.studentId || !formData.name) {
    alert("請填寫完整資料")
    return
  }

  if (isEdit.value) {
    // Update existing
    const index = members.value.findIndex(m => m.id === formData.id)
    if (index !== -1) {
      members.value[index] = { ...formData }
    }
  } else {
    // Add new
    members.value.push({ ...formData })
  }

  saveToStorage()
  showModal.value = false
}

// 6. Delete Member
const deleteMember = (id) => {
  if (confirm("確定要刪除這位隊員嗎？")) {
    members.value = members.value.filter(m => m.id !== id)
    saveToStorage()
  }
}
</script>