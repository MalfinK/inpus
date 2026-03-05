<script setup lang="ts">
import type { Member } from "../../../server/db/schema";

const props = defineProps<{
  member: Member & {
    projects?: Array<any>;
    tasks?: Array<any>;
  };
  isAdmin?: boolean;
}>();

defineEmits<{
  edit: [member: Member];
  delete: [id: number];
}>();

const typeLabels: Record<string, string> = {
  intern: "Magang",
  pkl: "PKL",
  pegawai: "Pegawai",
};

const typeColors: Record<string, string> = {
  intern: "info",
  pkl: "warning",
  pegawai: "primary",
};

const totalTasks = computed(() => props.member.tasks?.length ?? 0);
const totalProjects = computed(() => props.member.projects?.length ?? 0);
const initials = computed(() =>
  props.member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase(),
);

const detailLink = computed(() =>
  props.isAdmin
    ? `/admin/anggota/${props.member.id}`
    : `/anggota/${props.member.id}`,
);
</script>

<template>
  <UCard class="h-full hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <UAvatar :alt="member.name" size="lg" :ui="{ root: 'flex-shrink-0' }">
        <span class="text-sm font-bold">{{ initials }}</span>
      </UAvatar>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="font-semibold text-gray-900 dark:text-white truncate">
            {{ member.name }}
          </h3>
          <UBadge
            :color="typeColors[member.type] as any"
            variant="subtle"
            size="xs"
          >
            {{ typeLabels[member.type] ?? member.type }}
          </UBadge>
        </div>
        <p v-if="member.institution" class="text-sm text-gray-500 mt-0.5">
          {{ member.institution }}
        </p>
        <p v-if="member.division" class="text-xs text-gray-400 mt-0.5">
          Divisi: {{ member.division }}
        </p>
        <div class="flex gap-4 mt-3">
          <div class="text-center">
            <p class="text-lg font-bold text-primary-500">
              {{ totalProjects }}
            </p>
            <p class="text-xs text-gray-400">Proyek</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold text-blue-500">
              {{ totalTasks }}
            </p>
            <p class="text-xs text-gray-400">Task</p>
          </div>
        </div>
      </div>
      <div v-if="isAdmin" class="flex-shrink-0 flex flex-col gap-1">
        <UButton
          icon="i-lucide-pencil"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="$emit('edit', member)"
        />
        <UButton
          icon="i-lucide-trash-2"
          size="xs"
          variant="ghost"
          color="error"
          @click="$emit('delete', member.id)"
        />
      </div>
    </div>
    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <NuxtLink :to="detailLink">
        <UButton
          variant="soft"
          color="primary"
          size="sm"
          icon="i-lucide-eye"
          block
        >
          Lihat Detail
        </UButton>
      </NuxtLink>
    </div>
  </UCard>
</template>
