<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  description?: string;
  icon?: string;
  color?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
  trend?: number;
}>();
</script>

<template>
  <UCard class="h-full">
    <div class="flex items-start gap-4">
      <div
        v-if="icon"
        class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        :class="`bg-${color ?? 'primary'}-50 dark:bg-${color ?? 'primary'}-950`"
      >
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="`text-${color ?? 'primary'}-500`"
        />
      </div>
      <div class="flex-1 min-w-0">
        <p
          class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
        >
          {{ label }}
        </p>
        <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </p>
        <p v-if="description" class="mt-1 text-xs text-gray-400">
          {{ description }}
        </p>
      </div>
    </div>
  </UCard>
</template>
