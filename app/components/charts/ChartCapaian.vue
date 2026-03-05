<script setup lang="ts">
import type { EChartsOption } from "echarts";

const props = defineProps<{
  data: Array<{
    name: string;
    terealisasi: number;
    hutang: number;
    pending: number;
  }>;
}>();

const colorMode = useColorMode();

const option = computed<EChartsOption>(() => {
  const isDark = colorMode.value === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const bgColor = isDark ? "#1e293b" : "#ffffff";

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: bgColor,
      borderColor: isDark ? "#334155" : "#e2e8f0",
      textStyle: { color: isDark ? "#f1f5f9" : "#0f172a" },
    },
    legend: {
      data: ["Terealisasi", "Hutang", "Pending"],
      textStyle: { color: textColor },
      bottom: 0,
    },
    grid: { left: 16, right: 16, bottom: 48, top: 16, containLabel: true },
    xAxis: {
      type: "category",
      data: props.data.map((d) => d.name),
      axisLabel: {
        color: textColor,
        interval: 0,
        rotate: props.data.length > 5 ? 30 : 0,
        fontSize: 11,
      },
      axisLine: { lineStyle: { color: isDark ? "#334155" : "#e2e8f0" } },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: isDark ? "#1e293b" : "#f1f5f9" } },
    },
    series: [
      {
        name: "Terealisasi",
        type: "bar",
        stack: "total",
        data: props.data.map((d) => d.terealisasi),
        itemStyle: { color: "#22c55e", borderRadius: [0, 0, 0, 0] },
      },
      {
        name: "Hutang",
        type: "bar",
        stack: "total",
        data: props.data.map((d) => d.hutang),
        itemStyle: { color: "#ef4444", borderRadius: [0, 0, 0, 0] },
      },
      {
        name: "Pending",
        type: "bar",
        stack: "total",
        data: props.data.map((d) => d.pending),
        itemStyle: { color: "#f59e0b", borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
});
</script>

<template>
  <div class="w-full h-80">
    <ClientOnly>
      <VChart class="w-full h-full" :option="option" autoresize />
      <template #fallback>
        <div class="flex items-center justify-center h-full">
          <USkeleton class="w-full h-full rounded-xl" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
