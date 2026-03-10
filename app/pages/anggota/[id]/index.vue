<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();
const toast = useToast();
const memberId = Number(route.params.id);

const { data: member, refresh } = await useFetch(`/api/anggota/${memberId}`);

useSeoMeta({
  title: computed(() => `${member.value?.name ?? "Anggota"} — InPus`),
});

// ─── Modals ─────────────────────────────────────────────────────────────────
const showProyekModal = ref(false);
const showTaskModal = ref(false);
const editingProject = ref<any>(null);
const editingTask = ref<any>(null);
const selectedProjectId = ref<number | null>(null);
const loadingProyek = ref(false);
const loadingTask = ref(false);

// ─── Tab ────────────────────────────────────────────────────────────────────
const activeTab = ref("proyek");

// ─── Proyek CRUD ─────────────────────────────────────────────────────────────
const openAddProyek = () => {
  editingProject.value = null;
  showProyekModal.value = true;
};

const openEditProyek = (proj: any) => {
  editingProject.value = proj;
  showProyekModal.value = true;
};

const submitProyek = async (data: any) => {
  loadingProyek.value = true;
  try {
    if (editingProject.value) {
      await $fetch(`/api/proyek/${editingProject.value.id}`, {
        method: "PUT",
        body: data,
      });
      toast.add({ title: "Proyek diperbarui", color: "success" });
    } else {
      await $fetch("/api/proyek", {
        method: "POST",
        body: { ...data, memberId },
      });
      toast.add({ title: "Proyek ditambahkan", color: "success" });
    }
    showProyekModal.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Gagal menyimpan proyek", color: "error" });
  } finally {
    loadingProyek.value = false;
  }
};

const deleteProject = async (id: number) => {
  try {
    await $fetch(`/api/proyek/${id}`, { method: "DELETE" });
    toast.add({ title: "Proyek dihapus", color: "success" });
    await refresh();
  } catch {
    toast.add({ title: "Gagal menghapus proyek", color: "error" });
  }
};

// ─── Task CRUD ────────────────────────────────────────────────────────────────
const openAddTask = (projectId?: number) => {
  editingTask.value = null;
  selectedProjectId.value = projectId ?? null;
  showTaskModal.value = true;
};

const openEditTask = (task: any) => {
  editingTask.value = task;
  selectedProjectId.value = task.projectId;
  showTaskModal.value = true;
};

const openEditTaskById = (id: number) => {
  const task = tasks.value.find((t: any) => t.id === id);
  if (!task) return;
  openEditTask(task);
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
          projectId: data.projectId || selectedProjectId.value,
        },
      });
      toast.add({ title: "Task diperbarui", color: "success" });
    } else {
      await $fetch("/api/task", {
        method: "POST",
        body: {
          ...data,
          memberId,
          projectId: data.projectId || selectedProjectId.value,
        },
      });
      toast.add({ title: "Task ditambahkan", color: "success" });
    }
    showTaskModal.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Gagal menambahkan task", color: "error" });
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

// ─── Computed ────────────────────────────────────────────────────────────────
const projects = computed(() => member.value?.projects ?? []);
const tasks = computed(() => member.value?.tasks ?? []);
const projectsWithRoles = computed(() =>
  projects.value.map((proj: any) => ({
    ...proj,
    roles: Array.isArray(proj.roles) ? proj.roles : [],
  })),
);

const projectProgressMap = computed(() => {
  const map: Record<number, { total: number; done: number; percent: number }> =
    {};

  for (const project of projects.value) {
    const scopedTasks = tasks.value.filter(
      (t: any) => t.projectId === project.id,
    );
    const total = scopedTasks.length;
    const done = scopedTasks.filter(
      (t: any) => t.status === "terealisasi",
    ).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    map[project.id] = { total, done, percent };
  }

  return map;
});

const overallProgress = computed(() => {
  const total = tasks.value.length;
  const done = tasks.value.filter(
    (t: any) => t.status === "terealisasi",
  ).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, done, percent };
});

const typeLabels: Record<string, string> = {
  intern: "Magang",
  pkl: "PKL",
  pegawai: "Pegawai",
};
</script>

<template>
  <div>
    <div v-if="member">
      <!-- Page Header -->
      <div class="flex items-start gap-4 mb-6">
        <NuxtLink to="/anggota">
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            size="sm"
          />
        </NuxtLink>
        <div class="flex-1 flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ member.name }}
              </h1>
              <UBadge color="primary" variant="subtle" size="sm">
                {{ typeLabels[member.type] ?? member.type }}
              </UBadge>
            </div>
            <p v-if="member.institution" class="text-sm text-gray-500 mt-0.5">
              {{ member.institution }}
              <span v-if="member.division"> · {{ member.division }}</span>
            </p>
          </div>
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-folder-plus"
              size="sm"
              variant="outline"
              color="neutral"
              @click="openAddProyek"
            >
              Tambah Proyek
            </UButton>
            <UButton icon="i-lucide-plus" size="sm" @click="openAddTask()">
              Tambah Task
            </UButton>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <SharedStatsCard
          label="Proyek"
          :value="projects.length"
          icon="i-lucide-folder"
          color="primary"
        />
        <SharedStatsCard
          label="Task Terealisasi"
          :value="tasks.filter((t) => t.status === 'terealisasi').length"
          icon="i-lucide-check-circle"
          color="success"
        />
        <SharedStatsCard
          label="Task Hutang"
          :value="tasks.filter((t) => t.status === 'hutang').length"
          icon="i-lucide-alert-circle"
          color="error"
        />
      </div>

      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 dark:text-white">
              Progress Keseluruhan Semua Proyek
            </h2>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {{ overallProgress.done }} / {{ overallProgress.total }} ({{
                overallProgress.percent
              }}%)
            </span>
          </div>
        </template>
        <UProgress :model-value="overallProgress.percent" />
      </UCard>

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="[
          { label: `Proyek (${projects.length})`, value: 'proyek' },
          { label: `Task (${tasks.length})`, value: 'task' },
        ]"
        class="mb-6"
      />

      <!-- Proyek Tab -->
      <div v-if="activeTab === 'proyek'">
        <div
          v-if="projectsWithRoles.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div v-for="proj in projectsWithRoles" :key="proj.id">
            <ProyekCard
              :project="proj as any"
              :total-tasks="projectProgressMap[proj.id]?.total ?? 0"
              :done-tasks="projectProgressMap[proj.id]?.done ?? 0"
              :progress-percent="projectProgressMap[proj.id]?.percent ?? 0"
              is-admin
              @edit="openEditProyek(proj)"
              @delete="deleteProject"
            />

            <UButton
              class="mt-2"
              size="xs"
              variant="ghost"
              icon="i-lucide-eye"
              :to="`/anggota/${memberId}/proyek/${proj.id}`"
            >
              Lihat Task Proyek
            </UButton>

            <UButton
              class="mt-2 ml-2"
              size="xs"
              variant="ghost"
              icon="i-lucide-plus"
              @click="openAddTask(proj.id)"
            >
              Tambah Task untuk Proyek Ini
            </UButton>
          </div>
        </div>
        <SharedEmptyState
          v-else
          title="Belum ada proyek"
          description="Klik 'Tambah Proyek' untuk menambahkan proyek yang sedang dikerjakan"
          icon="i-lucide-folder-open"
        >
          <UButton class="mt-4" icon="i-lucide-plus" @click="openAddProyek">
            Tambah Proyek
          </UButton>
        </SharedEmptyState>
      </div>

      <!-- Task Tab -->
      <div v-if="activeTab === 'task'">
        <p class="text-sm text-gray-500 mb-3">
          Menampilkan seluruh task dari semua proyek.
        </p>
        <div v-if="tasks.length > 0" class="space-y-3">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="{
              ...task,
              projectName: projectsWithRoles.find((p) => p.id === task.projectId)?.name,
            }"
            can-mark-status
            editable
            deletable
            show-project
            @mark-status="markTaskStatus"
            @edit="openEditTaskById"
            @delete="deleteTask"
          />
        </div>
        <SharedEmptyState
          v-else
          title="Belum ada task"
          description="Klik 'Tambah Task' untuk menambahkan rencana kerja minggu ini"
          icon="i-lucide-list-checks"
        >
          <UButton
            class="mt-4"
            icon="i-lucide-plus"
            :disabled="projects.length === 0"
            @click="openAddTask()"
          >
            Tambah Task
          </UButton>
          <p v-if="projects.length === 0" class="text-xs text-gray-400 mt-2">
            Tambahkan proyek terlebih dahulu
          </p>
        </SharedEmptyState>
      </div>
    </div>

    <!-- Proyek Modal -->
    <UModal
      v-model:open="showProyekModal"
      :title="editingProject ? 'Edit Proyek' : 'Tambah Proyek'"
    >
      <template #body>
        <ProyekForm
          :initial="editingProject"
          :loading="loadingProyek"
          @submit="submitProyek"
          @cancel="showProyekModal = false"
        />
      </template>
    </UModal>

    <!-- Task Modal -->
    <UModal
      v-model:open="showTaskModal"
      :title="editingTask ? 'Edit Task' : 'Tambah Task Minggu Ini'"
    >
      <template #body>
        <TaskForm
          :projects="projects"
          :initial="editingTask"
          :default-project-id="selectedProjectId ?? undefined"
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
