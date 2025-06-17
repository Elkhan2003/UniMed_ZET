import { useEffect, useState } from 'react'
import { Dropdown } from 'antd'
import { ReactComponent as Calendar } from '../../../assets/icons/CalendarMini.svg'
import { MiniCalendar } from '../../UI/MiniCalendar'

interface Props {
	label: string
	date?: Date
	setDate: (date: string) => void
	required?: boolean
}

export const NewDatePicker = ({
	label,
	date = new Date(),
	required,
	setDate,
}: Props) => {
	const [open, setOpen] = useState<boolean>(false)

	const submit = (date: any) => {
		setOpen(false)
	}

	const calendarOverlay = (
		<MiniCalendar
			date={date}
			setDate={(date: Date) => setDate(date.toISOString().split('T')[0])}
			submit={submit}
			text='Закрыть'
		/>
	)

	return (
		<div className="w-full">
			<p className="text-[13px]">
				{label}
				{required && <span className="text-red-500">*</span>}
			</p>
			<Dropdown
				overlay={calendarOverlay}
				trigger={['click']}
				open={open}
				onOpenChange={(open: boolean) => setOpen(open)}
			>
				<div className="w-full border-[1px] border-[#D8DADC] border-solid rounded-[10px] flex items-center justify-between px-[15px] h-[40px] relative">
					<p className="text-black">
						{!date ? (
							<span className="text-[14px] font-[500] text-[#4E4E4E80]">
								ДД.MM.ГГГГ
							</span>
						) : (
							<span>
								{String(date.getDate()).padStart(2, '0')}-
								{String(date.getMonth() + 1).padStart(2, '0')}-
								{date.getFullYear()}
							</span>
						)}
					</p>
					<Calendar />
				</div>
			</Dropdown>
		</div>
	)
}
