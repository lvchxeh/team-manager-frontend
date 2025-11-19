<template>
  <!-- Matches screenshot: dfhhgh.png -->
  <div class="max-w-4xl mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-sm">
      
      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6">出席打卡</h2>
      
      <!-- Check-in Section -->
      <div class="mb-8">
        <button 
          @click="checkIn"
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded flex items-center space-x-2 text-lg font-bold transition-transform transform active:scale-95 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>打卡</span>
        </button>
        
        <!-- Success Message -->
        <div v-if="message" class="mt-4 text-emerald-600 flex items-center space-x-2 font-medium animate-fade-in">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
           <span>{{ message }}</span>
        </div>
      </div>

      <!-- Records Table -->
      <div>
        <h3 class="text-xl font-bold text-gray-800 mb-4">已打卡紀錄</h3>
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 font-medium">學號</th>
                <th class="px-6 py-3 font-medium">姓名</th>
                <th class="px-6 py-3 font-medium">日期時間</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="(record, index) in attendanceRecords" :key="index" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">{{ record.studentId }}</td>
                <td class="px-6 py-4">{{ record.name }}</td>
                <td class="px-6 py-4">{{ record.timestamp }}</td>
              </tr>
              <tr v-if="attendanceRecords.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-gray-400">目前尚無紀錄</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')
const attendanceRecords = ref([])
const currentUser = { studentId: '1', name: '1' } // Mock user

onMounted(() => {
  // Initialize with some mock data to match screenshot
  const stored = localStorage.getItem('attendanceRecords')
  if (stored) {
    attendanceRecords.value = JSON.parse(stored)
  } else {
    // Default data to look like screenshot
    attendanceRecords.value = [
        { studentId: '1', name: '1', timestamp: '2025/11/13 下午9:05:42' },
        { studentId: '1', name: '1', timestamp: '2025/11/13 下午9:05:41' },
    ]
  }
})

const checkIn = () => {
  const now = new Date()
  // Format: YYYY/MM/DD 下午HH:MM:SS
  const dateStr = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`
  const hours = now.getHours()
  const ampm = hours >= 12 ? '下午' : '上午'
  const formattedTime = `${dateStr} ${ampm}${hours % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  const newRecord = { 
    studentId: currentUser.studentId, 
    name: currentUser.name, 
    timestamp: formattedTime 
  }

  attendanceRecords.value.unshift(newRecord)
  localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords.value))
  
  message.value = '打卡成功!'
  
  // Clear message after 3 seconds
  setTimeout(() => message.value = '', 3000)
}
</script>