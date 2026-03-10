<script setup lang="ts">
definePageMeta({ layout: "default" });

useSeoMeta({ title: "Pilih Anggota — InPus" });

const { data: members, pending } = await useFetch("/api/anggota");

const selectedId = ref<number | null>(null);

const options = computed(() =>
  (members.value ?? []).map((m: any) => ({
    label: `${m.name}${m.institution ? ` — ${m.institution}` : ""}`,
    value: m.id,
  })),
);

const onSelect = () => {
  if (selectedId.value) {
    navigateTo(`/anggota/${selectedId.value}`);
  }
};
</script>

<template>
  <div class="max-w-lg mx-auto pt-12">
    <div class="text-center mb-8">
      <div
        class="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4"
      >
        <UIcon name="i-lucide-user-circle" class="w-8 h-8 text-primary-500" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Siapa Kamu?
      </h1>
      <p class="text-gray-500 mt-2">
        Pilih namamu dari daftar untuk mulai mengisi data proyek dan task
      </p>
    </div>

    <UCard>
      <div class="space-y-4">
        <UFormField label="Pilih Nama">
          <USelectMenu
            v-model="selectedId"
            :items="options"
            value-key="value"
            label-key="label"
            placeholder="Cari dan pilih namamu..."
            searchable
            class="w-full"
            :loading="pending"
          />
        </UFormField>

        <UButton
          block
          :disabled="!selectedId"
          icon="i-lucide-arrow-right"
          trailing
          @click="onSelect"
        >
          Lanjutkan
        </UButton>
      </div>

      <template #footer>
        <p class="text-xs text-center text-gray-400">
          Namamu tidak ada dalam daftar? Hubungi admin untuk ditambahkan.
        </p>
      </template>
    </UCard>

    <div class="text-center mt-6">
      <NuxtLink
        to="/"
        class="text-sm text-gray-400 hover:text-primary-500 transition-colors"
      >
        ← Kembali ke Dashboard
      </NuxtLink>
    </div>
  </div>
</template>
