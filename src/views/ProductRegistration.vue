<template>
  <v-container class="max-width-800">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="elevation-3 pa-4 h-100">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-text-box" color="primary" size="32" class="mr-2"></v-icon>
            <div>
              <h2 class="text-h5 font-weight-bold">Product Details</h2>
              <p class="text-caption text-medium-emphasis">Essential product information</p>
            </div>
          </div>

          <v-text-field v-model="form.name" label="Product Name" :rules="[required]" variant="outlined"
            class="mb-4"></v-text-field>

          <v-textarea v-model="form.description" label="Description" variant="outlined" rows="3"
            class="mb-4"></v-textarea>

          <v-text-field v-model.number="form.price" label="Price" type="number" :rules="[positiveNumber]"
            variant="outlined" class="mb-4" prefix="$"></v-text-field>

          <v-text-field v-model.number="form.stock" label="Initial Stock" type="number" :rules="[positiveNumber]"
            variant="outlined"></v-text-field>

          <v-text-field v-model.number="form.minStock" label="Min Stock" type="number" :rules="[positiveNumber]"
            variant="outlined"></v-text-field>
          <v-select v-model="selectedCategory" :items="categoryFilters" label="Filter by Category" variant="outlined"
            :density="'comfortable'" dense></v-select>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="elevation-3 pa-4 h-100">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-image" color="primary" size="32" class="mr-2"></v-icon>
            <div>
              <h2 class="text-h5 font-weight-bold">Product Image</h2>
              <p class="text-caption text-medium-emphasis">Upload main product photo</p>
            </div>
          </div>

          <v-file-upload v-model="form.image" label="Drag and drop or click to upload" accept="image/*"
            :clearable="!!form.image" :max-size="5 * 1024 * 1024" class="upload-area"></v-file-upload>

        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="elevation-3 pa-4">
          <div class="d-flex justify-end">
            <v-btn type="submit" color="primary" :loading="loading" size="large" @click="submitProduct">
              Create Product
              <template v-slot:loader>
                <v-progress-circular indeterminate></v-progress-circular>
              </template>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="successSnackbar" color="success" timeout="3000">
      Product created successfully!
    </v-snackbar>

    <v-snackbar v-model="errorSnackbar" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { categoryData } from '../utils/mockData'

const categoryFilters = ['All', ...categoryData.labels]
const router = useRouter()

const selectedCategory = ref('All')
const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  minStock: 0,
  image: null as any
})


const loading = ref(false)
const successSnackbar = ref(false)
const errorSnackbar = ref(false)
const errorMessage = ref('')


async function submitProduct() {
  if (!validateForm()) return

  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('description', form.description)
  formData.append('price', form.price.toString())
  formData.append('stock_level', form.stock.toString())
  formData.append('category', selectedCategory.value)
  formData.append('min_stock', form.minStock.toString())

  if (form.image) {
    formData.append('file', form.image)
  }

  try {
    loading.value = true
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.status === 201) {
      successSnackbar.value = true
      setTimeout(() => router.push('/inventory'), 1500)
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create product'
    errorSnackbar.value = true
  } finally {
    loading.value = false
  }
}

function validateForm() {
  return form.name &&
    form.price > 0 &&
    form.stock >= 0 &&
    form.minStock >= 0
}
</script>

<style scoped>
.max-width-800 {
  max-width: 800px;
  margin: 0 auto;
}

.h-100 {
  height: 100%;
}

.image-preview {
  transition: transform 0.2s;
  cursor: pointer;
}

.image-preview:hover {
  transform: scale(1.03);
}

.image-preview-wrapper {
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 8px;
  position: relative;
}

.image-preview-wrapper::after {
  content: "Preview";
  position: absolute;
  top: -12px;
  left: 16px;
  background: white;
  padding: 0 8px;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
}

.empty-state {
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}
</style>