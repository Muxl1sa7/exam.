import {
  RadarChart as ReRadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts'

interface Props {
  data: Array<{ subject: string; score: number }>
  height?: number
}

export default function TopicRadar({ data, height = 220 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReRadarChart data={data}>
        <PolarGrid stroke="#1e2d4a" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} tickCount={4} />
        <Tooltip
          contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`${v}%`, 'Ball']}
        />
        <Radar name="Ball" dataKey="score" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.1} />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
