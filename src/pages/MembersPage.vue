<template>
  <div class="members-container">
    <h2 class="main-title">🏐 球隊管理系統</h2>

    <!-- 新增隊員區 -->
    <div class="card">
      <button class="toggle-btn" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '收起新增隊員' : '➕ 新增隊員' }}
      </button>

      <div v-if="showAddForm" class="add-member">
        <input v-model="newMember.username" placeholder="學號 / 帳號" />
        <input v-model="newMember.password" type="password" placeholder="密碼" />
        <input v-model="newMember.name" placeholder="姓名" />
        <input v-model="newMember.position" placeholder="位置" />
        <button class="add-btn" @click="addMember">新增隊員</button>
      </div>
    </div>

    <!-- 隊員列表 -->
    <div class="card table-card">
      <h3>隊員列表</h3>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>帳號</th>
              <th>姓名</th>
              <th>位置</th>
              <th>密碼</th>
              <th>出席次數</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.username">
              <td>{{ member.username }}</td>
              <td><input v-model="member.name" /></td>
              <td><input v-model="member.position" /></td>
              <td class="password-cell">
                <input :type="showPassword[member.username] ? 'text' : 'password'" v-model="member.password" />
                <button @click="togglePassword(member.username)">
                  {{ showPassword[member.username] ? '隱' : '顯' }}
                </button>
              </td>
              <td>{{ getAttendanceCount(member.username) }}</td>
              <td>
                <button @click="saveMember(member)">💾</button>
                <button @click="deleteMember(member.username)">❌</button>
              </td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="6">尚無隊員資料</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const members = ref([])
const attendanceRecords = ref([])
const message = ref('')
const showAddForm = ref(false)
const newMember = ref({ username: '', password: '', name: '', position: '' })
const showPassword = ref({})

onMounted(() => {
  const storedMembers = localStorage.getItem('members')
  if (storedMembers) members.value = JSON.parse(storedMembers)

  const storedRecords = localStorage.getItem('attendanceRecords')
  if (storedRecords) attendanceRecords.value = JSON.parse(storedRecords)

  members.value.forEach(m => {
    showPassword.value[m.username] = false
  })
})

const togglePassword = (username) => {
  showPassword.value[username] = !showPassword.value[username]
}

const addMember = () => {
  if (!newMember.value.username || !newMember.value.password || !newMember.value.name) {
    message.value = '⚠️ 學號、密碼、姓名不可為空'
    return
  }
  if (members.value.find(m => m.username === newMember.value.username)) {
    message.value = '⚠️ 此學號已存在'
    return
  }
  members.value.push({ ...newMember.value })
  showPassword.value[newMember.value.username] = false
  saveMembers()
  message.value = '✅ 新增成功'
  newMember.value = { username: '', password: '', name: '', position: '' }
}

const saveMember = (member) => {
  const index = members.value.findIndex(m => m.username === member.username)
  if (index !== -1) {
    members.value[index] = { ...member }
    saveMembers()
    message.value = '✅ 資料已儲存'
  }
}

const deleteMember = (username) => {
  members.value = members.value.filter(m => m.username !== username)
  delete showPassword.value[username]
  saveMembers()
  message.value = '✅ 已刪除隊員'
}

const getAttendanceCount = (username) => {
  return attendanceRecords.value.filter(r => r.username === username).length
}

const saveMembers = () => {
  localStorage.setItem('members', JSON.stringify(members.value))
}
</script>

<style scoped>
.members-container {
  max-width: 1080px;
  margin: 30px auto;
  font-family: 'Poppins', sans-serif;
  color: #000;
  background-color: #758D71;
  padding: 25px;
  border-radius: 14px;
}

.main-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: #000;
  text-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.card {
  background: linear-gradient(145deg, #c8b7a6CC, #FFFFFFCC);
  padding: 20px;
  margin-bottom: 25px;
  border-radius: 16px;
  border: 1px solid rgba(200,183,166,0.5);
  box-shadow: 0 4px 12px rgba(200,183,166,0.2), 0 0 6px rgba(255,255,255,0.15);
  transition: all 0.3s ease;
}

.toggle-btn, .add-btn, .save-btn {
  padding: 10px 22px;
  font-size: 0.95rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #c8b7a6, #e3d7c6);
  color: #000;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
}
.toggle-btn:hover, .add-btn:hover, .save-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 5px 12px rgba(200,183,166,0.3);
}

.add-member input, td input {
  padding: 4px 6px;       /* 縮小輸入框 */
  border-radius: 6px;
  border: 1px solid #c8b7a6;
  outline: none;
  color: #000;
  font-size: 0.9rem;
  margin-right: 6px;
}

/* 密碼欄位更小 */
.password-cell input {
  padding: 3px 5px;
  font-size: 0.85rem;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 15px;
}

table {
  width: 100%;           /* 原 90% → 改大 */
  max-width: 1000px;    /* 原 850px → 改大 */
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 10px 8px;
  table-layout: fixed;
}

th, td {
  width: 16.66%;
  padding: 8px 6px;
  text-align: center;
  background-color: rgba(255,255,255,0.85);
  border-radius: 6px;
  color: #000;
}

td input {
  width: 50%;
  text-align: center;
}

thead {
  background-color: #c8b7a6;
  color: #000;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(255,255,255,0.2);
}

tbody tr:hover td {
  background-color: rgba(255,255,255,0.85); /* hover 不變色 */
}

.password-cell button {
  margin-left: 6px;
  padding: 4px 6px;
  border: none;
  border-radius: 4px;
  background-color: #c8b7a6;
  color: #000;
  cursor: pointer;
}
.password-cell button:hover {
  background-color: #e3d7c6;
}

.message {
  margin-top: 10px;
  font-weight: 500;
}
</style>
