<script setup lang="ts">
import type { EChartsOption } from "echarts";

const props = defineProps<{
  frontend: number;
  backend: number;
  uiux: number;
  tl: number;
  sa: number;
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
    grid: { left: 16, right: 16, bottom: 16, top: 16, containLabel: true },
    xAxis: {
      type: "category",
      data: ["FE", "BE", "UI/UX", "TL", "SA"],
      axisLabel: { color: textColor, interval: 0 },
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
        type: "bar",
        barMaxWidth: 60,
        label: {
          show: true,
          position: "top",
          color: textColor,
          fontWeight: 600,
          formatter: "{c}",
        },
        data: [
          {
            value: props.frontend,
            itemStyle: { color: "#3b82f6", borderRadius: [6, 6, 0, 0] },
          },
          {
            value: props.backend,
            itemStyle: { color: "#8b5cf6", borderRadius: [6, 6, 0, 0] },
          },
          {
            value: props.uiux,
            itemStyle: { color: "#ec4899", borderRadius: [6, 6, 0, 0] },
          },
          {
            value: props.tl,
            itemStyle: { color: "#f59e0b", borderRadius: [6, 6, 0, 0] },
          },
          {
            value: props.sa,
            itemStyle: { color: "#14b8a6", borderRadius: [6, 6, 0, 0] },
          },
        ],
      },
    ],
  };
});
</script>

<template>
  <div class="w-full h-64">
    <ClientOnly>
      <VChart class="w-full h-full" :option="option" autoresize />
      <template #fallback>
        <USkeleton class="w-full h-full rounded-xl" />
      </template>
    </ClientOnly>
  </div>
</template>
