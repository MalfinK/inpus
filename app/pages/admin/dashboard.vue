<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth" });

useSeoMeta({ title: "Dashboard Admin — InPus" });

const { data: laporan, pending, refresh } = await useFetch("/api/laporan");
const {
  data: allTasks,
  pending: pendingTasks,
  refresh: refreshTasks,
} = await useFetch("/api/task");

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
      name: m.member.name.split(" ").slice(0, 2).join(" "),
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

const refreshAll = async () => {
  await Promise.all([refresh(), refreshTasks()]);
};
</script>

<template>
  <div>
    <SharedPageHeader
      title="Dashboard"
      description="Ringkasan capaian seluruh anggota magang dan PKL"
    >
      <UButton
        icon="i-lucide-refresh-cw"
        variant="ghost"
        color="neutral"
        size="sm"
        :loading="pending || pendingTasks"
        @click="refreshAll()"
      />
    </SharedPageHeader>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <UCard class="xl:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-bar-chart-2"
              class="w-5 h-5 text-primary-500"
            />
            <h2 class="font-semibold">Capaian Task per Anggota</h2>
          </div>
        </template>
        <ChartsChartCapaian
          v-if="!pending && chartData.length"
          :data="chartData"
        />
        <SharedEmptyState
          v-else-if="!pending"
          title="Belum ada data"
          icon="i-lucide-bar-chart-2"
        />
        <USkeleton v-else class="h-80" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-pie-chart" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold">Status Task</h2>
          </div>
        </template>
        <ChartsChartStatusDonut
          v-if="!pending && stats.tasks > 0"
          :terealisasi="stats.terealisasi"
          :hutang="stats.hutang"
          :pending="stats.pendingCount"
        />
        <SharedEmptyState
          v-else-if="!pending"
          title="Belum ada data"
          icon="i-lucide-pie-chart"
        />
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
          <h2 class="font-semibold">Gantt Chart Mingguan</h2>
        </div>
      </template>
      <ChartsChartGanttMingguan
        v-if="!pendingTasks && ganttTasks.length > 0"
        :tasks="ganttTasks"
      />
      <SharedEmptyState
        v-else-if="!pendingTasks"
        title="Belum ada data"
        icon="i-lucide-chart-no-axes-gantt"
      />
      <USkeleton v-else class="h-[26rem]" />
    </UCard>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold">Distribusi Peran</h2>
          </div>
        </template>
        <ChartsChartPeran
          v-if="
            !pending &&
            roles.frontend + roles.backend + roles.uiux + roles.tl + roles.sa >
              0
          "
          :frontend="roles.frontend"
          :backend="roles.backend"
          :uiux="roles.uiux"
          :tl="roles.tl"
          :sa="roles.sa"
        />
        <SharedEmptyState
          v-else-if="!pending"
          title="Belum ada data"
          icon="i-lucide-layers"
        />
        <USkeleton v-else class="h-64" />
      </UCard>

      <!-- Per-member breakdown -->
      <div class="xl:col-span-2">
        <h2 class="font-semibold mb-4">Rekap per Anggota</h2>
        <div v-if="!pending && laporan?.members?.length" class="space-y-3">
          <div
            v-for="item in laporan.members"
            :key="item.member.id"
            class="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <UAvatar size="sm">
              <span class="text-xs font-bold">
                {{
                  item.member.name
                    .split(" ")
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join("")
                }}
              </span>
            </UAvatar>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ item.member.name }}</p>
              <p class="text-xs text-gray-400">
                {{ item.projects.total }} proyek · {{ item.tasks.total }} task
              </p>
            </div>
            <div class="flex gap-2 text-xs">
              <span
                class="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 font-medium"
              >
                ✓ {{ item.tasks.terealisasi }}
              </span>
              <span
                class="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-medium"
              >
                ⚠ {{ item.tasks.hutang }}
              </span>
            </div>
            <NuxtLink :to="`/admin/anggota/${item.member.id}`">
              <UButton
                icon="i-lucide-eye"
                size="xs"
                variant="ghost"
                color="neutral"
              />
            </NuxtLink>
          </div>
        </div>
        <SharedEmptyState
          v-else-if="!pending"
          title="Belum ada data anggota"
          description="Tambahkan anggota di menu Anggota"
          icon="i-lucide-users"
        />
        <div v-else class="space-y-3">
          <USkeleton v-for="i in 4" :key="i" class="h-16 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
