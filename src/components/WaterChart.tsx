import { useEffect, useRef } from "react";
import type { EChartsOption } from "echarts";

type ChartKind = "flow" | "quality" | "bars" | "radar" | "donut" | "energy" | "alerts";

const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];

type ChartPalette = [string, string, string, string, string, string, string, string, string, string, string];

function makeOption(kind: ChartKind, colors: ChartPalette): EChartsOption {
  const axis = { axisLine: { lineStyle: { color: colors[5] } }, axisLabel: { color: colors[6], fontSize: 10 }, splitLine: { lineStyle: { color: colors[7] } } };
  const tooltip = { trigger: "axis" as const, backgroundColor: colors[8], borderColor: colors[0], textStyle: { color: colors[4] } };
  if (kind === "flow" || kind === "quality" || kind === "energy") {
    const configs = {
      flow: { names: ["进水量", "出水量"], a: [3.1, 3.5, 4.2, 4.5, 4.1, 3.8, 3.4], b: [2.8, 3.2, 3.9, 4.1, 3.8, 3.6, 3.1] },
      quality: { names: ["COD", "氨氮", "总磷"], a: [31, 28, 34, 26, 23, 25, 21], b: [4.1, 3.5, 3.8, 3.1, 2.9, 2.5, 2.2], c: [0.42, 0.38, 0.4, 0.34, 0.3, 0.28, 0.24] },
      energy: { names: ["实际能耗", "预测能耗"], a: [318, 302, 361, 428, 397, 376, 330], b: [330, 315, 350, 405, 410, 365, 340] },
    }[kind];
    return {
      color: colors.slice(0, 3), tooltip,
      legend: { top: 10, right: 8, textStyle: { color: colors[4] }, itemWidth: 14 },
      grid: { left: 42, right: 18, top: 52, bottom: 28 },
      xAxis: { type: "category", data: hours, boundaryGap: false, ...axis }, yAxis: { type: "value", ...axis },
      series: configs.names.map((name, i) => ({ name, type: "line", smooth: true, symbol: "circle", symbolSize: 6, data: i === 0 ? configs.a : i === 1 ? configs.b : ("c" in configs ? configs.c : []), lineStyle: { width: 3 }, areaStyle: { opacity: i === 0 ? 0.18 : 0.04 } })),
    };
  }
  if (kind === "radar") return { color: colors.slice(0, 3), tooltip: {}, radar: { radius: "64%", indicator: ["COD", "BOD₅", "氨氮", "总氮", "总磷", "SS"].map(name => ({ name, max: 100 })), axisName: { color: colors[4] }, splitLine: { lineStyle: { color: colors[7] } }, splitArea: { areaStyle: { color: [colors[9], colors[10]] } } }, series: [{ type: "radar", data: [{ value: [83, 75, 92, 69, 88, 78], name: "处理能力", areaStyle: { opacity: .3 } }, { value: [65, 68, 70, 82, 74, 68], name: "设计基准", areaStyle: { opacity: .12 } }] }] };
  if (kind === "donut") return { color: colors.slice(0, 4), tooltip: { trigger: "item", backgroundColor: colors[8], borderColor: colors[0], textStyle: { color: colors[4] } }, legend: { bottom: 0, textStyle: { color: colors[4] } }, series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "45%"], padAngle: 3, itemStyle: { borderRadius: 5 }, label: { color: colors[4], formatter: "{d}%" }, data: [{ value: 46, name: "生化系统" }, { value: 27, name: "提升泵站" }, { value: 17, name: "污泥系统" }, { value: 10, name: "辅助设施" }] }] };
  const data = kind === "alerts" ? [3, 7, 4, 11, 6, 9, 5] : [78, 92, 64, 86, 72, 95];
  const labels = kind === "alerts" ? hours : ["预处理", "生化池", "二沉池", "深度处理", "污泥脱水", "消毒池"];
  return { color: [colors[0]], tooltip, grid: { left: 44, right: 16, top: 30, bottom: 35 }, xAxis: { type: "category", data: labels, ...axis, axisLabel: { ...axis.axisLabel, rotate: kind === "bars" ? 18 : 0 } }, yAxis: { type: "value", ...axis }, series: [{ type: "bar", data, barWidth: "45%", itemStyle: { borderRadius: [5, 5, 0, 0], color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: colors[1] }, { offset: 1, color: colors[0] }] } } }] };
}

export function WaterChart({ kind, className = "h-64" }: { kind: ChartKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let chart: import("echarts").ECharts | undefined;
    let disposed = false;
    const el = ref.current;
    import("echarts").then((echarts) => {
      if (disposed) return;
      const s = getComputedStyle(document.documentElement);
      const get = (name: string) => s.getPropertyValue(name).trim();
      const colors = ["--chart-cyan", "--chart-lime", "--chart-gold", "--chart-blue", "--chart-text", "--chart-axis", "--chart-label", "--chart-grid", "--chart-tooltip", "--chart-radar-a", "--chart-radar-b"].map(get) as ChartPalette;
      chart = echarts.init(el);
      chart.setOption(makeOption(kind, colors), true);
    });
    const resize = () => chart?.resize();
    window.addEventListener("resize", resize);
    return () => { disposed = true; window.removeEventListener("resize", resize); chart?.dispose(); };
  }, [kind]);
  return <div ref={ref} className={className} role="img" aria-label={`${kind} 数据图表`} />;
}
