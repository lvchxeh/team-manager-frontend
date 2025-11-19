<template>
  <!-- Matches screenshot: dg.png -->
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Left: Form (Add or Edit) -->
    <div class="bg-white p-6 rounded-lg shadow-sm h-fit">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isEditing ? '編輯活動' : '新增活動' }}
      </h2>
      
      <form class="space-y-5" @submit.prevent="submitForm">
        <!-- Radio Buttons -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">活動類型</label>
          <div class="flex space-x-6">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                value="練習" 
                v-model="formData.type"
                class="text-blue-600 focus:ring-blue-500 h-4 w-4" 
              />
              <span>練習</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                value="比賽" 
                v-model="formData.type"
                class="text-blue-600 focus:ring-blue-500 h-4 w-4" 
              />
              <span>比賽</span>
            </label>
          </div>
        </div>

        <!-- Inputs -->
        <div>
          <label class="block text-gray-700 mb-2">標題</label>
          <input v-model="formData.title" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        
        <div>
          <label class="block text-gray-700 mb-2">開始時間</label>
          <input v-model="formData.date" type="datetime-local" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>

        <div>
          <label class="block text-gray-700 mb-2">地點</label>
          <input v-model="formData.location" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>

        <!-- Opponent Field -->
        <div>
          <label class="block text-gray-700 mb-2">對手</label>
          <input 
            v-model="formData.opponent" 
            type="text" 
            :disabled="formData.type === '練習'"
            placeholder="僅比賽需填寫"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400" 
          />
        </div>

        <!-- Score Fields -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2">我方得分</label>
            <input 
              v-model="formData.scoreMe" 
              type="text" 
              :disabled="formData.type === '練習'"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-2">對方得分</label>
            <input 
              v-model="formData.scoreOpp" 
              type="text" 
              :disabled="formData.type === '練習'"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            />
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="pt-4 grid grid-cols-2 gap-4">
          <button type="submit" :class="isEditing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'" class="text-white py-2 rounded flex items-center justify-center font-medium">
            {{ isEditing ? '更新活動' : '儲存活動' }}
          </button>
          <button type="button" @click="resetForm" class="bg-gray-500 hover:bg-gray-600 text-white py-2 rounded font-medium">
            {{ isEditing ? '取消編輯' : '清除' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Right: List -->
    <div class="lg:col-span-2 bg-white rounded-lg shadow-sm h-fit">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">活動列表</h2>
      </div>
      <div class="p-4">
        <table class="w-full text-left text-sm">
          <thead class="text-gray-500 border-b border-gray-100">
            <tr>
              <th class="pb-4 font-medium w-16">類型</th>
              <th class="pb-4 font-medium">標題</th>
              <th class="pb-4 font-medium">時間</th>
              <th class="pb-4 font-medium">地點</th>
              <th class="pb-4 font-medium">對手/比分</th>
              <th class="pb-4 font-medium text-center">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-700">
            <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
              <td class="py-5 font-medium text-gray-900">{{ event.type }}</td>
              <td class="py-5 font-bold text-gray-800 text-base">{{ event.title }}</td>
              <td class="py-5 text-gray-500">{{ formatDate(event.date) }}</td>
              <td class="py-5 text-gray-500">{{ event.location }}</td>
              <td class="py-5 text-gray-500">
                <span v-if="event.type === '比賽'">
                  {{ event.opponent }} ({{ event.scoreMe }} - {{ event.scoreOpp }})
                </span>
                <span v-else>-</span>
              </td>
              <td class="py-5 flex justify-center space-x-2">
                 <!-- Attendance Button -->
                 <button @click="openAttendanceModal(event)" class="text-emerald-600 bg-emerald-50 p-2 rounded hover:bg-emerald-100" title="管理出席">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                 </button>
                 <!-- Edit Button -->
                 <button @click="editEvent(event)" class="text-blue-600 bg-blue-50 p-2 rounded hover:bg-blue-100" title="編輯">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                 </button>
                 <!-- Delete Button -->
                 <button @click="deleteEvent(event.id)" class="text-red-600 bg-red-50 p-2 rounded hover:bg-red-100" title="刪除">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                 </button>
              </td>
            </tr>
            <tr v-if="events.length === 0">
               <td colspan="6" class="py-6 text-center text-gray-400">目前沒有活動</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Attendance Modal -->
    <div v-if="showAttendanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div>
            <h3 class="text-xl font-bold text-gray-800">管理出席</h3>
            <p class="text-sm text-gray-500 mt-1">{{ currentEvent?.title }} ({{ formatDate(currentEvent?.date) }})</p>
          </div>
          <button @click="showAttendanceModal = false" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-x-auto">
          <table class="w-full">
            <thead class="text-left text-gray-500 text-sm border-b border-gray-100">
              <tr>
                <th class="pb-3 font-medium">學號</th>
                <th class="pb-3 font-medium">姓名</th>
                <th class="pb-3 font-medium pl-4">狀態</th>
                <th class="pb-3 font-medium">場上角色</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-for="member in members" :key="member.id" class="group hover:bg-gray-50">
                <td class="py-4 text-gray-700">{{ member.studentId }}</td>
                <td class="py-4 text-gray-700">{{ member.name }}</td>
                <td class="py-4">
                  <div class="flex items-center space-x-4 pl-4">
                    <label class="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="radio" 
                        :name="`status-${member.id}`" 
                        value="出席" 
                        v-model="attendanceBuffer[member.id].status"
                        class="text-emerald-500 focus:ring-emerald-500" 
                      />
                      <span class="text-emerald-600 font-medium">出席</span>
                    </label>
                    <label class="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="radio" 
                        :name="`status-${member.id}`" 
                        value="遲到" 
                        v-model="attendanceBuffer[member.id].status"
                        class="text-yellow-500 focus:ring-yellow-500" 
                      />
                      <span class="text-yellow-600 font-medium">遲到</span>
                    </label>
                    <label class="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="radio" 
                        :name="`status-${member.id}`" 
                        value="缺席" 
                        v-model="attendanceBuffer[member.id].status"
                        class="text-red-500 focus:ring-red-500" 
                      />
                      <span class="text-red-600 font-medium">缺席</span>
                    </label>
                  </div>
                </td>
                <td class="py-4">
                  <select 
                    v-model="attendanceBuffer[member.id].role"
                    class="border border-gray-300 rounded px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-40 bg-white"
                  >
                    <option value="未上場 (DNP)">未上場 (DNP)</option>
                    <option v-for="role in ROLES" :key="role" :value="role">{{ role }}</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
          <button @click="saveAttendance" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded flex items-center space-x-2 font-medium shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
             <span>儲存紀錄</span>
          </button>
          <button @click="showAttendanceModal = false" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-medium shadow-sm">
            取消
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Data
const events = ref([])
const members = ref([]) // Loaded from local storage
const isEditing = ref(false)
const editingId = ref(null)
const showAttendanceModal = ref(false)
const currentEvent = ref(null)
const attendanceBuffer = ref({}) // Temporary storage for modal inputs

// Roles Config
const ROLES = [
  '舉球員 (S)', 
  '攔中手 (MB)', 
  '主攻手 (OH)', 
  '輔攻手 (OPP)', 
  '自由球員 (L)'
]

// Form Data
const formData = reactive({
  type: '練習',
  title: '',
  date: '',
  location: '',
  opponent: '',
  scoreMe: '',
  scoreOpp: ''
})

onMounted(() => {
  loadEvents()
  loadMembers()
})

const loadEvents = () => {
  const stored = localStorage.getItem('teamEvents')
  if (stored) {
    events.value = JSON.parse(stored)
  } else {
    // Default Data
    events.value = [
      { id: 1, type: '練習', title: '發球練習', date: '2025-11-20T18:00', location: '體育館B', opponent: '', scoreMe: '', scoreOpp: '', attendance: {} },
      { id: 2, type: '比賽', title: '友誼賽 vs. 財金系', date: '2025-11-17T19:00', location: '校總區體育館', opponent: '財金系', scoreMe: '2', scoreOpp: '1', attendance: {} },
    ]
    saveToStorage()
  }
}

const loadMembers = () => {
  const storedMembers = localStorage.getItem('teamMembers')
  if (storedMembers) {
    members.value = JSON.parse(storedMembers)
  }
}

const saveToStorage = () => {
  localStorage.setItem('teamEvents', JSON.stringify(events.value))
}

// --- Form Logic (Add/Edit) ---

const submitForm = () => {
  if (!formData.title || !formData.date) {
    alert("請至少填寫標題與時間")
    return
  }

  if (isEditing.value) {
    // Update existing event
    const index = events.value.findIndex(e => e.id === editingId.value)
    if (index !== -1) {
      // Keep existing attendance data when updating
      const existingAttendance = events.value[index].attendance || {}
      events.value[index] = {
        id: editingId.value,
        ...formData,
        attendance: existingAttendance
      }
    }
  } else {
    // Create new event
    events.value.unshift({
      id: Date.now(),
      ...formData,
      attendance: {} // Init empty attendance
    })
  }
  
  saveToStorage()
  resetForm()
}

const editEvent = (event) => {
  isEditing.value = true
  editingId.value = event.id
  Object.assign(formData, {
    type: event.type,
    title: event.title,
    date: event.date,
    location: event.location,
    opponent: event.opponent,
    scoreMe: event.scoreMe,
    scoreOpp: event.scoreOpp
  })
}

const deleteEvent = (id) => {
  if(confirm('確定要刪除這個活動嗎?')) {
    events.value = events.value.filter(e => e.id !== id)
    saveToStorage()
    // If deleting the currently edited event, reset form
    if (isEditing.value && editingId.value === id) {
      resetForm()
    }
  }
}

const resetForm = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(formData, {
    type: '練習',
    title: '',
    date: '',
    location: '',
    opponent: '',
    scoreMe: '',
    scoreOpp: ''
  })
}

// --- Attendance Modal Logic ---

const openAttendanceModal = (event) => {
  currentEvent.value = event
  // Initialize buffer
  // If event has saved attendance, use it. Otherwise set defaults.
  const buffer = {}
  
  members.value.forEach(member => {
    if (event.attendance && event.attendance[member.id]) {
      // Load saved
      buffer[member.id] = { ...event.attendance[member.id] }
    } else {
      // Default
      buffer[member.id] = { status: '缺席', role: '未上場 (DNP)' }
    }
  })
  
  attendanceBuffer.value = buffer
  showAttendanceModal.value = true
}

const saveAttendance = () => {
  if (!currentEvent.value) return

  // Update the event in the main array
  const index = events.value.findIndex(e => e.id === currentEvent.value.id)
  if (index !== -1) {
    events.value[index].attendance = { ...attendanceBuffer.value }
    saveToStorage()
  }
  
  showAttendanceModal.value = false
}

// Helper to format date nicely
const formatDate = (dateString) => {
  if(!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>