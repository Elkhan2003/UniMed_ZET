import { useEffect, useState} from 'react'
import { WEEK, YEARS, TypeMonth } from '../../shared/lib/constants/constants'
import {
	MdKeyboardArrowRight,
	MdKeyboardArrowLeft,
	MdKeyboardArrowDown,
} from 'react-icons/md'

export const MiniCalendar = ({ date, setDate, submit, Close, text = 'Применить' }: any) => {
	const [first, setFirst] = useState<any>([])
	const [days, setDays] = useState<any>([])
	const [second, setSecond] = useState<any>([])
	const [openYers, setOpenYears] = useState<boolean>(false)
	const [openMonth, setOpenMonth] = useState<boolean>(false)

	const year = date.getFullYear()
	const month = date.getMonth()
	const day = date.getDate();
	const firstDayOfMonth = new Date(year, month, 0).getDay()
	const monthDays = new Date(year, month + 1, 0).getDate()

	useEffect(() => {
		const firstDays = firstDayOfMonth
		const prevMonthDays = new Date(year, month, 0).getDate()
		const first = Array.from(
			{ length: firstDays },
			(_, i) => prevMonthDays - firstDays + i + 1
		)

		const days = Array.from({ length: monthDays }, (_, i) => i + 1)

		const totalDaysDisplayed = firstDays + monthDays
		const remainingDays = 7 - (totalDaysDisplayed % 7)
		const second =
			remainingDays < 7
				? Array.from({ length: remainingDays }, (_, i) => i + 1)
				: []

		setFirst(first)
		setDays(days)
		setSecond(second)
	}, [year, month, firstDayOfMonth, monthDays])

	const goNext = () => {
		date.setMonth(date.getMonth() + 1)
		setDate(new Date(date))
	}

	const goPrev = () => {
		date.setMonth(date.getMonth() - 1)
		setDate(new Date(date))
	}

	const ChooseMonth = () => {
		return (
			<div className="absolute right-0 left-0 top-[30px] flex flex-col bg-gray-50 shadow-xl rounded-md z-[99999] no-select">
				<div className="rounded-t-md w-full h-1 bg-gray-400"></div>
				{TypeMonth.map((item: any, index: number) => (
					<p
						key={index}
						onClick={(e) => {
							e.stopPropagation()
							date.setMonth(index)
							setDate(new Date(date))
							setOpenMonth(false)
						}}
						className="text-myviolet text-sm xs:text-xs hover:bg-myviolet hover:text-white p-1 rounded-sm no-select"
					>
						{item}
					</p>
				))}
			</div>
		)
	}

	const ChooseYear = () => {
		return (
			<div className="absolute right-0 left-0 top-[30px] flex flex-col bg-gray-50 shadow-xl rounded-md z-[9999] no-select">
				<div className="rounded-t-md w-full h-1 bg-gray-400"></div>
				{YEARS.map((item: any, index: number) => (
					<p
						key={index}
						onClick={(e) => {
							e.stopPropagation()
							date.setFullYear(item)
							setDate(new Date(date))
							setOpenYears(false)
						}}
						className="text-myviolet text-center text-sm xs:text-xs hover:bg-myviolet hover:text-white p-1 rounded-sm"
					>
						{item}
					</p>
				))}
			</div>
		)
	}

	return (
		<div className="w-[300px] xs:w-[240px] h-fit shadow-xl bg-gray-50 no-select rounded-md">
			<div className="rounded-t-md w-full h-12 xs:h-10 flex items-center justify-between px-2 xs:px-1 bg-myviolet">
				<div
					onClick={goPrev}
					className="rounded-full border-[1px] border-solid border-white bg-transparent flex justify-center items-center p-[2px] cursor-pointer group"
				>
					<MdKeyboardArrowLeft className="text-white w-5 xs:w-4 h-5 xs:h-4 group-active:translate-x-[-10px] transition-all duration-300" />
				</div>
				<div
					onClick={() => setOpenMonth(!openMonth)}
					className="flex items-center justify-between text-white cursor-pointer relative !w-[90px] !xs:w-[75px]"
				>
					<p className="font-[600] xs:text-sm">{TypeMonth[month]}</p>
					<MdKeyboardArrowDown />
					{openMonth && <ChooseMonth />}
				</div>
				<div
					onClick={() => setOpenYears(!openYers)}
					className="flex items-center justify-between text-white cursor-pointer relative !w-[60px] !xs:w-[50px]"
				>
					<p className="font-[600] xs:text-sm">{year}</p>
					<MdKeyboardArrowDown />
					{openYers && <ChooseYear />}
				</div>
				<div
					onClick={goNext}
					className="rounded-full border-[1px] border-solid border-white bg-transparent flex justify-center items-center p-[2px] cursor-pointer group"
				>
					<MdKeyboardArrowRight className="text-white w-5 xs:w-4 h-5 xs:h-4 xs group-active:translate-x-[10px] transition-all duration-300" />
				</div>
			</div>
			<div className={`rounded-b-md w-full p-2 xs:p-1`}>
				<div className="w-full grid grid-cols-7">
					{WEEK.map((item: string, index: number) => (
						<p
							key={index}
							className="w-full text-center text-xs text-myviolet"
						>
							{item}
						</p>
					))}
				</div>
				<hr className="w-full h-[1px] bg-gray-300" />
				<div className={`grid grid-cols-7 grid-rows-5 gap-1 mt-[2px]`}>
					{first.length
						? first.map((item: any, index: number) => (
								<div
									key={index}
									className="rounded-md p-1 flex justify-center items-center text-gray-300 text-sm xs:text-xs"
								>
									{item}
								</div>
						  ))
						: null}
					{days.map((item: any, index: number) => (
						<div
							style={{
								backgroundColor: date.getDate() === item ? 'var(--myviolet)' : '',
								color: date.getDate() === item ? 'white' : '',
							}}
							key={index}
							onClick={() => {
								date.setDate(item)
								setDate(new Date(date))
							}}
							className="cursor-pointer rounded-full hover:bg-gray-500 hover:text-white p-1 text-sm xs:text-xs flex justify-center items-center text-gray-500"
						>
							{item}
						</div>
					))}
					{second.length
						? second.map((item: any, index: number) => (
								<div
									key={index}
									className="rounded-md p-1 flex justify-center items-center text-gray-300 text-sm xs:text-xs"
								>
									{item}
								</div>
						  ))
						: null}
				</div>
				<div className="w-full flex justify-end items-center gap-[1px] mt-2 xs:mt-1">
					<div
						onClick={() => {
							const newDate = new Date(year, month, day)
							submit(newDate)
						}}
						className="w-fit cursor-pointer rounded-md bg-myviolet px-2 py-1 text-xs text-white"
					>
						{text}
					</div>
				</div>
			</div>
		</div>
	)
}
