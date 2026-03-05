<script setup lang="ts">
const props = defineProps<{
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  color?: "primary" | "error" | "warning";
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-950"
          >
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-6 h-6 text-red-500"
            />
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ title ?? "Konfirmasi" }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ description ?? "Apakah Anda yakin ingin melanjutkan?" }}
            </p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <UButton
            variant="ghost"
            color="neutral"
            @click="
              emit('cancel');
              open = false;
            "
          >
            {{ cancelLabel ?? "Batal" }}
          </UButton>
          <UButton
            :color="color ?? 'error'"
            :loading="loading"
            @click="emit('confirm')"
          >
            {{ confirmLabel ?? "Hapus" }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
