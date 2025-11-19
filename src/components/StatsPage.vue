<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white p-8 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">出席統計</h2>
      <p class="text-gray-600 mb-6 font-medium">總打卡紀錄數 : <span class="text-blue-600 font-bold">{{ totalCheckIns }}</span></p>

      <h3 class="text-xl font-bold text-gray-800 mb-4">每位隊員出席次數</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden mb-10">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 font-medium w-1/2">隊員</th>
              <th class="px-6 py-3 font-medium">出席次數</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="(count, member) in attendanceCount" :key="member" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-gray-700">{{ member }}</td>
              <td class="px-6 py-4 text-gray-700 font-bold">{{ count }}</td>
            </tr>
            <tr v-if="Object.keys(attendanceCount).length === 0">
              <td colspan="2" class="px-6 py-4 text-center text-gray-400">無數據</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-4">出席統計圖表</h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-white">
        <!-- ChartJS Component -->
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const attendanceRecords = ref([])
const totalCheckIns = ref(0)
const attendanceCount = ref({})

onMounted(() => {
  // 1. Load Data
  const stored = localStorage.getItem('attendanceRecords')
  if (stored) {
    attendanceRecords.value = JSON.parse(stored)
  } else {
    // Mock data if empty, just so you can see the chart working
    attendanceRecords.value = [
      { name: 'User1' }, { name: 'User1' }, { name: 'User1' },
      { name: 'User2' }, { name: 'User2' }
    ]
  }
  computeStats()
})

function computeStats() {
  totalCheckIns.value = attendanceRecords.value.length
  const counts = {}
  attendanceRecords.value.forEach(r => {
    // Use 'name' if available, fallback to 'username'
    const key = r.name || r.username || 'Unknown'
    counts[key] = (counts[key] || 0) + 1
  })
  attendanceCount.value = counts
}

const chartData = computed(() => ({
  labels: Object.keys(attendanceCount.value),
  datasets: [
    {
      label: '出席次數',
      data: Object.values(attendanceCount.value),
      backgroundColor: '#3b82f6', // Blue-500 to match theme
      borderRadius: 4,
      barThickness: 40,
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6' // Gray-100
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}
</script>