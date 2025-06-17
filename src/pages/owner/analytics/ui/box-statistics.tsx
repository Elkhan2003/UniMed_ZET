import { Flex } from 'antd'
import { GoArrowRight } from 'react-icons/go'
import { Exceeds } from './exceeds'

interface BoxStatisticProps {
	current: number
	previous: number
	average: number
	percent: number
	exceeds: boolean
	title: string
	durationTypes?: string
	showExceeds?: boolean
}

const icon = [
	{ color: '#FF5E5E', rotate: '45', bgColor: '#FFE1E1' },
	{ color: '#3FC24C', rotate: '315', bgColor: '#DCFFE3' },
]

export const BoxStatistic = ({
	current,
	previous,
	average,
	percent,
	exceeds,
	title,
	durationTypes,
	showExceeds = false,
}: BoxStatisticProps) => {
	return (
		<div className="bg-[#F9F9F9] rounded-[24px] p-4 rotate-z-45">
			<Flex vertical gap={20}>
				<Flex justify="space-between">
					<p className="text-[#101010] font-[600]">{title}</p>
					<p className="text-[#4E4E4E80] text-[14px]">{durationTypes}</p>
				</Flex>
				<Flex vertical gap={0}>
					<Flex gap={10} align="center">
						<p className="text-[#101010] text-[24px] font-[600]">{current}c</p>
						{showExceeds && <Exceeds exceeds={exceeds} percent={percent} />}
					</Flex>
					<p className="text-[#4E4E4E80]">Среднее {average}c</p>
				</Flex>
			</Flex>
		</div>
	)
}
