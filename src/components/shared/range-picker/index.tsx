import React, { useState } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { NewDatePicker } from '../../shared/date-picker'
import { Button } from '../../UI/Buttons/Button/Button'

dayjs.extend(isBetween)

export const RangePicker = ({
	setStartDate,
	setEndDate,
	startDate,
	endDate,
	setOpenCalendar,
}: {
	setStartDate: (date: dayjs.Dayjs | string) => void
	setEndDate: (date: dayjs.Dayjs | string) => void
	setOpenCalendar: (open: boolean) => void
	startDate: dayjs.Dayjs | string
	endDate: dayjs.Dayjs | string
}) => {
	const [currentMonth, setCurrentMonth] = useState(dayjs())
	const [tempStart, setTempStart] = useState<dayjs.Dayjs | null>(
		typeof startDate === 'string' ? dayjs(startDate) : startDate,
	)
	const [tempEnd, setTempEnd] = useState<dayjs.Dayjs | null>(
		typeof endDate === 'string' ? dayjs(endDate) : endDate,
	)

	const daysInMonth = currentMonth.daysInMonth()
	const firstDayOfMonth = currentMonth.startOf('month').day()
	const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

	const handleDayClick = (day: number) => {
		const clickedDate = currentMonth.date(day)
		if (!tempStart || (tempStart && tempEnd)) {
			setTempStart(clickedDate)
			setTempEnd(null)
		} else if (clickedDate.isBefore(tempStart, 'day')) {
			setTempStart(clickedDate)
		} else {
			setTempEnd(clickedDate)
		}
	}

	const isInRange = (day: number) => {
		const date = currentMonth.date(day)
		if (tempStart && tempEnd) {
			return date.isAfter(tempStart, 'day') && date.isBefore(tempEnd, 'day')
		}
		return false
	}

	const isSelected = (day: number) => {
		const date = currentMonth.date(day)
		return (
			(tempStart && date.isSame(tempStart, 'day')) ||
			(tempEnd && date.isSame(tempEnd, 'day'))
		)
	}

	const prevMonth = () => {
		setCurrentMonth(currentMonth.subtract(1, 'month'))
	}

	const nextMonth = () => {
		setCurrentMonth(currentMonth.add(1, 'month'))
	}

	const handleApply = () => {
		if (tempStart) setStartDate(tempStart)
		if (tempEnd) setEndDate(tempEnd)
		setOpenCalendar(false)
	}

	const handleCancel = () => {
		setTempStart(null)
		setTempEnd(null)
		setOpenCalendar(false)
	}

	return (
		<div className="w-[330px] bg-white rounded-lg shadow-xl p-[10px]">
			<div className="flex items-center justify-between text-[16px]">
				<p>Сегодня</p>
				<p>{dayjs().format('D MMMM YYYY')}</p>
			</div>

			<div className="flex justify-between my-4 gap-4">
				<NewDatePicker
					setDate={(date) => setTempStart(dayjs(date))}
					label="От"
					date={tempStart?.toDate()}
				/>
				<NewDatePicker
					setDate={(date) => setTempEnd(dayjs(date))}
					label="До"
					date={tempEnd?.toDate()}
				/>
			</div>

			<div className="flex justify-between items-center mb-2">
				<div className="text-[14px] font-medium">{currentMonth.format('MMMM YYYY')}</div>
				<div className="flex">
					<button onClick={prevMonth} className="p-1 mx-1">
						{/* Left Arrow */}
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button onClick={nextMonth} className="p-1 mx-1">
						{/* Right Arrow */}
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-1">
				{Array.from({ length: firstDayOfMonth }).map((_, i) => (
					<div key={`empty-${i}`} />
				))}
				{days.map((day) => {
					const inRange = isInRange(day)
					const selected = isSelected(day)

					return (
						<div
							key={day}
							onClick={() => handleDayClick(day)}
							className={`h-8 w-8 flex items-center justify-center text-[13px] rounded-full cursor-pointer
								${selected ? 'bg-[#FF4BAF] text-white' : ''}
								${inRange ? 'bg-[#FF4BAF]/10 text-black' : ''}
								hover:bg-pink-100
							`}
						>
							{day}
						</div>
					)
				})}
			</div>

			<div className="flex justify-between gap-4 mt-2">
				<Button onClick={handleCancel} border="1px solid #D8DADC" backgroundColor="transparent" color="#101010">
					Отмена
				</Button>
				<Button onClick={handleApply}>Применить</Button>
			</div>
		</div>
	)
}
