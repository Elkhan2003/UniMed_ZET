import { Flex } from 'antd'
import { Pie, PieChart, Cell } from 'recharts'
import { Exceeds } from './exceeds'

interface VisitStatisticProps {
	label: string
	current: number
	previous: number
	average: number
	percent: number
	exceeds: boolean
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

export const VisitStatistic = ({
	label,
	current,
	average,
	previous,
	exceeds,
	percent,
}: VisitStatisticProps) => {
	return (
		<Flex vertical gap={0} className="bg-[#F9F9F9] rounded-[24px] p-4">
			<Flex justify="space-between">
				<Flex gap={10}>
					<p className="text-[#101010] text-[16px] font-[600] text-center">
						Посещаемость
					</p>
					<Exceeds exceeds={exceeds} percent={percent} />
				</Flex>
				<p className="text-[14px] text-[#4E4E4E80]">{label}</p>
			</Flex>
			<Flex vertical>
				<p className="text-[#4E4E4E80] text-[14px]">Кол-во записей</p>
				<p className="text-[#101010] text-[50px] font-[600]">{current}</p>
			</Flex>
		</Flex>
	)
}
