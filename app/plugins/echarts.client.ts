import VueECharts from "vue-echarts";
import { use } from "echarts/core";
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  CustomChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  CustomChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VChart", VueECharts);
});
