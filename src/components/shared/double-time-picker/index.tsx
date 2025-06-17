import React, { useState, useRef, useEffect } from 'react'
import './DoubleScrollTimePicker.css'
import { ModalComponent } from '../../UI/Modal/Modal'
import { Flex } from 'antd'
import { Button } from '../../UI/Buttons/Button/Button'

interface Props {
	active: boolean
	handleClose: () => void
	title: string
	startSelectedTime: string
	endSelectedTime: string
	setSelectedTimes: (times: { startTime: string; endTime: string }) => void
}

export const DoubleScrollTimePicker = ({
	active,
	handleClose,
	title,
	startSelectedTime,
	endSelectedTime,
	setSelectedTimes,
}: Props) => {
	const [startTime, setStartTime] = useState(startSelectedTime)
	const [endTime, setEndTime] = useState(endSelectedTime)

	const startHoursRef = useRef<HTMLDivElement>(null)
	const startMinutesRef = useRef<HTMLDivElement>(null)

	const endHoursRef = useRef<HTMLDivElement>(null)
	const endMinutesRef = useRef<HTMLDivElement>(null)

	const hours = Array.from({ length: 24 }, (_, i) =>
		i.toString().padStart(2, '0')
	)
	const minutes = Array.from({ length: 12 }, (_, i) => {
		const res = i * 5
		return res.toString().padStart(2, '0')
	})

	const handleScrollStart = (type: 'hours' | 'minutes') => {
		const element =
			type === 'hours' ? startHoursRef.current : startMinutesRef.current

		if (element) {
			const index = Math.round(element.scrollTop / 50)
			const value = type === 'hours' ? hours[index] : minutes[index]

			if (type === 'hours') {
				setStartTime((prev) => `${value}:${prev.split(':')[1] || '00'}`)
			} else {
				setStartTime((prev) => `${prev.split(':')[0]}:${value || '00'}`)
			}
		}
	}

	const handleScrollEnd = (type: 'hours' | 'minutes') => {
		const element =
			type === 'hours' ? endHoursRef.current : endMinutesRef.current

		if (element) {
			const index = Math.round(element.scrollTop / 50)
			const value = type === 'hours' ? hours[index] : minutes[index]

			if (type === 'hours') {
				setEndTime((prev) => `${value}:${prev.split(':')[1] || '00'}`)
			} else {
				setEndTime((prev) => `${prev.split(':')[0]}:${value || '00'}`)
			}
		}
	}

	const handleConfirm = () => {
		setSelectedTimes({ startTime, endTime })
		handleClose()
	}

	useEffect(() => {
		const SplitedStartTime = startSelectedTime.split(':')
		const startHour = Number(SplitedStartTime[0])
		const startMinute = Number(SplitedStartTime[1])
		startHoursRef.current?.scrollTo(0, startHour * 50)
		startMinutesRef.current?.scrollTo(0, startMinute * 50)

		const SplitedEndTime = endSelectedTime.split(':')
		const endHour = Number(SplitedEndTime[0])
		const endMinute = Number(SplitedEndTime[1])
		endHoursRef.current?.scrollTo(0, endHour * 50)
		endMinutesRef.current?.scrollTo(0, endMinute * 50)
	}, [startSelectedTime, endSelectedTime, active])

	return (
		<ModalComponent active={active} handleClose={handleClose} title={title}>
			<div className="min-w-[460px] flex items-center gap-1 mb-4">
				<div className="picker mx-auto">
					<div className="time-mask">
						<span
							className="hours"
							ref={startHoursRef}
							onScroll={() => handleScrollStart('hours')}
						>
							{hours.map((hour) => (
								<time
									className={`${
										Number(hour) === Number(startTime.slice(0, 2)) &&
										'centeredSpan'
									}`}
									key={hour}
								>
									{hour}
								</time>
							))}
						</span>
					</div>
					<span className="separator">:</span>
					<div className="time-mask">
						<span
							className="minutes"
							ref={startMinutesRef}
							onScroll={() => handleScrollStart('minutes')}
						>
							{minutes.map((minute) => (
								<time
									className={`${
										Number(minute) === Number(startTime.slice(3, 5)) &&
										'centeredSpan'
									}`}
									key={minute}
								>
									{minute}
								</time>
							))}
						</span>
					</div>
				</div>
				<div className="w-[1px] bg-gray-200 h-[150px]" />
				<div className="picker mx-auto">
					<div className="time-mask">
						<span
							className="hours"
							ref={endHoursRef}
							onScroll={() => handleScrollEnd('hours')}
						>
							{hours.map((hour) => (
								<time
									className={`${
										Number(hour) === Number(endTime.slice(0, 2)) &&
										'centeredSpan'
									}`}
									key={hour}
								>
									{hour}
								</time>
							))}
						</span>
					</div>
					<span className="separator">:</span>
					<div className="time-mask">
						<span
							className="minutes"
							ref={endMinutesRef}
							onScroll={() => handleScrollEnd('minutes')}
						>
							{minutes.map((minute) => (
								<time
									className={`${
										Number(minute) === Number(endTime.slice(3, 5)) &&
										'centeredSpan'
									}`}
									key={minute}
								>
									{minute}
								</time>
							))}
						</span>
					</div>
				</div>
			</div>
			<Flex gap={10}>
				<Button
					onClick={handleClose}
					border="1px solid #D8DADC"
					backgroundColor="transparent"
					color="black"
				>
					Отмена
				</Button>
				<Button disabled={startTime >= endTime} onClick={handleConfirm}>
					Выбрать
				</Button>
			</Flex>
		</ModalComponent>
	)
}
