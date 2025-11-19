<template>
  <div class="min-h-screen bg-gray-100 font-sans text-slate-800">
    
    <!-- Condition 1: Not Logged In -> Show Login Page -->
    <div v-if="!isLoggedIn">
      <LoginPage @login-success="handleLogin" />
    </div>

    <!-- Condition 2: Logged In -> Show Main Dashboard -->
    <div v-else>
      <!-- Navigation Bar -->
      <nav class="bg-blue-600 text-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div class="flex items-center space-x-3 cursor-pointer" @click="currentTab = 'MembersPage'">
          <div class="bg-white text-blue-600 p-1.5 rounded-full">
            <!-- UPDATED: Volleyball/Ball Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"></path>
              <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"></path>
            </svg>
          </div>
          <span class="text-xl font-bold tracking-wide">球隊管理系統</span>
        </div>
        
        <div class="flex items-center space-x-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.component" 
            @click="currentTab = tab.component"
            :class="['text-sm font-medium transition-colors duration-200', currentTab === tab.component ? 'text-white border-b-2 border-white pb-0.5' : 'text-blue-100 hover:text-white']"
          >
            {{ tab.label }}
          </button>
          
          <button @click="logout" class="bg-white text-blue-600 px-4 py-1.5 rounded hover:bg-blue-50 transition-colors text-sm font-bold">
            登出
          </button>
        </div>
      </nav>

      <!-- Page Content -->
      <main class="container mx-auto p-6">
        <component :is="currentTabComponent" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// Import all your components
import LoginPage from './components/LoginPage.vue'
import AttendancePage from './components/AttendancePage.vue'
import MembersPage from './components/MembersPage.vue'
import EventsPage from './components/EventsPage.vue'
import StatsPage from './components/StatsPage.vue'
import ProfilePage from './components/ProfilePage.vue'

const isLoggedIn = ref(false)
const currentTab = ref('MembersPage')

const tabs = [
  { label: '隊員資料', component: 'MembersPage' },
  { label: '賽事活動', component: 'EventsPage' },
  { label: '出席打卡', component: 'AttendancePage' },
  { label: '出席統計', component: 'StatsPage' },
  { label: '個人資料', component: 'ProfilePage' },
]

// Component mapping
const components = {
  LoginPage,
  AttendancePage,
  MembersPage,
  EventsPage,
  StatsPage,
  ProfilePage
}

const currentTabComponent = computed(() => components[currentTab.value])

// Check login status on load
onMounted(() => {
  if (localStorage.getItem('loggedInUser')) {
    isLoggedIn.value = true
  }
})

const handleLogin = () => {
  isLoggedIn.value = true
  currentTab.value = 'MembersPage'
}

const logout = () => {
  localStorage.removeItem('loggedInUser')
  isLoggedIn.value = false
}
</script>