import { Flex } from 'antd'

interface ClientBoxProps {
	title: string
	durationType: string
	count: string | number
	bgColor?: string
	countColor?: string
}

export const ClientBox = ({
	title,
	durationType,
	count,
	bgColor = '#F9F9F9',
	countColor = '#101010',
}: ClientBoxProps) => {
	return (
		<div
			style={{ backgroundColor: bgColor }}
			className="rounded-[24px] p-4 rotate-z-45"
		>
			<Flex vertical gap={30}>
				<Flex justify="space-between">
					<p className="text-[#101010] font-[600]">{title}</p>
					<p className="text-[#4E4E4E80] text-[14px]">{durationType}</p>
				</Flex>
				<p style={{ color: countColor }} className="text-[34px] font-[600]">
					{count}
				</p>
			</Flex>
		</div>
	)
}
