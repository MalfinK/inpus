<script setup lang="ts">
const { logout } = useAuth();
const route = useRoute();

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: "i-lucide-layout-dashboard",
  },
  { label: "Anggota", to: "/admin/anggota", icon: "i-lucide-users" },
  { label: "Laporan", to: "/admin/laporan", icon: "i-lucide-file-bar-chart" },
];

const sidebarOpen = ref(false);

const isActive = (to: string) =>
  route.path === to || route.path.startsWith(to + "/");
</script>

<template>
  <UApp>
    <div class="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <!-- Sidebar Overlay (mobile) -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-20 bg-black/50 lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200"
        :class="
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        "
      >
        <!-- Logo -->
        <div
          class="h-16 flex items-center gap-2.5 px-6 border-b border-gray-200 dark:border-gray-800"
        >
          <div
            class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0"
          >
            <UIcon name="i-lucide-users" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white leading-tight">
              InPus
            </p>
            <p class="text-xs text-gray-400 leading-tight">Admin Panel</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            "
            @click="sidebarOpen = false"
          >
            <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Bottom -->
        <div
          class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2"
        >
          <NuxtLink to="/">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-external-link"
              block
            >
              Lihat Halaman Publik
            </UButton>
          </NuxtLink>
          <UButton
            variant="ghost"
            color="error"
            size="sm"
            icon="i-lucide-log-out"
            block
            @click="logout"
          >
            Keluar
          </UButton>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
        <!-- Top bar -->
        <header
          class="sticky top-0 z-10 h-16 flex items-center gap-4 px-4 sm:px-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"
        >
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            size="sm"
            class="lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
          />
          <div class="flex-1" />
          <UColorModeButton size="sm" />
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-shield-check"
                class="w-4 h-4 text-primary-500"
              />
            </div>
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block"
              >Admin</span
            >
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <slot />
        </main>
      </div>
    </div>
    <UToaster />
  </UApp>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
