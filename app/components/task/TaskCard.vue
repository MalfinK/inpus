<script setup lang="ts">
import type { Task } from "../../../server/db/schema";

const props = defineProps<{
  task: Task & { projectName?: string; memberName?: string };
  isAdmin?: boolean;
  canMarkStatus?: boolean;
  allowHutang?: boolean;
  editable?: boolean;
  deletable?: boolean;
  showProject?: boolean;
  showMember?: boolean;
}>();

const emit = defineEmits<{
  markStatus: [id: number, status: "terealisasi" | "hutang" | "pending"];
  edit: [id: number];
  delete: [id: number];
}>();

const formatDate = (d: string) => {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusMenu = [
  {
    label: "Tandai Terealisasi",
    value: "terealisasi",
    icon: "i-lucide-check-circle",
    color: "success",
  },
  {
    label: "Tandai Hutang",
    value: "hutang",
    icon: "i-lucide-alert-circle",
    color: "error",
  },
  {
    label: "Reset ke Pending",
    value: "pending",
    icon: "i-lucide-clock",
    color: "warning",
  },
];

const statusMenuItems = computed(() => {
  const items = props.allowHutang
    ? statusMenu
    : statusMenu.filter((s) => s.value !== "hutang");

  return [
    items.map((s) => ({
      label: s.label,
      icon: s.icon,
      onSelect: () => emit("markStatus", props.task.id, s.value as any),
    })),
  ];
});
</script>

<template>
  <div
    class="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ task.title }}
          </h4>
          <SharedStatusBadge :status="task.status as any" />
        </div>

        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400"
        >
          <span
            v-if="showProject && task.projectName"
            class="flex items-center gap-1"
          >
            <UIcon name="i-lucide-folder" class="w-3 h-3" />
            {{ task.projectName }}
          </span>
          <span
            v-if="showMember && task.memberName"
            class="flex items-center gap-1"
          >
            <UIcon name="i-lucide-user" class="w-3 h-3" />
            {{ task.memberName }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-calendar-range" class="w-3 h-3" />
            {{ formatDate(task.weekStart) }} – {{ formatDate(task.weekEnd) }}
          </span>
        </div>

        <p v-if="task.description" class="text-sm text-gray-500 mt-2">
          {{ task.description }}
        </p>

        <div
          v-if="task.adminNote"
          class="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5"
        >
          <UIcon
            name="i-lucide-message-square"
            class="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
          />
          <span>{{ task.adminNote }}</span>
        </div>
      </div>

      <div
        v-if="canMarkStatus || editable || deletable || isAdmin"
        class="flex-shrink-0 flex items-center gap-1"
      >
        <UDropdownMenu v-if="canMarkStatus" :items="statusMenuItems">
          <UButton
            icon="i-lucide-more-vertical"
            size="xs"
            variant="ghost"
            color="neutral"
          />
        </UDropdownMenu>
        <UButton
          v-if="editable"
          icon="i-lucide-pencil"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="$emit('edit', task.id)"
        />
        <UButton
          v-if="isAdmin || deletable"
          icon="i-lucide-trash-2"
          size="xs"
          variant="ghost"
          color="error"
          @click="$emit('delete', task.id)"
        />
      </div>
    </div>
  </div>
</template>
