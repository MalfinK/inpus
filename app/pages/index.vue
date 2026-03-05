<script setup lang="ts">
definePageMeta({ layout: "default" });

useSeoMeta({
  title: "Dashboard — Sistem Pendataan Magang & PKL",
  description: "Pantau progress magang dan PKL di kantor secara real-time",
});

const { data: laporan, pending } = await useFetch("/api/laporan");
const { data: allTasks, pending: pendingTasks } = await useFetch("/api/task");

const stats = computed(() => ({
  members: laporan.value?.totals?.members ?? 0,
  projects: laporan.value?.totals?.projects ?? 0,
  tasks: laporan.value?.totals?.tasks ?? 0,
  terealisasi: laporan.value?.totals?.terealisasi ?? 0,
  hutang: laporan.value?.totals?.hutang ?? 0,
  pendingCount: laporan.value?.totals?.pending ?? 0,
}));

const chartData = computed(() =>
  (laporan.value?.members ?? [])
    .filter((m: any) => m.tasks.total > 0)
    .map((m: any) => ({
      name: m.member.name.split(" ")[0],
      terealisasi: m.tasks.terealisasi,
      hutang: m.tasks.hutang,
      pending: m.tasks.pending,
    })),
);

const roles = computed(() => ({
  frontend: laporan.value?.roles?.frontend ?? 0,
  backend: laporan.value?.roles?.backend ?? 0,
  uiux: laporan.value?.roles?.["ui-ux"] ?? 0,
  tl: laporan.value?.roles?.tl ?? 0,
  sa: laporan.value?.roles?.sa ?? 0,
}));

const ganttTasks = computed(() => (allTasks.value ?? []) as any[]);
</script>

<template>
  <div>
    <SharedPageHeader
      title="Dashboard Pendataan"
      description="Pantau capaian magang dan PKL secara keseluruhan"
    >
      <NuxtLink to="/anggota">
        <UButton icon="i-lucide-plus" size="sm"> Isi Data Saya </UButton>
      </NuxtLink>
    </SharedPageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <template v-if="!pending">
        <SharedStatsCard
          label="Anggota"
          :value="stats.members"
          icon="i-lucide-users"
          color="primary"
        />
        <SharedStatsCard
          label="Proyek"
          :value="stats.projects"
          icon="i-lucide-folder-open"
          color="info"
        />
        <SharedStatsCard
          label="Total Task"
          :value="stats.tasks"
          icon="i-lucide-list-checks"
          color="neutral"
        />
        <SharedStatsCard
          label="Terealisasi"
          :value="stats.terealisasi"
          icon="i-lucide-check-circle"
          color="success"
        />
        <SharedStatsCard
          label="Hutang"
          :value="stats.hutang"
          icon="i-lucide-alert-circle"
          color="error"
        />
        <SharedStatsCard
          label="Pending"
          :value="stats.pendingCount"
          icon="i-lucide-clock"
          color="warning"
        />
      </template>
      <template v-else>
        <USkeleton v-for="i in 6" :key="i" class="h-24 rounded-xl" />
      </template>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-bar-chart-2"
              class="w-5 h-5 text-primary-500"
            />
            <h2 class="font-semibold text-gray-900 dark:text-white">
              Capaian Task per Anggota
            </h2>
          </div>
        </template>
        <div v-if="!pending">
          <ChartsChartCapaian v-if="chartData.length > 0" :data="chartData" />
          <SharedEmptyState
            v-else
            title="Belum ada data task"
            description="Task akan muncul setelah anggota mengisi data"
            icon="i-lucide-bar-chart-2"
          />
        </div>
        <USkeleton v-else class="h-80" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-pie-chart" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold text-gray-900 dark:text-white">
              Distribusi Status
            </h2>
          </div>
        </template>
        <div v-if="!pending">
          <ChartsChartStatusDonut
            v-if="stats.tasks > 0"
            :terealisasi="stats.terealisasi"
            :hutang="stats.hutang"
            :pending="stats.pendingCount"
          />
          <SharedEmptyState
            v-else
            title="Belum ada data"
            icon="i-lucide-pie-chart"
          />
        </div>
        <USkeleton v-else class="h-72" />
      </UCard>
    </div>

    <!-- Gantt Mingguan -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-chart-no-axes-gantt"
            class="w-5 h-5 text-primary-500"
          />
          <h2 class="font-semibold text-gray-900 dark:text-white">
            Gantt Chart Mingguan
          </h2>
        </div>
      </template>
      <div v-if="!pendingTasks && ganttTasks.length > 0">
        <ChartsChartGanttMingguan :tasks="ganttTasks" />
      </div>
      <SharedEmptyState
        v-else-if="!pendingTasks"
        title="Belum ada data task"
        description="Task mingguan akan tampil di sini setelah diinput"
        icon="i-lucide-chart-no-axes-gantt"
      />
      <USkeleton v-else class="h-[26rem]" />
    </UCard>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold text-gray-900 dark:text-white">
              Distribusi Peran
            </h2>
          </div>
        </template>
        <div v-if="!pending">
          <ChartsChartPeran
            v-if="
              roles.frontend +
                roles.backend +
                roles.uiux +
                roles.tl +
                roles.sa >
              0
            "
            :frontend="roles.frontend"
            :backend="roles.backend"
            :uiux="roles.uiux"
            :tl="roles.tl"
            :sa="roles.sa"
          />
          <SharedEmptyState
            v-else
            title="Belum ada data"
            icon="i-lucide-layers"
          />
        </div>
        <USkeleton v-else class="h-64" />
      </UCard>

      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 dark:text-white">
            Daftar Anggota
          </h2>
          <NuxtLink to="/anggota">
            <UButton
              variant="ghost"
              color="primary"
              size="sm"
              trailing-icon="i-lucide-arrow-right"
            >
              Lihat Semua
            </UButton>
          </NuxtLink>
        </div>
        <div
          v-if="!pending && laporan?.members?.length"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <AnggotaCard
            v-for="item in laporan.members.slice(0, 4)"
            :key="item.member.id"
            :member="{
              ...item.member,
              projects: Array(item.projects.total).fill({}),
              tasks: Array(item.tasks.total).fill({}),
            }"
          />
        </div>
        <SharedEmptyState
          v-else-if="!pending"
          title="Belum ada anggota"
          description="Admin akan menambahkan anggota magang/PKL"
          icon="i-lucide-users"
        />
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <USkeleton v-for="i in 4" :key="i" class="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
