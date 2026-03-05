<script setup lang="ts">
const props = defineProps<{
  initial?: {
    name?: string;
    description?: string;
    roles?: string[];
    status?: string;
    startDate?: string;
    endDate?: string;
  };
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: any];
  cancel: [];
}>();

const form = reactive({
  name: props.initial?.name ?? "",
  description: props.initial?.description ?? "",
  roles: props.initial?.roles ?? ([] as string[]),
  status: props.initial?.status ?? "active",
  startDate: props.initial?.startDate ?? "",
  endDate: props.initial?.endDate ?? "",
});

const roleOptions = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "UI/UX", value: "ui-ux" },
  { label: "Team Leader (TL)", value: "tl" },
  { label: "System Analyst (SA)", value: "sa" },
];

const statusOptions = [
  { label: "Aktif", value: "active" },
  { label: "Selesai", value: "completed" },
  { label: "Ditunda", value: "on-hold" },
];

const toggleRole = (value: string) => {
  if (form.roles.includes(value)) {
    form.roles = form.roles.filter((r) => r !== value);
  } else {
    form.roles = [...form.roles, value];
  }
};

const onSubmit = () => emit("submit", { ...form });
</script>

<template>
  <UForm :state="form" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nama Proyek" name="name" required>
      <UInput
        v-model="form.name"
        placeholder="Contoh: Sistem Manajemen Aset"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Deskripsi" name="description">
      <UTextarea
        v-model="form.description"
        placeholder="Jelaskan proyek secara singkat..."
        :rows="3"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Peran dalam Proyek" name="roles">
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="opt in roleOptions"
          :key="opt.value"
          size="sm"
          :variant="form.roles.includes(opt.value) ? 'solid' : 'outline'"
          :color="form.roles.includes(opt.value) ? 'primary' : 'neutral'"
          type="button"
          @click="toggleRole(opt.value)"
        >
          {{ opt.label }}
        </UButton>
      </div>
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Status" name="status">
        <USelect
          v-model="form.status"
          :items="statusOptions"
          value-key="value"
          label-key="label"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Tanggal Mulai" name="startDate">
        <UInput v-model="form.startDate" type="date" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Tanggal Selesai (Estimasi)" name="endDate">
      <UInput v-model="form.endDate" type="date" class="w-full" />
    </UFormField>

    <div class="flex justify-end gap-3 pt-2">
      <UButton
        variant="ghost"
        color="neutral"
        type="button"
        @click="$emit('cancel')"
      >
        Batal
      </UButton>
      <UButton type="submit" :loading="loading"> Simpan </UButton>
    </div>
  </UForm>
</template>
