import { Dropdown, Flex } from 'antd'
import { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'

export const dateTypes: any = {
	DAY: 'За день',
	WEEK: 'За неделю',
	MONTH: 'За месяц',
	YEAR: 'За год',
}

export const DateTypePicker = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [selectedDateType, setSelectedDateType] = useState({
		label: 'За неделю',
		value: 'WEEK',
	})

	useEffect(() => {
		const searchparam = searchParams.get('date-type')
		if (searchparam) {
			setSelectedDateType({
				label: dateTypes[searchparam],
				value: searchparam,
			})
		} else {
			searchParams.set('date-type', selectedDateType.value)
			setSearchParams(searchParams)
		}
	}, [])

	const [open, setOpen] = useState(false)

	const overlay = () => {
		return (
			<Flex vertical gap={5} className="shadow-lg rounded-[16px] bg-white p-2">
				{Object.entries(dateTypes).map(([key, value]: any) => (
					<p
						key={key}
						className="cursor-pointer"
						onClick={() => {
							searchParams.set('date-type', key)
							setSearchParams(searchParams)
							setSelectedDateType({
								label: value,
								value: key,
							})
							setOpen(false)
						}}
					>
						{value}
					</p>
				))}
			</Flex>
		)
	}

	return (
		<Flex className="w-[90%]" justify="end">
			<Dropdown
				overlay={overlay}
				trigger={['click']}
				open={open}
				onOpenChange={(open: boolean) => setOpen(open)}
			>
				<Flex
					align="center"
					justify="space-between"
					className="border-[1px] border-[#D8DADC] border-solid rounded-[16px] w-[120px] min-w-[120px] py-[2px] cursor-pointer px-2"
				>
					<p className="text-[16px] text-[#101010]">{selectedDateType.label}</p>
					<MdKeyboardArrowDown size={18} />
				</Flex>
			</Dropdown>
		</Flex>
	)
}
