
<template>
    <v-card class="" max-width="400" variant="elevated">
      <v-img v-if="image" :src="image" height="200px" cover />
      
      <v-card-title  v-if="$slots.title" class="text-subtitle-1 font-weight-medium"><slot name="title" /></v-card-title>
      
      <v-card-text v-if="text" class="text-h4">
        {{ text }}
      </v-card-text>
  
      <v-card-actions v-if="$slots.actions">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    text?: string
    image?: string
  }>()
  </script>
  