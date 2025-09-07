"use client";
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export type ChartType = 'bar' | 'pie' | 'line';

interface BaseChartProps<T> {
  type: ChartType;
  data: T[];
  height?: number;
  className?: string;
  // mapping
  xKey?: keyof T & string;
  yKey?: keyof T & string;
  valueKey?: keyof T & string; // for pie
  nameKey?: keyof T & string; // for pie
  series?: { key: keyof T & string; color?: string; name?: string }[]; // for multi-series line/bar
  colors?: string[];
}

const defaultColors = ['#0f172a','#334155','#475569','#64748b','#94a3b8','#cbd5e1','#e2e8f0','#f1f5f9'];

export function Chart<T extends Record<string, any>>(props: BaseChartProps<T>) {
  const { type, data, height = 260, className, xKey, yKey, valueKey, nameKey, series, colors = defaultColors } = props;

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <>
        {type === 'bar' && xKey && yKey && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} stroke="#475569" />
            <YAxis tick={{ fontSize: 11 }} stroke="#475569" />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series ? series.map((s,i) => (
              <Bar key={s.key} dataKey={s.key} name={s.name || s.key} fill={s.color || colors[i % colors.length]} radius={2} />
            )) : <Bar dataKey={yKey} fill={colors[0]} radius={2} />}
          </BarChart>
        )}
        {type === 'pie' && valueKey && nameKey && (
          <PieChart>
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Pie data={data} dataKey={valueKey} nameKey={nameKey} outerRadius={80} innerRadius={40} paddingAngle={2}>
              {data.map((_,i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        )}
        {type === 'line' && xKey && series && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} stroke="#475569" />
            <YAxis tick={{ fontSize: 11 }} stroke="#475569" />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series.map((s,i) => (
              <Line key={s.key} dataKey={s.key} type="monotone" name={s.name || s.key} stroke={s.color || colors[i % colors.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        )}
        </>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
