<script setup lang="ts">
import type { EChartsOption } from "echarts";

type GanttTask = {
  id: number;
  title: string;
  weekStart: string;
  weekEnd: string;
  status: "pending" | "terealisasi" | "hutang" | string;
  memberName?: string | null;
  projectName?: string | null;
};

const props = defineProps<{
  tasks: GanttTask[];
}>();

const colorMode = useColorMode();

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  terealisasi: "#22c55e",
  hutang: "#ef4444",
};

const normalizedTasks = computed(() => {
  return [...(props.tasks ?? [])]
    .filter((task) => task.weekStart && task.weekEnd)
    .sort(
      (a, b) =>
        new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime(),
    )
    .slice(0, 30);
});

const categories = computed(() => {
  return normalizedTasks.value.map((task) => {
    const owner = task.memberName ? ` · ${task.memberName}` : "";
    const title =
      task.title.length > 28 ? `${task.title.slice(0, 28)}...` : task.title;
    return `${title}${owner}`;
  });
});

const option = computed<EChartsOption>(() => {
  const isDark = colorMode.value === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const axisColor = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipText = isDark ? "#f1f5f9" : "#0f172a";

  const seriesData = normalizedTasks.value.map((task, index) => {
    const start = new Date(task.weekStart).getTime();
    const endRaw = new Date(task.weekEnd).getTime();
    const end = Number.isFinite(endRaw) ? endRaw + 24 * 60 * 60 * 1000 : endRaw;

    return {
      value: [index, start, end],
      itemStyle: {
        color: statusColor[task.status] ?? "#3b82f6",
        borderRadius: 6,
      },
      task,
    };
  });

  return {
    grid: {
      top: 12,
      right: 20,
      bottom: 24,
      left: 180,
      containLabel: false,
    },
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBg,
      borderColor: axisColor,
      textStyle: { color: tooltipText },
      formatter: (params: any) => {
        const task = params?.data?.task as GanttTask | undefined;
        if (!task) return "";
        const owner = task.memberName ? `<br/>Anggota: ${task.memberName}` : "";
        const project = task.projectName
          ? `<br/>Proyek: ${task.projectName}`
          : "";
        return `<b>${task.title}</b>${owner}${project}<br/>Periode: ${task.weekStart} s/d ${task.weekEnd}<br/>Status: ${task.status}`;
      },
    },
    xAxis: {
      type: "time",
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: { lineStyle: { color: isDark ? "#1e293b" : "#f1f5f9" } },
    },
    yAxis: {
      type: "category",
      data: categories.value,
      axisLabel: {
        color: textColor,
        width: 170,
        overflow: "truncate",
      },
      axisLine: { lineStyle: { color: axisColor } },
    },
    series: [
      {
        type: "custom",
        renderItem(params: any, api: any) {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const barHeight = api.size([0, 1])[1] * 0.6;
          const width = Math.max(2, end[0] - start[0]);

          return {
            type: "rect",
            shape: {
              x: start[0],
              y: start[1] - barHeight / 2,
              width,
              height: barHeight,
              r: 6,
            },
            style: api.style(),
          };
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: seriesData,
      },
    ],
  };
});
</script>

<template>
  <div class="w-full h-[26rem]">
    <ClientOnly>
      <VChart class="w-full h-full" :option="option" autoresize />
      <template #fallback>
        <USkeleton class="w-full h-full rounded-xl" />
      </template>
    </ClientOnly>
  </div>
</template>
