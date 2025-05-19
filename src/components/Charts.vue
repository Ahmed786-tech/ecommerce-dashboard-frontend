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
import { ref, computed } from 'vue'

const chartType = ref<'line' | 'bar' | 'area'>('line')

// Dummy data for different chart types
const dummyData = computed(() => {
    switch (chartType.value) {
        case 'line':
        case 'area':
            return {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                series: [{
                    name: 'Revenue',
                    data: [4000, 7000, 3500, 8500, 6000, 9000]
                }, {
                    name: 'Sales',
                    data: [300, 500, 450, 600, 550, 700]
                }]
            }
        case 'bar':
            return {
                categories: ['Electronics', 'Clothing', 'Home Goods', 'Beauty'],
                series: [{
                    name: 'Q1',
                    data: [4000, 3000, 6000, 2000]
                }, {
                    name: 'Q2',
                    data: [5000, 4000, 6500, 2500]
                }]
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