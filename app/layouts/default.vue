<script setup lang="ts"></script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <!-- Header -->
      <header
        class="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
      >
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
        >
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5 font-bold text-lg text-gray-900 dark:text-white"
          >
            <div
              class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center"
            >
              <UIcon name="i-lucide-users" class="w-5 h-5 text-white" />
            </div>
            <span>InPus</span>
            <UBadge color="primary" variant="subtle" size="xs">
              Magang & PKL
            </UBadge>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <NuxtLink to="/anggota">
              <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                icon="i-lucide-user-circle"
              >
                Isi Data Saya
              </UButton>
            </NuxtLink>
            <UColorModeButton size="sm" />
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <slot />
      </main>

      <!-- Footer -->
      <footer
        class="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-400"
      >
        © {{ new Date().getFullYear() }} Sistem Pendataan Magang & PKL
      </footer>
    </div>
    <UToaster />
  </UApp>
</template>
