import clsx from 'clsx'
import { _PUSH } from '../../../shared/lib/constants/constants'

interface SwitchProp {
	setActive: (active: boolean) => void
	active: boolean,
	onClick?: any
}

export const Switch = ({ setActive, active, onClick }: SwitchProp) => {
	return (
		<div
			onClick={async () => {
				await onClick()
				setActive(!active)
			}}
			className={clsx(
				'w-[30px] no-select rounded-[10px] h-[15px] relative cursor-pointer',
				{ 'bg-myviolet': active, 'bg-[#4E4E4E80]': !active }
			)}
		>
			<div
				className={clsx(
					'w-[15px] h-[15px] rounded-full scale-125 absolute transition-all duration-2000 ease-in-out bg-[#F2F2F1] ',
					{
						'right-0': active,
						'left-0': !active,
					}
				)}
			/>
		</div>
	)
}
