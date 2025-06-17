import { Flex } from 'antd'
import { posix } from 'path'
import { GoArrowRight } from 'react-icons/go'
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts'
import { Exceeds } from './exceeds'

interface ServiceStatisticProps {
	label: string
	totalClients: number
	regularClients: number
	oneTimeClients: number
	exceeds: boolean
	percent: number
}

interface StatItemProps {
	label: string
	percentage: number
	percentage2: number
	color: string
}

const StatItem: React.FC<StatItemProps> = ({
	label,
	percentage,
	percentage2,
	color,
}) => {
	const data = [
		{
			name: label,
			value: percentage,
			color: color,
		},
		{
			name: label,
			value: percentage2,
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
			<p className="text-[14px] ml-auto font-medium">{percentage}</p>
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
				label="Разовые"
				percentage={notShowedPercentage}
				percentage2={canceledPercentage}
				color="#C499FF"
			/>
			<StatItem
				label="Постоянные"
				percentage2={notShowedPercentage}
				percentage={canceledPercentage}
				color="#FF99D4"
			/>
		</Flex>
	)
}

export const ClientStatistic = ({
	label,
	totalClients,
	regularClients,
	oneTimeClients,
	exceeds,
	percent,
}: ServiceStatisticProps) => {
	const COLORS = ['#C499FF', '#FF99D4']

	const data = [
		{
			name: 'Разовые',
			value: oneTimeClients || 0,
			color: COLORS[0],
		},
		{
			name: 'Постоянные',
			value: regularClients || 0,
			color: COLORS[1],
		},
	]

	return (
		<Flex vertical gap={30} className="bg-[#F9F9F9] rounded-[24px] p-4">
			<Flex justify="space-between">
				<Flex gap={10}>
					<p className="text-[#101010] text-[16px] font-[600] text-center">
						Клиентская база
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
						<p className="text-[20px] font-bold text-[#101010]">
							{totalClients}
						</p>
						<p className="text-[14px] text-[#4E4E4E80]">Кол-во</p>
					</div>
				</div>
				<AppointmentStatsBlock
					notShowedPercentage={oneTimeClients}
					canceledPercentage={regularClients}
				/>
			</Flex>
		</Flex>
	)
}
