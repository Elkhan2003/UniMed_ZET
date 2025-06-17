import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Exceeds } from './exceeds'

interface RegularChartProps {
	current: number
	previous: number
	average: number
	percent: number
	exceeds: boolean
    label: string
}

export const RegularChart = ({
	current,
	previous,
	average,
	percent,
	exceeds,
    label
}: RegularChartProps) => {
	const totalSegments = 50
	const filledSegments = Math.round((current / 100) * totalSegments)
	const segmentSize = 180 / totalSegments

	const segments = []
	for (let i = 0; i < totalSegments; i++) {
		const startAngle = 180 - i * segmentSize
		const endAngle = startAngle - segmentSize + 0.5
		const isFilled = i < filledSegments

		segments.push({
			id: `segment-${i}`,
			startAngle,
			endAngle,
			isFilled,
		})
	}

	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex items-center gap-2 mb-2">
				<p className="text-gray-900 font-medium">Доля постоянных клиентов</p>
				<Exceeds exceeds={exceeds} percent={percent} />
			</div>

			<div className="w-full h-64 relative">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						{segments.map((segment) => (
							<Pie
								key={segment.id}
								data={[{ value: 1 }]}
								cx="50%"
								cy="75%"
								startAngle={segment.startAngle}
								endAngle={segment.endAngle}
								innerRadius={140}
								outerRadius={180}
								cornerRadius={4}
								paddingAngle={1}
								dataKey="value"
								stroke="none"
							>
								<Cell fill={segment.isFilled ? '#FF80B5' : '#E0E0E0'} />
							</Pie>
						))}
					</PieChart>
				</ResponsiveContainer>

				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-4 text-center">
					<div className="text-[34px] font-[600]">{current}%</div>
					<div className="text-[#4E4E4E80]">{label}</div>
				</div>
			</div>
		</div>
	)
}

export default RegularChart
