import styles from './DurationCounter.module.css'
import { translateDuration } from '../../../shared/lib/helpers/helpers'
import { useState } from 'react'

interface IcounterProps {
	label: string
	count: number
	setCount: (initial: number) => void
	required?: boolean
}

export const DurationCounter = (props: IcounterProps) => {
	const { label, count, setCount } = props
	const [isFocused, setIsFocused] = useState(false)

	const decrement = () => {
		if (count > 5) {
			setCount(count - 5)
		}
	}

	const increment = () => {
		if (count < 1440) {
			setCount(count + 5)
		}
	}

	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		setIsFocused(false)
	}

	return (
		<div className={styles.wrapper}>
			{label && (
				<label className={styles.label}>
					{label}
					{props.required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div
				className={`${styles.count_wrapper} ${isFocused ? styles.focused : ''}`}
				onFocus={handleFocus}
				onBlur={handleBlur}
				tabIndex={0}
			>
				<span className={styles.count_value}>{translateDuration(count)}</span>
				<div className={styles.count_buttons}>
					<span onClick={increment} className={styles.count_plus}>
						+
					</span>
					<span onClick={decrement} className={styles.count_minus}>
						-
					</span>
				</div>
			</div>
		</div>
	)
}
