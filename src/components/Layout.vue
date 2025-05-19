<template>
  <v-app>
    <v-app-bar v-if="authStore.isAuthenticated" color="surface" :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title class="text-h6 font-weight-bold">
          Dashboard
        </v-app-bar-title>
      </template>

      <template v-slot:append>
        <v-chip class="mr-2" prepend-icon="mdi-account">
          {{ authStore.user?.email }}
        </v-chip>
        <v-btn icon="mdi-logout" color="error" variant="text" @click="logout"></v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer class="elevation-6" color="surface" v-if="authStore.isAuthenticated" app v-model="drawer"
      :temporary="$vuetify.display.mobile">
      <v-list density="compact" nav>
        <v-list-item v-for="item in navItems" :key="item.title" :to="item.to" active-class="active-nav-item">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-4"></v-divider>

        <v-list-item @click="logout" color="error">
          <template v-slot:prepend>
            <v-icon icon="mdi-logout" color="error"></v-icon>
          </template>
          <v-list-item-title class="text-error">Logout</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const drawer = ref(true)

const authStore = useAuthStore();

const navItems = [
  { title: 'Revenue Analysis', icon: 'mdi-chart-line', to: '/revenue' },
  { title: 'Inventory Management', icon: 'mdi-package-variant', to: '/inventory' },
  { title: 'Product Registration', icon: 'mdi-plus-box', to: '/products' },
]

function logout() {
  authStore.logout();
  router.push('/login');
}

</script>

<style scoped>
.v-main {
  padding-top: 64px;
  transition: all 0.3s ease;
}

.active-nav-item {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

.v-list-item--active {
  color: rgb(var(--v-theme-primary)) !important;
}

.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.v-app-bar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>