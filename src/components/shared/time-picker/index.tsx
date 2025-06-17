import React, { useState, useRef, useEffect } from 'react'
import './ScrollTimePicker.css'
import { ModalComponent } from '../../UI/Modal/Modal'
import { Flex } from 'antd'
import { Button } from '../../UI/Buttons/Button/Button'

interface Props {
	active: boolean
	handleClose: () => void
	title: string
	selectedTime: string
	setSelectedTime: (time: string) => void
}

export const ScrollTimePicker = ({
	active,
	handleClose,
	title,
	selectedTime = '00:00',
	setSelectedTime,
}: Props) => {
	const [tempTime, setTempTime] = useState(selectedTime)
	const hoursRef = useRef<HTMLDivElement>(null)
	const minutesRef = useRef<HTMLDivElement>(null)

	const hours = Array.from({ length: 24 }, (_, i) =>
		i.toString().padStart(2, '0')
	)
	const minutes = Array.from({ length: 12 }, (_, i) => {
		const res = i * 5
		return res.toString().padStart(2, '0')
	})

	const handleScroll = (type: 'hours' | 'minutes') => {
		const element = type === 'hours' ? hoursRef.current : minutesRef.current

		if (element) {
			const index = Math.round(element.scrollTop / 50)
			const value = type === 'hours' ? hours[index] : minutes[index]

			if (type === 'hours') {
				setTempTime((prev) => `${value}:${prev.split(':')[1]}`)
			} else {
				setTempTime((prev) => `${prev.split(':')[0]}:${value}`)
			}
		}
	}

	const handleConfirm = () => {
		setSelectedTime(tempTime)
		handleClose()
	}

	useEffect(() => {
		const time = selectedTime.split(':')
		const hour = Number(time[0])
		const minute = Number(time[1])
		hoursRef.current?.scrollTo(0, hour * 50 )
		minutesRef.current?.scrollTo(0, minute * 50)
	}, [active])

	return (
		<ModalComponent active={active} handleClose={handleClose} title={title}>
			<div className="min-w-[240px]">
				<div className="picker mx-auto">
					<div className="time-mask">
						<span
							className="hours"
							ref={hoursRef}
							onScroll={() => handleScroll('hours')}
						>
							{hours.map((hour) => (
								<time
									className={`${
										Number(hour) === Number(tempTime.slice(0, 2)) &&
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
							ref={minutesRef}
							onScroll={() => handleScroll('minutes')}
						>
							{minutes.map((minute) => (
								<time
									className={`${
										Number(minute) === Number(tempTime.slice(3, 5)) &&
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
				<Button onClick={handleConfirm}>Выбрать</Button>
			</Flex>
		</ModalComponent>
	)
}
