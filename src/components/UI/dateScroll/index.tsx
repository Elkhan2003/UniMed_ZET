import { Flex } from 'antd'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

interface DateScrollProps {
	startDate: string
	endDate: string
	setStartDate: (date: string) => void
	setEndDate: (date: string) => void
}

export const DateScroll = ({
	startDate,
	endDate,
	setEndDate,
	setStartDate,
}: DateScrollProps) => {
	function nextWeek() {
		const currentStartDate = new Date(startDate)
		const currentEndDate = new Date(endDate)

		const nextStartDate = new Date(
			currentStartDate.getTime() + 7 * 24 * 60 * 60 * 1000
		)
		const nextEndDate = new Date(
			currentEndDate.getTime() + 7 * 24 * 60 * 60 * 1000
		)

		setStartDate(nextStartDate.toISOString().split('T')[0])
		setEndDate(nextEndDate.toISOString().split('T')[0])
	}

	function prevWeek() {
		const currentStartDate = new Date(startDate)
		const currentEndDate = new Date(endDate)

		const prevStartDate = new Date(
			currentStartDate.getTime() - 7 * 24 * 60 * 60 * 1000
		)
		const prevEndDate = new Date(
			currentEndDate.getTime() - 7 * 24 * 60 * 60 * 1000
		)

		setStartDate(prevStartDate.toISOString().split('T')[0])
		setEndDate(prevEndDate.toISOString().split('T')[0])
	}

	return (
		<Flex
			justify="space-between"
			align="center"
			className="rounded-[16px] p-[10px] bg-[#F2F2F1] min-w-[260px]"
		>
			<div>
				<MdKeyboardArrowLeft
					onClick={() => prevWeek()}
					size={24}
					cursor="pointer"
				/>
			</div>
			<div className="">{`${
				startDate?.split('-')[0]
			}-${startDate?.split('-')[1]}-${
				startDate?.split('-')[2]
			} - ${endDate?.split('-')[0]}-${
				endDate?.split('-')[1]
			}-${endDate?.split('-')[2]}`}</div>
			<div>
				<MdKeyboardArrowRight
					onClick={() => nextWeek()}
					size={24}
					cursor="pointer"
				/>
			</div>
		</Flex>
	)
}
