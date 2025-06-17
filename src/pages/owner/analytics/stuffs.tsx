import { Flex } from 'antd'
import { Employees } from './ui/employees'
import { useEffect, useRef, useState } from 'react'
import { Exceeds } from './ui/exceeds'
import { Cell, Pie, PieChart } from 'recharts'
import { useSearchParams } from 'react-router-dom'
import { dateTypes } from './ui/date-type-picket'
import Loading from '../../loading'

export const COLORS_STUFF = [
	'#FFC4E1',
	'#FFB97C',
	'#FDDA4D',
	'#976DD6',
	'#C4C7FF',
	'#7EDC87',
	'#FF99D4',
	'#FFE8F5',
	'#C499FF',
]

export const Stuffs = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
	const ref = useRef<any>(null)
	const [maxWidth, setMaxWidth] = useState(1400)
	const [searchParams, setSearchParams] = useSearchParams()
	const searchparam = searchParams.get('date-type') || 'WEEK'
	
	const commonLabel = dateTypes[searchparam]

	const employees = data?.employeeAnalytics?.employees
	const employeeData = data?.employeeAnalytics

	useEffect(() => {
		if (ref.current) {
			setMaxWidth(ref.current.clientWidth)
		}
	}, [ref?.current?.clientWidth, data])

	if (isLoading) {
		return (
			<Flex
				align="center"
				justify="center"
				className="w-full h-[calc(100vh-200px)] flex items-center justify-center"
			>
				<Loading />
			</Flex>
		)
	}

	return (
		<div style={{ maxWidth: maxWidth }} ref={ref} className="w-full h-full px-4">
			<Flex gap={10}>
				<p className="text-[#101010] font-[600]">Загруженность</p>
				<Exceeds
					exceeds={employeeData?.totalWorkload?.exceeds}
					percent={employeeData?.totalWorkload?.percentChange}
				/>
				<p>{commonLabel}</p>
			</Flex>
			<Flex className="w-full">
				<div className="grid grid-cols-2 w-[60%] mt-4">
					{Object.entries(employeeData?.employeeWorkloads || {}).map(
						([key, value], index) => {
							const employee = employees.find(
								(item: any) => Number(item.id) === Number(key)
							)

							const chartData = [
								{
									name: 'label',
									value: value || 0,
									color: COLORS_STUFF[index],
								},
								{
									name: 'label2',
									value: 100 - Number(value) || 0,
									color: '#D9D9D9',
								},
							]

							return (
								<Flex key={key} className="mt-4">
									<Flex align="center" gap={12} className="w-[250px] relative">
										<PieChart width={50} height={50}>
											<Pie
												data={chartData}
												dataKey="value"
												nameKey="name"
												cx="50%"
												cy="50%"
												innerRadius={17}
												outerRadius={23}
												cornerRadius={4}
												paddingAngle={2}
												labelLine={false}
												// fill={color}
											>
												{chartData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
													/>
												))}
											</Pie>
										</PieChart>
										<p
											style={{ color: COLORS_STUFF[index] }}
											className="text-[14px]"
										>
											{employee?.name}
										</p>
										<div
											className="absolute top-1/2 left-[26px] transform -translate-x-1/2 -translate-y-1/2 text-center"
											style={{ width: '100px' }}
										>
											<p className="text-[12px] text-[#101010]">
												{Number(value)}%
											</p>
										</div>
									</Flex>
								</Flex>
							)
						}
					)}
				</div>
			</Flex>
			<Employees data={employees} />
		</div>
	)
}
