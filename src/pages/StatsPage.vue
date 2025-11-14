<template>
  <div class="stats-container">
    <h2>出席統計</h2>

    <p>總打卡紀錄數：{{ totalCheckIns }}</p>

    <h3>每位隊員出席次數</h3>
    <table>
      <thead>
        <tr>
          <th>隊員</th>
          <th>出席次數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(count, member) in attendanceCount" :key="member">
          <td>{{ member }}</td>
          <td>{{ count }}</td>
        </tr>
      </tbody>
    </table>

    <h3>出席統計圖表</h3>
    <!-- ✅ 直接使用 vue-chartjs 的 Bar 元件 -->
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

// ✅ 註冊 Chart.js 元件
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const attendanceRecords = ref([])
const totalCheckIns = ref(0)
const attendanceCount = ref({})

// 模擬從 localStorage 讀取資料
onMounted(() => {
  const stored = localStorage.getItem('attendanceRecords')
  if (stored) {
    attendanceRecords.value = JSON.parse(stored)
    computeStats()
  }
})

// 統計各成員出席次數
function computeStats() {
  totalCheckIns.value = attendanceRecords.value.length
  const counts = {}
  attendanceRecords.value.forEach(r => {
    counts[r.username] = (counts[r.username] || 0) + 1
  })
  attendanceCount.value = counts
}

// ✅ 使用 computed 自動更新 chartData
const chartData = computed(() => ({
  labels: Object.keys(attendanceCount.value),
  datasets: [
    {
      label: '出席次數',
      data: Object.values(attendanceCount.value),
      backgroundColor: '#42b983'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: '隊員出席統計' }
  }
}
</script>

<style scoped>
.stats-container {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
}

table {
  width: 100%;
  margin-top: 15px;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #ccc;
}

th, td {
  padding: 8px;
  text-align: center;
}
</style>
