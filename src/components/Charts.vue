<template>
    <v-btn-toggle v-model="chartType" mandatory class="chart-type-selector mb-4">
        <v-btn value="line" variant="flat" width="120" class="ma-1 transition-fast-in-out"
            active-class="active-chart-type">
            <span class="text-caption text-uppercase font-weight-bold">Revenue</span>
        </v-btn>

        <v-btn value="bar" variant="flat" width="120" class="ma-1 transition-fast-in-out"
            active-class="active-chart-type">
            <span class="text-caption text-uppercase font-weight-bold">Sales</span>
        </v-btn>

        <v-btn value="area" variant="flat" width="120" class="ma-1 transition-fast-in-out"
            active-class="active-chart-type">

            <span class="text-caption text-uppercase font-weight-bold">Orders</span>
        </v-btn>
    </v-btn-toggle>
    <v-card>
        <ApexChart :type="chartType" height="400" :options="chartOptions" :series="chartSeries"></ApexChart>
    </v-card>

</template>

<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import { ref, computed, onMounted } from 'vue'
import { useDashboard } from '../composables/useDashboard'


const { dashboardData, fetchDashboardData} = useDashboard();
const chartType = ref<'line' | 'bar' | 'area'>('line')

const dummyData = computed(() => {
    switch (chartType.value) {
        case 'line':
        return {
                categories: dashboardData.value?.analytics?.revenue.categories || [],
                series: dashboardData.value?.analytics?.revenue.series || [],
            }
        case 'area':
            return {
                categories: dashboardData.value?.analytics?.orders.categories || [],
                series: dashboardData.value?.analytics?.orders.series || [],
            }
        case 'bar':
            return {
                categories: dashboardData.value?.analytics?.sales.categories || [],
                series: dashboardData.value?.analytics?.sales.series || [],

            }
        default:
            return {
                categories: [],
                series: []
            }
    }
})

const chartOptions = computed(() => ({
    chart: {
        toolbar: { show: false }
    },
    xaxis: {
        categories: dummyData.value.categories,
        labels: {
            style: { colors: '#6B7280' }
        }
    },
    yaxis: {
        labels: {
            style: { colors: '#6B7280' },
            formatter: (value: number) => chartType.value === 'bar'
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()
        }
    },
    colors: ['#3B82F6', '#10B981'],
    dataLabels: { enabled: false },
    stroke: {
        width: 2,
        curve: chartType.value === 'line' ? 'smooth' : 'straight'
    },
    fill: {
        type: chartType.value === 'area' ? 'gradient' : 'solid',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
        }
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: (value: number) => chartType.value === 'bar'
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()
        }
    }
}))

const chartSeries = computed(() => dummyData.value.series)

onMounted(async () => {
  await fetchDashboardData();
});

</script>

<style scoped>
.chart-type-selector {
    border: 1px solid rgba(52, 51, 51, 0.12);
    background: rgba(255, 255, 255, 0.04);
    padding: 4px;
}

.v-btn {
    border: 2px solid transparent !important;
    background: rgba(255, 255, 255, 0.05) !important;
    flex-direction: column;
}

.active-chart-type {
    border-color: rgb(var(--v-theme-primary)) !important;
    background: rgba(var(--v-theme-primary), 0.15) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-btn:hover:not(.active-chart-type) {
    background: rgba(255, 255, 255, 0.08) !important;
}

.transition-fast-in-out {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>