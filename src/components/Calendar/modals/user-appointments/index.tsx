import { useEffect, useState } from 'react'
import { ModalComponent } from '../../../UI/Modal/Modal'
import {
	useGetUserAppointmentsQuery,
	useGetOneUserQuery,
} from '../../../../store/services/calendar.service'
import { IoArrowBack, IoCheckmarkOutline } from 'react-icons/io5'
import { Dropdown, Flex } from 'antd'
import { Button } from '../../../UI/Buttons/Button/Button'
import { APPOINTMENT_STATUS } from '../../../../shared/lib/constants/constants'
import clsx from 'clsx'
import { Filter } from '../../../../assets/icons/Filter'
import { UserAppCard } from './card'
import { PinkPagination } from '../../../UI/Pagination'
import Loading from '../../../../pages/loading'
import { SlModal } from '../../../shared/sl-modal'

interface UserAppointmentsProps {
	userId: number
	active: boolean
	handleClose: (props?: any) => void
}

export const UserAppointments = ({
	userId,
	active,
	handleClose,
}: UserAppointmentsProps) => {
	const [pagination, setPagination] = useState({ page: 1, size: 10 })
	const { data: oneUser, isLoading: oneUserLoading } = useGetOneUserQuery(
		userId,
		{ skip: !userId || !active }
	)

	const [open, setOpen] = useState(false)
	const [filter, setFilter] = useState<string[]>([])
	const [copy, setCopy] = useState<string[]>([])

	const { data, isLoading: userAppLoading } = useGetUserAppointmentsQuery(
		{ userId, pagination, appStatus: copy },
		{ skip: !userId || !active }
	)

	const handleFilter = (item: string) => {
		if (filter.includes(item)) {
			setFilter(filter.filter((it) => it !== item))
		} else {
			setFilter([...filter, item])
		}
	}

	const isLoading = oneUserLoading || userAppLoading

	const overlay = (
		<Flex
			vertical
			gap={10}
			className="min-w-[270px] rounded-[16px] p-4 border-[1px] border-myviolet border-solid bg-white shadow-lg"
		>
			{APPOINTMENT_STATUS.map((item, index) => (
				<Flex key={index} gap={10}>
					<div
						onClick={() => handleFilter(item.value)}
						className={clsx(
							'w-5 h-5 rounded-[6px] flex justify-center cursor-pointer items-center border-[1px] border-[#D8DADC] border-solid',
							{ 'bg-myviolet': filter.includes(item.value) }
						)}
					>
						<IoCheckmarkOutline color="white" size={16} />
					</div>
					<p className="text-[16px] font-[300]">{item.label}</p>
				</Flex>
			))}
			<Flex gap={10} justify="space-between">
				<Button
					border="1px solid #D8DADC"
					backgroundColor="transparent"
					color="black"
					onClick={() => {
						setOpen(false)
						setFilter([])
					}}
				>
					Отмена
				</Button>
				<Button
					onClick={() => {
						setCopy(filter)
						setOpen(false)
					}}
				>
					Применить
				</Button>
			</Flex>
		</Flex>
	)

	const handleOpenChange = (flag: boolean) => {
		setOpen(flag)
	}

	const onPageChange = (page: number, pageSize?: number) => {
		setPagination({ page, size: pageSize || pagination.size })
	}

	useEffect(() => {
		setPagination({ page: 1, size: 10 })
		setFilter([])
		setCopy([])
	}, [active])

	return (
		<SlModal
			active={active}
			title=""
			handleClose={handleClose}
		>
			{isLoading ? (
				<div className="min-w-[410px] min-h-[640px] flex items-center justify-center">
					<Loading />
				</div>
			) : (
				<>
					<div className="min-w-[410px] min-h-[640px] flex flex-col gap-[10px]">
						<div className="flex items-center gap-[10px]">
							<div
								onClick={handleClose}
								className="bg-[#D8DADC] rounded-[8px] w-10 h-10 flex items-center justify-center cursor-pointer"
							>
								<IoArrowBack size={20} />
							</div>
							<p className="text-lg font-[500]">
								<span>{oneUser?.firstName}</span>
								<span>{oneUser?.lastName}</span>
							</p>
						</div>
						<div className="w-full flex items-center gap-[10px] justify-between">
							<div>
								<p>
									Все записи: <span>{data?.totalElements}</span>
								</p>
								<p>
									На странице: <span>{data?.content?.length || 0}</span>
								</p>
							</div>
							<Dropdown
								overlay={overlay}
								trigger={['click']}
								open={open}
								onOpenChange={handleOpenChange}
							>
								<div
									onClick={() => setOpen(!open)}
									className="flex items-center justify-center w-[105px] gap-[10px] h-[34px] rounded-[10px] border-[1px] border-[#D8DADC] border-solid cursor-pointer relative"
								>
									<Filter />
									<p className="font-[600] text-black">Фильтр</p>
									{copy.length > 0 && (
										<div className="absolute w-5 h-5 right-[-5px] top-[-8px] rounded-full bg-myviolet text-white flex items-center justify-center ">
											{copy.length}
										</div>
									)}
								</div>
							</Dropdown>
						</div>
						<div className="max-h-[500px] overflow-y-auto flex flex-col gap-[10px]">
							{data?.content?.map((item: any, index: number) => (
								<div key={index}>
									<UserAppCard item={item} />
								</div>
							))}
						</div>
						<div className="w-full flex justify-center">
							<PinkPagination
								current={pagination.page}
								pageSize={pagination.size}
								total={data?.totalElements}
								onChange={onPageChange}
							/>
						</div>
					</div>
				</>
			)}
		</SlModal>
	)
}
