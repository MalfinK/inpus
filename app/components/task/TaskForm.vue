<script setup lang="ts">
const props = defineProps<{
  projects: Array<{ id: number; name: string }>;
  initial?: {
    projectId?: number;
    title?: string;
    description?: string;
    weekStart?: string;
    weekEnd?: string;
  };
  defaultProjectId?: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: any];
  cancel: [];
}>();

// Default to current week
const today = new Date();
const dayOfWeek = today.getDay();
const monday = new Date(today);
monday.setDate(today.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));
const friday = new Date(monday);
friday.setDate(monday.getDate() + 4);

const toDateStr = (d: Date) => d.toISOString().split("T")[0];

const form = reactive({
  projectId: props.initial?.projectId ?? props.defaultProjectId ?? 0,
  title: props.initial?.title ?? "",
  description: props.initial?.description ?? "",
  weekStart: props.initial?.weekStart ?? toDateStr(monday),
  weekEnd: props.initial?.weekEnd ?? toDateStr(friday),
});

const projectOptions = computed(() =>
  props.projects.map((p) => ({ label: p.name, value: p.id })),
);

const onSubmit = () => emit("submit", { ...form });
</script>

<template>
  <UForm :state="form" class="space-y-4" @submit="onSubmit">
    <UFormField
      v-if="!defaultProjectId"
      label="Proyek"
      name="projectId"
      required
    >
      <USelect
        v-model="form.projectId"
        :items="projectOptions"
        value-key="value"
        label-key="label"
        placeholder="Pilih proyek..."
        class="w-full"
      />
    </UFormField>

    <UFormField label="Judul Task" name="title" required>
      <UInput
        v-model="form.title"
        placeholder="Contoh: Implementasi halaman login"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Deskripsi" name="description">
      <UTextarea
        v-model="form.description"
        placeholder="Detail pekerjaan yang akan atau sudah dilakukan..."
        :rows="3"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Awal Minggu" name="weekStart" required>
        <UInput v-model="form.weekStart" type="date" class="w-full" />
      </UFormField>

      <UFormField label="Akhir Minggu" name="weekEnd" required>
        <UInput v-model="form.weekEnd" type="date" class="w-full" />
      </UFormField>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <UButton
        variant="ghost"
        color="neutral"
        type="button"
        @click="$emit('cancel')"
      >
        Batal
      </UButton>
      <UButton type="submit" :loading="loading"> Simpan Task </UButton>
    </div>
  </UForm>
</template>
