<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();
const toast = useToast();

const memberId = Number(route.params.id);
const projectId = Number(route.params.projectId);

const { data: member, refresh } = await useFetch(`/api/anggota/${memberId}`);

const project = computed(() => {
  const projects = member.value?.projects ?? [];
  return projects.find((p: any) => p.id === projectId) ?? null;
});

const projectView = computed(() => {
  if (!project.value) return null;
  return {
    ...project.value,
    roles: Array.isArray((project.value as any).roles)
      ? ((project.value as any).roles as string[])
      : [],
  };
});

const tasks = computed(() => {
  const allTasks = member.value?.tasks ?? [];
  return allTasks.filter((t: any) => t.projectId === projectId);
});

const progress = computed(() => {
  const total = tasks.value.length;
  const terealisasi = tasks.value.filter(
    (t: any) => t.status === "terealisasi",
  ).length;
  const hutang = tasks.value.filter((t: any) => t.status === "hutang").length;
  const pending = tasks.value.filter((t: any) => t.status === "pending").length;
  const percent = total > 0 ? Math.round((terealisasi / total) * 100) : 0;

  return { total, terealisasi, hutang, pending, percent };
});

const taskFormProjects = computed(() => [
  {
    id: projectId,
    name: projectView.value?.name ?? "Proyek",
  },
]);

const roleLabels: Record<string, string> = {
  "frontend": "Frontend",
  "backend": "Backend",
  "ui-ux": "UI/UX",
  "tl": "Team Leader (TL)",
  "sa": "System Analyst (SA)",
};

const showTaskModal = ref(false);
const editingTask = ref<any>(null);
const loadingTask = ref(false);

const openAddTask = () => {
  editingTask.value = null;
  showTaskModal.value = true;
};

const openEditTaskById = (id: number) => {
  const task = tasks.value.find((t: any) => t.id === id);
  if (!task) return;
  editingTask.value = task;
  showTaskModal.value = true;
};

const markTaskStatus = async (
  id: number,
  status: "terealisasi" | "pending" | "hutang",
) => {
  try {
    await $fetch(`/api/task/${id}`, {
      method: "PUT",
      body: { status },
    });
    toast.add({ title: "Status task diperbarui", color: "success" });
    await refresh();
  } catch {
    toast.add({ title: "Gagal memperbarui status task", color: "error" });
  }
};

const submitTask = async (data: any) => {
  loadingTask.value = true;
  try {
    if (editingTask.value) {
      await $fetch(`/api/task/${editingTask.value.id}`, {
        method: "PUT",
        body: {
          title: data.title,
          description: data.description,
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          projectId,
        },
      });
      toast.add({ title: "Task diperbarui", color: "success" });
    } else {
      await $fetch("/api/task", {
        method: "POST",
        body: {
          title: data.title,
          description: data.description,
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          memberId,
          projectId,
        },
      });
      toast.add({ title: "Task ditambahkan", color: "success" });
    }

    showTaskModal.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Gagal menyimpan task", color: "error" });
  } finally {
    loadingTask.value = false;
  }
};

const deleteTask = async (id: number) => {
  try {
    await $fetch(`/api/task/${id}`, { method: "DELETE" });
    toast.add({ title: "Task dihapus", color: "success" });
    await refresh();
  } catch {
    toast.add({ title: "Gagal menghapus task", color: "error" });
  }
};

useSeoMeta({
  title: computed(() =>
    project.value?.name ? `${project.value.name} — Task Proyek` : "Task Proyek",
  ),
});
</script>

<template>
  <div>
    <div v-if="projectView" class="space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <NuxtLink :to="`/anggota/${memberId}`">
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              color="neutral"
              size="sm"
            />
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ projectView.name }}
            </h1>
            <p v-if="projectView.description" class="text-sm text-gray-500 mt-1">
              {{ projectView.description }}
            </p>
            <div v-if="projectView.roles.length" class="flex flex-wrap gap-2 mt-2">
              <UBadge
                v-for="role in projectView.roles"
                :key="role"
                variant="outline"
                color="neutral"
                size="xs"
              >
                {{ roleLabels[role] ?? role }}
              </UBadge>
            </div>
          </div>
        </div>

        <UButton icon="i-lucide-plus" size="sm" @click="openAddTask">
          Tambah Task
        </UButton>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SharedStatsCard
          label="Total Task"
          :value="progress.total"
          icon="i-lucide-list-checks"
          color="neutral"
        />
        <SharedStatsCard
          label="Terealisasi"
          :value="progress.terealisasi"
          icon="i-lucide-check-circle"
          color="success"
        />
        <SharedStatsCard
          label="Pending"
          :value="progress.pending"
          icon="i-lucide-clock"
          color="warning"
        />
        <SharedStatsCard
          label="Hutang"
          :value="progress.hutang"
          icon="i-lucide-alert-circle"
          color="error"
        />
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">
              Progress Proyek
            </h2>
            <span
              class="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ progress.terealisasi }} / {{ progress.total }} ({{
                progress.percent
              }}%)
            </span>
          </div>
        </template>
        <UProgress :model-value="progress.percent" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-list" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold">
              Task dalam Proyek
            </h2>
          </div>
        </template>

        <div v-if="tasks.length > 0" class="space-y-3">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            can-mark-status
            editable
            deletable
            @mark-status="markTaskStatus"
            @edit="openEditTaskById"
            @delete="deleteTask"
          />
        </div>

        <SharedEmptyState
          v-else
          title="Belum ada task"
          description="Klik tombol 'Tambah Task' untuk mulai mengisi task proyek ini"
          icon="i-lucide-list-checks"
        >
          <UButton class="mt-4" icon="i-lucide-plus" @click="openAddTask">
            Tambah Task
          </UButton>
        </SharedEmptyState>
      </UCard>
    </div>

    <SharedEmptyState
      v-else
      title="Proyek tidak ditemukan"
      description="Periksa kembali proyek yang dipilih"
      icon="i-lucide-folder-x"
    />

    <UModal
      v-model:open="showTaskModal"
      :title="editingTask ? 'Edit Task' : 'Tambah Task Proyek'"
    >
      <template #body>
        <TaskForm
          :projects="taskFormProjects"
          :initial="editingTask"
          :default-project-id="projectId"
          :loading="loadingTask"
          @submit="submitTask"
          @cancel="
            showTaskModal = false;
            editingTask = null;
          "
        />
      </template>
    </UModal>
  </div>
</template>
