<script setup lang="ts">
const props = defineProps<{
  project: {
    id: number;
    name: string;
    description?: string | null;
    roles: string[];
    status: string;
    startDate?: string | null;
    endDate?: string | null;
    memberName?: string;
  };
  totalTasks?: number;
  doneTasks?: number;
  progressPercent?: number;
  showMember?: boolean;
  isAdmin?: boolean;
}>();

defineEmits<{
  edit: [id: number];
  delete: [id: number];
}>();

const roleColors: Record<string, string> = {
  frontend: "i-lucide-monitor",
  backend: "i-lucide-server",
  "ui-ux": "i-lucide-palette",
  tl: "i-lucide-users-round",
  sa: "i-lucide-file-search",
};

const roleLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  "ui-ux": "UI/UX",
  tl: "Team Leader (TL)",
  sa: "System Analyst (SA)",
};

const safeTotalTasks = computed(() => props.totalTasks ?? 0);
const safeDoneTasks = computed(() => props.doneTasks ?? 0);
const safeProgressPercent = computed(() => {
  if (!safeTotalTasks.value) return 0;
  return Math.max(0, Math.min(100, props.progressPercent ?? 0));
});
</script>

<template>
  <UCard class="h-full">
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ project.name }}
          </h3>
          <SharedStatusBadge :status="project.status as any" />
        </div>
        <p
          v-if="showMember && project.memberName"
          class="text-xs text-gray-400 mt-0.5"
        >
          {{ project.memberName }}
        </p>
        <p
          v-if="project.description"
          class="text-sm text-gray-500 mt-2 line-clamp-2"
        >
          {{ project.description }}
        </p>
      </div>
      <div v-if="isAdmin" class="flex gap-1 flex-shrink-0">
        <UButton
          icon="i-lucide-pencil"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="$emit('edit', project.id)"
        />
        <UButton
          icon="i-lucide-trash-2"
          size="xs"
          variant="ghost"
          color="error"
          @click="$emit('delete', project.id)"
        />
      </div>
    </div>

    <div v-if="project.roles?.length" class="flex flex-wrap gap-2 mt-3">
      <UBadge
        v-for="role in project.roles"
        :key="role"
        variant="outline"
        color="neutral"
        size="xs"
        class="gap-1"
      >
        <UIcon :name="roleColors[role] ?? 'i-lucide-code'" class="w-3 h-3" />
        {{ roleLabels[role] ?? role }}
      </UBadge>
    </div>

    <div
      v-if="project.startDate || project.endDate"
      class="flex items-center gap-1 mt-3 text-xs text-gray-400"
    >
      <UIcon name="i-lucide-calendar" class="w-3 h-3" />
      {{ project.startDate ?? "—" }} s/d {{ project.endDate ?? "Sekarang" }}
    </div>

    <div class="mt-4">
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="text-gray-500 dark:text-gray-400 font-medium">
          Progress Task
        </span>
        <span class="text-gray-700 dark:text-gray-200 font-semibold">
          {{ safeDoneTasks }} / {{ safeTotalTasks }} ({{
            safeProgressPercent
          }}%)
        </span>
      </div>
      <UProgress :model-value="safeProgressPercent" />
    </div>
  </UCard>
</template>
