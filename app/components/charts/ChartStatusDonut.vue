<script setup lang="ts">
import type { EChartsOption } from "echarts";

const props = defineProps<{
  terealisasi: number;
  hutang: number;
  pending: number;
}>();

const colorMode = useColorMode();

const option = computed<EChartsOption>(() => {
  const isDark = colorMode.value === "dark";
  const bgColor = isDark ? "#1e293b" : "#ffffff";

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
      backgroundColor: bgColor,
      borderColor: isDark ? "#334155" : "#e2e8f0",
      textStyle: { color: isDark ? "#f1f5f9" : "#0f172a" },
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
      textStyle: { color: isDark ? "#94a3b8" : "#64748b" },
    },
    series: [
      {
        name: "Status Task",
        type: "pie",
        radius: ["45%", "75%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
            color: isDark ? "#f1f5f9" : "#0f172a",
          },
        },
        data: [
          {
            value: props.terealisasi,
            name: "Terealisasi",
            itemStyle: { color: "#22c55e" },
          },
          {
            value: props.hutang,
            name: "Hutang",
            itemStyle: { color: "#ef4444" },
          },
          {
            value: props.pending,
            name: "Pending",
            itemStyle: { color: "#f59e0b" },
          },
        ],
      },
    ],
  };
});
</script>

<template>
  <div class="w-full h-72">
    <ClientOnly>
      <VChart class="w-full h-full" :option="option" autoresize />
      <template #fallback>
        <USkeleton class="w-full h-full rounded-xl" />
      </template>
    </ClientOnly>
  </div>
</template>
