import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

dayjs.locale('ru')

export const CalendarDatePicker = ({
	currentDate,
	setCurrentDate,
}: {
	currentDate: dayjs.Dayjs
	setCurrentDate: (date: dayjs.Dayjs) => void
}) => {
	const startOfMonth = currentDate.startOf('month')
	const endOfMonth = currentDate.endOf('month')
	const startDay = (startOfMonth.day() + 6) % 7

	const daysInMonth = currentDate.daysInMonth()
	const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7

	const daysArray = Array.from({ length: totalCells }, (_, i) => {
		const dayOffset = i - startDay
		const date = startOfMonth.add(dayOffset, 'day')
		const isCurrentMonth = date.month() === currentDate.month()
		const isSelected = date.isSame(currentDate, 'day')
		return {
			date,
			isCurrentMonth,
			isSelected,
		}
	})

	const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
	const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'))

	return (
		<div className="w-full flex flex-col gap-[20px] min-h-[310px]">
			<div
				style={{ borderBottom: '0.5px solid #D8DADC' }}
				className="w-full flex justify-between items-center pb-[15px]"
			>
				<p className="text-[#101010] text-[14px] font-[600]">
					{currentDate.format('MMMM YYYY')}
				</p>
				<div className="flex items-center gap-[20px]">
					<MdKeyboardArrowLeft
						onClick={prevMonth}
						className="cursor-pointer"
						size={22}
					/>
					<MdKeyboardArrowRight
						onClick={nextMonth}
						className="cursor-pointer"
						size={22}
					/>
				</div>
			</div>

			<div className="w-full grid grid-cols-7 gap-1 text-center font-[600] text-[12px] text-[#101010]">
				{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
					<p key={day}>{day}</p>
				))}
			</div>

			<div className="w-full grid grid-cols-7 gap-1 text-center">
				{daysArray.map(({ date, isCurrentMonth, isSelected }, index) => (
					<div
						key={index}
						onClick={() => setCurrentDate(date)}
						className={`w-[30px] h-[30px] flex items-center justify-center mb-[2px] rounded-full cursor-pointer text-[12px] font-[500] transition-all
							${isSelected ? 'bg-myviolet text-white' : ''}
							${!isSelected && isCurrentMonth ? 'text-[#101010] hover:bg-myviolet hover:text-white' : ''}
							${!isCurrentMonth ? 'text-[#D8DADC]' : ''}
						`}
					>
						{date.date()}
					</div>
				))}
			</div>
		</div>
	)
}
