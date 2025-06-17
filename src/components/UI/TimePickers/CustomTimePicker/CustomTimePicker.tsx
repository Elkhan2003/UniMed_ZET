import { useEffect, useState } from 'react'
import styles from './CustomTimePicker.module.css'
import { Backdrop } from '@mui/material'

interface ICustomTimePicker {
	minTime?: string
	maxTime?: string
	disabled?: boolean
	onChange: (initialData: string) => void
	value: string
	step?: number
	label?: string
}

export const CustomTimePicker = ({
	minTime = '00',
	maxTime = '23',
	step = 5,
	disabled = false,
	onChange,
	value,
	label = '',
}: ICustomTimePicker) => {
	const [isShowOpen, setIsShowOpen] = useState<boolean>(false)
	const [timeValue, setTimeValue] = useState<string>(
		value === undefined ? '' : value
	)

	useEffect(() => {
		setTimeValue(value !== undefined ? value : '')
	}, [value])

	function handleChangeMinute(e: string | number) {
		const newValue =
			timeValue.split(':')[1] === undefined
				? `${e}:00`
				: `${e}:${value.slice(3, 5)}`
		onChange(newValue)
		setTimeValue(newValue)
		setIsShowOpen(false)
	}

	function handleChangeSecunde(e: string | number) {
		const newTimeValue =
			timeValue.split(':')[1] !== undefined
				? `${timeValue.slice(0, 2)}:${e}`
				: `12:${e}`
		onChange(newTimeValue)
		setTimeValue(newTimeValue)
		setIsShowOpen(false)
	}

	const generateTimeArray = () => {
		const timeArray = []
		for (let i: any = minTime; i <= maxTime; i++) {
			const formattedTime = i.toString().padStart(2, '0')
			timeArray.push(formattedTime)
		}
		return timeArray
	}

	const timeArray = generateTimeArray()

	const generateStepArray = () => {
		const timeArray = []
		for (let i = 0; i < 60; i += step) {
			const formattedTime = i.toString().padStart(2, '0')
			timeArray.push(formattedTime)
		}
		return timeArray
	}

	const stepArray = generateStepArray()

	return (
		<div>
			{label !== '' && <span className={styles.label}>{label}</span>}
			<div
				className={styles.container_timepicker}
				onClick={() => setIsShowOpen(true)}
				style={{ pointerEvents: disabled ? 'none' : 'all' }}
			>
				<div className={styles.container_title}>
					{timeValue === '' ? 'чч:мм' : timeValue.slice(0, 5)}
				</div>
			</div>
			{isShowOpen && (
				<>
					<Backdrop
						open={disabled ? false : isShowOpen}
						sx={{
							background: 'none',
							zIndex: 10,
						}}
						onClick={() => setIsShowOpen(false)}
					/>
					<div className={styles.container_bottom}>
						<div className={styles.container_left}>
							{timeArray.map((minute: string, index: number) => (
								<div
									className={styles.title_munute}
									key={index}
									onClick={() => handleChangeMinute(minute)}
								>
									{minute}
								</div>
							))}
						</div>
						<div className={styles.container_right}>
							{stepArray.map((minute: string, index: number) => {
								return (
									<div
										key={index}
										onClick={() => handleChangeSecunde(minute)}
										className={styles.title_munute}
									>
										{minute}
									</div>
								)
							})}
						</div>
					</div>
				</>
			)}
		</div>
	)
}
