import { Flex } from 'antd'
import { posix } from 'path'
import { GoArrowRight } from 'react-icons/go'
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts'
import { Exceeds } from './exceeds'

interface ServiceStatisticProps {
	label: string
	totalCount: number
	canceledPercent: number
	notComePercent: number
	percent: number
	exceeds: boolean
}

interface StatItemProps {
	label: string
	percentage: number
	color: string
}

const StatItem: React.FC<StatItemProps> = ({ label, percentage, color }) => {
	const data = [
		{
			name: label,
			value: percentage,
			color: color,
		},
		{
			name: label,
			value: 100 - percentage,
			color: '#D9D9D9',
		},
	]
	return (
		<Flex align="center" gap={12} className="w-[250px]">
			<PieChart width={50} height={50}>
				<Pie
					data={data}
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					innerRadius={12}
					outerRadius={18}
					cornerRadius={4}
					paddingAngle={2}
					labelLine={false}
					fill={color}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Pie>
			</PieChart>
			<p className="text-[14px] font-medium">{label}</p>
			<p className="text-[14px] ml-auto font-medium">{percentage}%</p>
		</Flex>
	)
}

interface AppointmentStatsBlockProps {
	notShowedPercentage?: number
	canceledPercentage?: number
}

const AppointmentStatsBlock: React.FC<AppointmentStatsBlockProps> = ({
	notShowedPercentage = 0,
	canceledPercentage = 0,
}) => {
	return (
		<Flex vertical gap={6}>
			<StatItem
				label="Не пришедшие"
				percentage={notShowedPercentage}
				color="#FF8A24"
			/>
			<StatItem
				label="Отмененные"
				percentage={canceledPercentage}
				color="#FF5E5E"
			/>
		</Flex>
	)
}

export const AppointmentStatistic = ({
	label,
	totalCount,
	canceledPercent,
	notComePercent,
	percent,
	exceeds,
}: ServiceStatisticProps) => {
	const COLORS = ['#FF5E5E', '#FF8A24']

	const data = [
		{
			name: 'Отмененные',
			value: canceledPercent || 0,
			color: COLORS[0],
		},
		{
			name: 'Не пришедшие',
			value: notComePercent || 0,
			color: COLORS[1],
		},
	]

	return (
		<Flex vertical gap={30} className="bg-[#F9F9F9] rounded-[24px] p-4">
			<Flex justify="space-between">
				<Flex gap={20}>
					<p className="text-[#101010] text-[16px] font-[600] text-center">
						Процент записей
					</p>
					<Exceeds exceeds={exceeds} percent={percent} />
				</Flex>
				<p className="text-[14px] text-[#4E4E4E80]">{label}</p>
			</Flex>
			<Flex justify="center" gap={50} align="center">
				<div className="relative w-[200px]">
					<PieChart width={200} height={200}>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={62}
							outerRadius={90}
							cornerRadius={22}
							paddingAngle={2}
							labelLine={false}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
					</PieChart>
					<div
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
						style={{ width: '100px' }}
					>
						<p className="text-[20px] font-bold text-[#101010]">{totalCount}</p>
						<p className="text-[14px] text-[#4E4E4E80]">Кол-во</p>
					</div>
				</div>
				<AppointmentStatsBlock
					notShowedPercentage={notComePercent}
					canceledPercentage={canceledPercent}
				/>
			</Flex>
		</Flex>
	)
}
