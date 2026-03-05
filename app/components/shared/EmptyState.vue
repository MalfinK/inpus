<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  icon?: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <UIcon
      :name="icon ?? 'i-lucide-inbox'"
      class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
    />
    <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400">
      {{ title ?? "Belum ada data" }}
    </h3>
    <p
      v-if="description"
      class="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-sm"
    >
      {{ description }}
    </p>
    <slot />
  </div>
</template>
