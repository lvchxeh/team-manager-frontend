<template>
  <div class="attendance-container">
    <h2 class="page-title">出席打卡</h2>

    <!-- 打卡表單 -->
    <div class="form-group">
      <button @click="checkIn">打卡</button>
    </div>

    <!-- 提示訊息 -->
    <p v-if="message" class="message">{{ message }}</p>

    <!-- 已打卡紀錄 -->
    <h3 class="record-title">已打卡紀錄</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>學號</th>
            <th>姓名</th>
            <th>日期時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in attendanceRecords" :key="index">
            <td><div class="cell-content">{{ record.username }}</div></td>
            <td><div class="cell-content">{{ record.name }}</div></td>
            <td><div class="cell-content">{{ record.timestamp }}</div></td>
          </tr>
          <tr v-if="attendanceRecords.length === 0">
            <td colspan="3"><div class="cell-content">尚無打卡紀錄</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 使用者資訊
const loggedInUser = localStorage.getItem('loggedInUser') || '未知使用者'

// 表單訊息
const message = ref('')

// 已打卡資料
const attendanceRecords = ref([])

// 模擬姓名，實務可從 MembersPage 或後端抓
const username = loggedInUser
const name = loggedInUser

// 讀取 localStorage 內的打卡紀錄，並保證是陣列
onMounted(() => {
  const stored = localStorage.getItem('attendanceRecords')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      attendanceRecords.value = Array.isArray(parsed) ? parsed : []
    } catch {
      attendanceRecords.value = []
    }
  } else {
    attendanceRecords.value = []
  }
})

// 打卡功能
const checkIn = () => {
  const now = new Date()
  const timestamp = now.toLocaleString()

  const newRecord = { username, name, timestamp }

  // 加入紀錄
  attendanceRecords.value.push(newRecord)

  // 儲存到 localStorage
  localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords.value))

  message.value = '✅ 打卡成功！'
}
</script>

<style scoped>
.attendance-container {
  max-width: 1080px;
  margin: 30px auto;
  padding: 25px;
  background-color: #758D71; /* 主背景柔和綠 */
  border-radius: 16px;
  color: #000;
  font-family: 'Poppins', sans-serif;
  text-align: center; /* 標題與按鈕置中 */
}

.page-title,
.record-title {
  font-size: 2rem;   /* 原來可能是默認大小，現在放大 */
  font-weight: 500;
  margin-bottom: 15px;
}

.card, table {
  background: linear-gradient(145deg, #c8b7a6CC, #FFFFFFCC); /* 卡片 / 米棕漸層 */
  border-radius: 16px;
  border: 1px solid rgba(200,183,166,0.5);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15), 0 0 8px rgba(255,255,255,0.2); /* 光澤 / 懸浮效果 */
  padding: 20px;
}

button {
  background-color: #c8b7a6; /* 米棕 */
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1), 0 0 4px rgba(255,255,255,0.15);
}

button:hover {
  background-color: #e3d7c6;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 15px;
}

table {
  width: 95%;
  max-width: 1000px;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 10px 8px;
  table-layout: fixed;
}

th, td {
  background-color: rgba(255,255,255,0.85); /* 白色透明格子 */
  border-radius: 6px;
  color: #000;
  text-align: center; /* 文字置中 */
  padding: 8px 6px;
}

/* 將文字包在 cell-content 內，內框文字居中 */
.cell-content {
  display: inline-block;
  width: 100%;
  text-align: center;
}

thead {
  background-color: #c8b7a6; /* 米棕表頭 */
  color: #000;
  font-weight: 700;
}

tbody tr:hover td {
  background-color: rgba(255,255,255,0.85); /* hover 不變色 */
}

.message {
  margin: 10px 0;
}
</style>
