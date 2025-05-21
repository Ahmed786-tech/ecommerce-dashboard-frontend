<template>
  <v-container fluid>
    <v-row class="mb-4" justify="space-between">
      <v-col cols="12" md="4">
        <div class="text-h4">Revenue Analysis</div>
        <div class="text-subtitle-1">Monitor your sales, orders, and revenue metrics</div>
      </v-col>

      <v-col cols="12" md="7">
        <v-sheet class="d-flex ga-1 align-end">

          <v-text-field v-model="startDate" label="Pick start Date" variant="outlined" :density="'comfortable'" readonly
            @click:append-inner="toggleStartDateMenu">
            <template v-slot:append-inner>
              <v-icon id="menu-activator1" @click="toggleStartDateMenu">mdi-calendar</v-icon>
            </template>
          </v-text-field>
          <v-menu activator="#menu-activator1" v-model:open="startDateMenu" :close-on-content-click="false"
            transition="scale-transition" location="bottom">
            <v-date-picker v-model="startDate" @input="startDateMenu = false" />
          </v-menu>

          <v-text-field v-model="endDate" label="Pick end Date" variant="outlined" :density="'comfortable'" readonly
            @click:append-inner="toggleEndDateMenu">
            <template v-slot:append-inner>
              <v-icon id="menu-activator" @click="toggleEndDateMenu">mdi-calendar</v-icon>
            </template>
          </v-text-field>
          <v-menu activator="#menu-activator" v-model:open="endDateMenu" :close-on-content-click="false"
            transition="scale-transition" location="bottom">
            <v-date-picker v-model="endDate" @input="endDateMenu = false" />
          </v-menu>

         
        </v-sheet>

      </v-col>

    </v-row>
    <v-row class="mb-4">
      <v-col cols="12" md="3" v-for="(stat, index) in revenue" :key="index">
        <BaseCard :text="stat.value.toString()">
          <template #title>
            <div class="d-flex align-center justify-space-between">
              <span class="text-body-1">{{ stat.title }}</span>
              <v-icon :color="stat.color" class="mr-2">{{ stat.icon }}</v-icon>

            </div>
          </template>
        </BaseCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="9">
        <Charts />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Charts from '../components/Charts.vue'
import BaseCard from '../components/BaseCard.vue'
import { useDashboard } from '../composables/useDashboard'
const { dashboardData, fetchDashboardData } = useDashboard();


const startDate = ref<string>('');
const startDateMenu = ref<boolean>(false);
const endDate = ref<string>('');
const endDateMenu = ref<boolean>(false);


const toggleStartDateMenu = () => {
  startDateMenu.value = !startDateMenu.value;
};

const toggleEndDateMenu = () => {
  endDateMenu.value = !endDateMenu.value;
};


// Computed properties

const revenue = computed(() => [
  {
    title: 'Total Revenue',
    value: `$${dashboardData.value?.stats?.totalRevenue || 0}`,
    icon: 'mdi-currency-usd',
    color: 'primary'
  },
  {
    title: 'Total Orders',
    value: dashboardData.value?.stats?.totalOrders || 0,
    icon: 'mdi-cart',
    color: 'success'
  },

])

onMounted(async () => {
  await fetchDashboardData();
});


// const currentData = computed(() => mockChartData[timeRange.value as keyof typeof mockChartData])

// const filteredData = computed(() => {
//   if (selectedCategory.value === 'All') return currentData.value

//   const categoryIndex = categoryData.labels.indexOf(selectedCategory.value)
//   if (categoryIndex === -1) return currentData.value

//   const categoryRatio = categoryData.sales[categoryIndex] /
//     categoryData.sales.reduce((a, b) => a + b, 0)

//   return {
//     labels: currentData.value.labels,
//     sales: currentData.value.sales.map(v => Math.round(v * categoryRatio)),
//     orders: currentData.value.orders.map(v => Math.round(v * categoryRatio))
//   }
// })



// const totalRevenue = computed(() =>
//   filteredData.value.sales.reduce((a, b) => a + b, 0)
// )

// const totalOrders = computed(() =>
//   filteredData.value.orders.reduce((a, b) => a + b, 0)
// )




</script>