<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" md="3" v-for="(stat, index) in stats" :key="index">
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

    <v-alert
      v-if="lowStockCount > 0 || outOfStockCount > 0"
      type="warning"
      variant="outlined"
      class="mb-4"
    >
      Inventory Alert: 
      <span v-if="lowStockCount > 0">{{ lowStockCount }} product(s) low on stock</span>
      <span v-if="outOfStockCount > 0">, {{ outOfStockCount }} product(s) out of stock</span>
    </v-alert>

 
    <v-row class="">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search Products"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Filter by Category"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedStatus"
          :items="statusFilters"
          label="Filter by Status"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
    </v-row>

  <v-row class="mb-2">
    <v-col cols="12">
      <div class="d-flex justify-end">
        <v-btn to="/products" color="primary">Add Product</v-btn>
      </div>
    </v-col>
  </v-row>
    <v-data-table
      :headers="headers"
      :items="filteredProducts"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.stock_level="{ item }">
        <v-text-field
          v-model.number="item.stock_level"
          type="number"
          density="compact"
          @change="updateStock(item)"
          :error="item.stock_level < item.minStock"
        ></v-text-field>
        <v-chip
          v-if="getStockStatus(item) !== 'in-stock'"
          :color="getStockStatusColor(item)"
          size="small"
          class="mt-1"
        >
          {{ getStockStatus(item) }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import BaseCard from '../components/BaseCard.vue';

interface Product {
  _id?: string
  name?: string
  description?: string
  price?: number
  stock_level?: number
  category?: string
  minStock?: number
  image_url?: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

const search = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const products = ref<Product[]>([])
const loading = ref(false)
const errorMessage = ref('')

// Mock categories - replace with API data when available
const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(p => p.category))
  return Array.from(uniqueCategories).filter(Boolean) as string[]
})

const statusFilters = ref([
  { title: 'All', value: '' },
  { title: 'In Stock', value: 'in-stock' },
  { title: 'Low Stock', value: 'low-stock' },
  { title: 'Out of Stock', value: 'out-of-stock' }
])

const headers = ref([
  { title: 'Product', key: 'name' },
  { title: 'Category', key: 'category' },
  { title: 'Price', key: 'price' },
  { title: 'Stock Level', key: 'stock_level' },
  { title: 'Status', key: 'status' }
])

const stats = computed(() => [
  { 
    title: 'Total Products', 
    value: products.value.length,
    icon: 'mdi-package-variant',
    color: 'primary'
  },
  { 
    title: 'In Stock', 
    value: inStockCount.value,
    icon: 'mdi-check-circle',
    color: 'success'
  },
  { 
    title: 'Low Stock', 
    value: lowStockCount.value,
    icon: 'mdi-alert-circle',
    color: 'warning'
  },
  { 
    title: 'Out of Stock', 
    value: outOfStockCount.value,
    icon: 'mdi-close-circle',
    color: 'error'
  }
])


const inStockCount = computed(() => 
  products.value.filter(p => getStockStatus(p) === 'in-stock').length
)

const lowStockCount = computed(() => 
  products.value.filter(p => getStockStatus(p) === 'low-stock').length
)

const outOfStockCount = computed(() => 
  products.value.filter(p => getStockStatus(p) === 'out-of-stock').length
)

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = !selectedCategory.value || 
      product.category === selectedCategory.value
    const matchesStatus = !selectedStatus.value || 
      getStockStatus(product) === selectedStatus.value
    
    return matchesCategory && matchesStatus
  })
})

function getStockStatus(product: Product) {
  const stock = product.stock_level || 0
  const minStock = product.minStock || 0
  
  if (stock <= 0) return 'out-of-stock'
  if (stock < minStock) return 'low-stock'
  return 'in-stock'
}

function getStockStatusColor(product: Product) {
  const status = getStockStatus(product)
  return {
    'out-of-stock': 'error',
    'low-stock': 'warning',
    'in-stock': 'success'
  }[status]
}

async function fetchProducts() {
  try {
    loading.value = true
    const response = await api.get('/products')
    products.value = response.data.map((product: Product) => ({
      ...product,
      minStock: 20 // Set your minimum stock threshold here
    }))
  } catch (error) {
    errorMessage.value = 'Failed to load products'
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

async function updateStock(product: Product) {
  try {
    if (!product._id) return
    await api.patch(`/products/${product._id}`, {
      stock_level: product.stock_level
    })
    await fetchProducts()
  } catch (error) {
    errorMessage.value = 'Failed to update stock'
    console.error('Error updating stock:', error)
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style>