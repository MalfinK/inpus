<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth" });

const route = useRoute();
const toast = useToast();
const memberId = Number(route.params.id);

const { data: member, refresh } = await useFetch(`/api/anggota/${memberId}`);

useSeoMeta({
  title: computed(() => `${member.value?.name ?? "Anggota"} — Admin InPus`),
});

// ─── Mark task status ─────────────────────────────────────────────────────────
const markingId = ref<number | null>(null);
const showNoteModal = ref(false);
const pendingMark = ref<{
  id: number;
  status: "terealisasi" | "hutang" | "pending";
} | null>(null);
const adminNote = ref("");

const openMark = (id: number, status: "terealisasi" | "hutang" | "pending") => {
  pendingMark.value = { id, status };
  adminNote.value = "";
  showNoteModal.value = true;
};

const confirmMark = async () => {
  if (!pendingMark.value) return;
  markingId.value = pendingMark.value.id;
  try {
    await $fetch(`/api/task/${pendingMark.value.id}`, {
      method: "PUT",
      body: {
        status: pendingMark.value.status,
        adminNote: adminNote.value || null,
      },
    });
    toast.add({ title: "Status task diperbarui", color: "success" });
    showNoteModal.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Gagal memperbarui status task", color: "error" });
  } finally {
    markingId.value = null;
    pendingMark.value = null;
  }
};

const statusLabels: Record<string, string> = {
  terealisasi: "Terealisasi",
  hutang: "Hutang",
  pending: "Pending",
};

const typeLabels: Record<string, string> = {
  intern: "Magang",
  pkl: "PKL",
  pegawai: "Pegawai",
};

const roleLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  "ui-ux": "UI/UX",
  tl: "Team Leader (TL)",
  sa: "System Analyst (SA)",
};
const projects = computed(() => member.value?.projects ?? []);
const tasks = computed(() => member.value?.tasks ?? []);
</script>

<template>
  <div v-if="member">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/anggota">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
        />
      </NuxtLink>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold">{{ member.name }}</h1>
          <UBadge color="primary" variant="subtle" size="sm">
            {{ typeLabels[member.type] ?? member.type }}
          </UBadge>
        </div>
        <p v-if="member.institution" class="text-sm text-gray-500">
          {{ member.institution
          }}<span v-if="member.division"> · {{ member.division }}</span>
        </p>
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
        label="Terealisasi"
        :value="tasks.filter((t) => t.status === 'terealisasi').length"
        icon="i-lucide-check-circle"
        color="success"
      />
      <SharedStatsCard
        label="Hutang"
        :value="tasks.filter((t) => t.status === 'hutang').length"
        icon="i-lucide-alert-circle"
        color="error"
      />
    </div>

    <!-- Projects & Tasks -->
    <div class="space-y-6">
      <div v-for="proj in projects" :key="proj.id">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-folder" class="w-4 h-4 text-primary-500" />
          <h2 class="font-semibold">{{ proj.name }}</h2>
          <SharedStatusBadge :status="proj.status" />
          <div class="flex gap-1 ml-1">
            <UBadge
              v-for="role in proj.roles"
              :key="role"
              variant="outline"
              color="neutral"
              size="xs"
              >{{ roleLabels[role] ?? role }}</UBadge
            >
          </div>
        </div>

        <div class="space-y-2 ml-6">
          <div
            v-for="task in tasks.filter((t) => t.projectId === proj.id)"
            :key="task.id"
          >
            <TaskCard
              :task="task"
              is-admin
              can-mark-status
              allow-hutang
              @mark-status="openMark"
              @delete="
                async (id) => {
                  await $fetch(`/api/task/${id}`, { method: 'DELETE' });
                  await refresh();
                }
              "
            />
          </div>
          <SharedEmptyState
            v-if="!tasks.filter((t) => t.projectId === proj.id).length"
            title="Belum ada task untuk proyek ini"
            icon="i-lucide-list"
          />
        </div>
      </div>

      <SharedEmptyState
        v-if="!projects.length"
        title="Anggota ini belum memiliki proyek"
        icon="i-lucide-folder-open"
      />
    </div>

    <!-- Note Modal when marking task -->
    <UModal v-model:open="showNoteModal" title="Tandai Status Task">
      <template #body>
        <div class="space-y-4 p-1">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Tandai sebagai
            <UBadge
              :color="
                pendingMark?.status === 'terealisasi'
                  ? 'success'
                  : pendingMark?.status === 'hutang'
                    ? 'error'
                    : 'warning'
              "
              variant="subtle"
            >
              {{ statusLabels[pendingMark?.status ?? "pending"] }}
            </UBadge>
          </p>
          <UFormField label="Catatan Admin (opsional)">
            <UTextarea
              v-model="adminNote"
              placeholder="Tambahkan catatan untuk anggota (opsional)..."
              :rows="3"
              class="w-full"
            />
          </UFormField>
          <div class="flex justify-end gap-3">
            <UButton
              variant="ghost"
              color="neutral"
              @click="showNoteModal = false"
              >Batal</UButton
            >
            <UButton :loading="!!markingId" @click="confirmMark"
              >Simpan</UButton
            >
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
