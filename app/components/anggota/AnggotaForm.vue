<script setup lang="ts">
import type { Member } from "../../../server/db/schema";

const props = defineProps<{
  initial?: Partial<Member>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<Member>];
  cancel: [];
}>();

const form = reactive({
  name: props.initial?.name ?? "",
  nimNip: props.initial?.nimNip ?? "",
  type: props.initial?.type ?? "intern",
  division: props.initial?.division ?? "",
  phone: props.initial?.phone ?? "",
  institution: props.initial?.institution ?? "",
  startDate: props.initial?.startDate ?? "",
  endDate: props.initial?.endDate ?? "",
});

const typeOptions = [
  { label: "Magang", value: "intern" },
  { label: "PKL", value: "pkl" },
  { label: "Pegawai", value: "pegawai" },
];

const onSubmit = () => emit("submit", { ...form });
</script>

<template>
  <UForm :state="form" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nama Lengkap" name="name" required>
      <UInput
        v-model="form.name"
        placeholder="Contoh: Budi Santoso"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="NIM / NIP" name="nimNip">
        <UInput v-model="form.nimNip" placeholder="12345678" class="w-full" />
      </UFormField>

      <UFormField label="Tipe" name="type">
        <USelect
          v-model="form.type"
          :items="typeOptions"
          value-key="value"
          label-key="label"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Institusi / Kampus" name="institution">
        <UInput
          v-model="form.institution"
          placeholder="Universitas ..."
          class="w-full"
        />
      </UFormField>

      <UFormField label="Divisi" name="division">
        <UInput
          v-model="form.division"
          placeholder="Sistem Informasi"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField label="Nomor HP" name="phone">
      <UInput v-model="form.phone" placeholder="08xxxxxxxxxx" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Tanggal Mulai" name="startDate">
        <UInput v-model="form.startDate" type="date" class="w-full" />
      </UFormField>

      <UFormField label="Tanggal Selesai" name="endDate">
        <UInput v-model="form.endDate" type="date" class="w-full" />
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
      <UButton type="submit" :loading="loading"> Simpan </UButton>
    </div>
  </UForm>
</template>
