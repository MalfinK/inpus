<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth" });
useSeoMeta({ title: "Manajemen Anggota — InPus" });

const toast = useToast();
const { data: members, pending, refresh } = await useFetch("/api/anggota");

const showModal = ref(false);
const editingMember = ref<any>(null);
const deleteTarget = ref<any>(null);
const showConfirm = ref(false);
const loadingForm = ref(false);
const loadingDelete = ref(false);
const search = ref("");

const filtered = computed(() => {
  if (!search.value.trim()) return members.value ?? [];
  const q = search.value.toLowerCase();
  return (members.value ?? []).filter(
    (m: any) =>
      m.name.toLowerCase().includes(q) ||
      m.institution?.toLowerCase().includes(q) ||
      m.division?.toLowerCase().includes(q),
  );
});

const openAdd = () => {
  editingMember.value = null;
  showModal.value = true;
};

const openEdit = (member: any) => {
  editingMember.value = member;
  showModal.value = true;
};

const openDelete = (member: any) => {
  deleteTarget.value = member;
  showConfirm.value = true;
};

const submitForm = async (data: any) => {
  loadingForm.value = true;
  try {
    if (editingMember.value) {
      await $fetch(`/api/anggota/${editingMember.value.id}`, {
        method: "PUT",
        body: data,
      });
      toast.add({ title: "Anggota diperbarui", color: "success" });
    } else {
      await $fetch("/api/anggota", { method: "POST", body: data });
      toast.add({ title: "Anggota ditambahkan", color: "success" });
    }
    showModal.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Gagal menyimpan data anggota", color: "error" });
  } finally {
    loadingForm.value = false;
  }
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  loadingDelete.value = true;
  try {
    await $fetch(`/api/anggota/${deleteTarget.value.id}`, { method: "DELETE" });
    toast.add({ title: "Anggota dihapus", color: "success" });
    showConfirm.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch {
    toast.add({ title: "Gagal menghapus anggota", color: "error" });
  } finally {
    loadingDelete.value = false;
  }
};

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
</script>

<template>
  <div>
    <SharedPageHeader
      title="Manajemen Anggota"
      description="Kelola data anggota magang, PKL, dan pegawai"
    >
      <UButton icon="i-lucide-user-plus" @click="openAdd">
        Tambah Anggota
      </UButton>
    </SharedPageHeader>

    <!-- Search -->
    <div class="mb-4">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Cari nama, institusi, atau divisi..."
        class="max-w-sm"
      />
    </div>

    <!-- Cards Grid -->
    <div
      v-if="!pending && filtered.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <AnggotaCard
        v-for="member in filtered"
        :key="member.id"
        :member="member"
        is-admin
        @edit="openEdit"
        @delete="openDelete(member)"
      />
    </div>

    <SharedEmptyState
      v-else-if="!pending"
      title="Belum ada anggota"
      description="Klik 'Tambah Anggota' untuk mendaftarkan anggota baru"
      icon="i-lucide-users"
    >
      <UButton class="mt-4" icon="i-lucide-user-plus" @click="openAdd">
        Tambah Anggota
      </UButton>
    </SharedEmptyState>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <USkeleton v-for="i in 6" :key="i" class="h-48 rounded-xl" />
    </div>

    <!-- Add/Edit Modal -->
    <UModal
      v-model:open="showModal"
      :title="editingMember ? 'Edit Anggota' : 'Tambah Anggota Baru'"
      description="Isi data anggota lalu simpan perubahan."
    >
      <template #body>
        <AnggotaForm
          :initial="editingMember"
          :loading="loadingForm"
          @submit="submitForm"
          @cancel="showModal = false"
        />
      </template>
    </UModal>

    <!-- Confirm Delete -->
    <SharedConfirmModal
      v-model:open="showConfirm"
      title="Hapus Anggota"
      :description="`Yakin ingin menghapus ${deleteTarget?.name}? Semua proyek dan task-nya akan ikut terhapus.`"
      :loading="loadingDelete"
      @confirm="confirmDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>
