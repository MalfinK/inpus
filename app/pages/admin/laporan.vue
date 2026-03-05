<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth" });
useSeoMeta({ title: "Laporan — InPus" });

const { data: laporan, pending } = await useFetch("/api/laporan");

const search = ref("");
const filterType = ref("all");

const typeOptions = [
  { label: "Semua Tipe", value: "all" },
  { label: "Magang", value: "intern" },
  { label: "PKL", value: "pkl" },
  { label: "Pegawai", value: "pegawai" },
];

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

const filteredMembers = computed(() => {
  let list = laporan.value?.members ?? [];
  if (filterType.value !== "all") {
    list = list.filter((m: any) => m.member.type === filterType.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (m: any) =>
        m.member.name.toLowerCase().includes(q) ||
        m.member.institution?.toLowerCase().includes(q),
    );
  }
  return list;
});

const progressPercent = (terealisasi: number, total: number) => {
  if (!total) return 0;
  return Math.round((terealisasi / total) * 100);
};

const columns = [
  { key: "name", label: "Nama" },
  { key: "type", label: "Tipe" },
  { key: "institution", label: "Institusi" },
  { key: "projects", label: "Proyek" },
  { key: "tasks", label: "Task" },
  { key: "terealisasi", label: "Terealisasi" },
  { key: "hutang", label: "Hutang" },
  { key: "progress", label: "Progress" },
  { key: "action", label: "" },
];
</script>

<template>
  <div>
    <SharedPageHeader
      title="Laporan Capaian"
      description="Rekapitulasi capaian per anggota"
    />

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <SharedStatsCard
        label="Total Anggota"
        :value="laporan?.totals?.members ?? 0"
        icon="i-lucide-users"
        color="primary"
      />
      <SharedStatsCard
        label="Total Task"
        :value="laporan?.totals?.tasks ?? 0"
        icon="i-lucide-list-checks"
        color="neutral"
      />
      <SharedStatsCard
        label="Terealisasi"
        :value="laporan?.totals?.terealisasi ?? 0"
        icon="i-lucide-check-circle"
        color="success"
      />
      <SharedStatsCard
        label="Hutang"
        :value="laporan?.totals?.hutang ?? 0"
        icon="i-lucide-alert-circle"
        color="error"
      />
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Cari nama atau institusi..."
        class="w-full max-w-xs"
      />
      <USelect
        v-model="filterType"
        :items="typeOptions"
        value-key="value"
        label-key="label"
        class="w-40"
      />
    </div>

    <!-- Table -->
    <UCard :ui="{ body: 'p-0' }">
      <div v-if="!pending && filteredMembers.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
          >
            <tr>
              <th
                class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
              >
                Nama
              </th>
              <th
                class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
              >
                Tipe
              </th>
              <th
                class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
              >
                Institusi
              </th>
              <th
                class="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Proyek
              </th>
              <th
                class="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Task
              </th>
              <th class="px-4 py-3 text-center font-medium text-green-500">
                Terealisasi
              </th>
              <th class="px-4 py-3 text-center font-medium text-red-500">
                Hutang
              </th>
              <th
                class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 w-40"
              >
                Progress
              </th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="item in filteredMembers"
              :key="item.member.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td class="px-4 py-3 font-medium">{{ item.member.name }}</td>
              <td class="px-4 py-3">
                <UBadge
                  :color="typeColors[item.member.type] as any"
                  variant="subtle"
                  size="xs"
                >
                  {{ typeLabels[item.member.type] ?? item.member.type }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">
                {{ item.member.institution ?? "—" }}
              </td>
              <td class="px-4 py-3 text-center">{{ item.projects.total }}</td>
              <td class="px-4 py-3 text-center">{{ item.tasks.total }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  class="inline-flex items-center gap-1 text-green-600 font-semibold"
                >
                  <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                  {{ item.tasks.terealisasi }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  class="inline-flex items-center gap-1 text-red-500 font-semibold"
                >
                  <UIcon name="i-lucide-alert-circle" class="w-3.5 h-3.5" />
                  {{ item.tasks.hutang }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div
                    class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full bg-green-500 transition-all"
                      :style="`width: ${progressPercent(item.tasks.terealisasi, item.tasks.total)}%`"
                    />
                  </div>
                  <span
                    class="text-xs font-medium text-gray-500 w-8 text-right"
                  >
                    {{
                      progressPercent(item.tasks.terealisasi, item.tasks.total)
                    }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <NuxtLink :to="`/admin/anggota/${item.member.id}`">
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-eye"
                  />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <SharedEmptyState
        v-else-if="!pending"
        title="Tidak ada data yang cocok"
        icon="i-lucide-file-search"
      />
      <div v-else class="p-6 space-y-3">
        <USkeleton v-for="i in 5" :key="i" class="h-12 rounded-lg" />
      </div>
    </UCard>
  </div>
</template>
