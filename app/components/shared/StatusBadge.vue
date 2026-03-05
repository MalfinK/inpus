<script setup lang="ts">
defineProps<{
  status:
    | "pending"
    | "terealisasi"
    | "hutang"
    | "active"
    | "completed"
    | "on-hold";
}>();

const config: Record<
  string,
  {
    label: string;
    color:
      | "neutral"
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error";
  }
> = {
  pending: { label: "Pending", color: "warning" },
  terealisasi: { label: "Terealisasi", color: "success" },
  hutang: { label: "Hutang", color: "error" },
  active: { label: "Aktif", color: "primary" },
  completed: { label: "Selesai", color: "success" },
  "on-hold": { label: "Ditunda", color: "neutral" },
};
</script>

<template>
  <UBadge
    :color="config[status]?.color ?? 'neutral'"
    variant="subtle"
    size="sm"
  >
    {{ config[status]?.label ?? status }}
  </UBadge>
</template>
