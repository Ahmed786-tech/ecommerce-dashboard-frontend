<template>
     <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg">
          <v-card-item class="gradient-bg pa-8">
            <v-row align="center">
              <v-col cols="3">
                <v-avatar color="white" size="60">
                  <v-icon color="primary" size="x-large">mdi-chart-line</v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="9">
                <h1 class="text-h4 font-weight-bold white--text">Welcome Back</h1>
                <p class="text-subtitle-1 white--text mb-0">Manage your e-commerce dashboard</p>
              </v-col>
            </v-row>
          </v-card-item>

          <v-card-text class="pa-8">
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                :rules="emailRules"
                variant="outlined"
                color="primary"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                :rules="passwordRules"
                variant="outlined"
                color="primary"
                class="mb-2"
              ></v-text-field>

              <div class="text-right mb-6">
                <a href="#" class="text-caption text-primary text-decoration-none">Forgot Password?</a>
              </div>

              <v-btn 
                type="submit" 
                color="primary" 
                :loading="loading"
                block
                size="large"
                class="text-capitalize"
              >
                Sign In
              </v-btn>

              <v-divider class="my-6"></v-divider>

              <div class="text-center">
                <p class="text-body-2 text-medium-emphasis mb-2">
                  Don't have an account?
                </p>
                <v-btn
                  to="/register"
                  variant="outlined"
                  color="primary"
                  size="large"
                  class="text-capitalize"
                >
                  Create Account
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../store/auth';
  import api from '../../services/api';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  
  const emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  ];
  
  const passwordRules = [
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters',
  ];
  
  async function submit() {
    if (!email.value || !password.value) return;
  
    try {
      loading.value = true;
      const response = await api.post('/api/v1/users/login', {
        email: email.value,
        password: password.value,
      });
      
      authStore.setToken(response.data.token);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      loading.value = false;
    }
  }
  </script>