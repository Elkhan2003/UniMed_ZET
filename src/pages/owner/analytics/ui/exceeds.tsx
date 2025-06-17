import { Flex } from "antd"
import { GoArrowRight } from "react-icons/go"

interface ExceedsProps {
	exceeds: boolean
	percent: string | number
}

const icon = [
	{ color: '#FF5E5E', rotate: '45', bgColor: '#FFE1E1' },
	{ color: '#3FC24C', rotate: '315', bgColor: '#DCFFE3' },
]

export const Exceeds = ({exceeds, percent}: ExceedsProps) => {
	const picked = icon[Number(exceeds)]
	return (
		<Flex
			gap={5}
			align="center"
			style={{ backgroundColor: picked?.bgColor }}
			className={`px-1 rounded-[10px]`}
		>
			<p className="text-[14px]">{percent}%</p>
			<GoArrowRight
				color={picked?.color}
				style={{ transform: `rotate(${picked?.rotate}deg)` }}
			/>
		</Flex>
	)
}
