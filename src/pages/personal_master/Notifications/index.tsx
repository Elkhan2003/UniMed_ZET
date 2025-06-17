import { Flex, Dropdown } from 'antd'
import { IoArrowBackOutline } from 'react-icons/io5'
import { Filter } from '../../../assets/icons/Filter'
import { TabTab } from '../../../components/shared/tab-tab'
import { useEffect, useState } from 'react'
import {
	useGetNotificationsQuery,
	useReadOneNotificationMutation,
} from '../../../store/services/push-template.service'
import { NotificationsCard } from './card'
import { useNavigate } from 'react-router-dom'
import { PERSONAL_ROUTES } from '../../../shared/lib/constants/routes'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { APPOINTMENT_STATUS, ROLES } from '../../../shared/lib/constants/constants'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { IoNotificationsOffOutline } from 'react-icons/io5'
import clsx from 'clsx'
import { Details } from '../../../components/Calendar/modals/details'
import { PinkPagination } from '../../../components/UI/Pagination'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

export default function NotificationsPage() {
	const navigate = useNavigate()
	const statuses = ['SEND', 'READ']
	const [activeTab, setActiveTab] = useState<number>(0)
	const [read] = useReadOneNotificationMutation()
	const [pagination, setPagination] = useState({ page: 1, size: 10 })
	const { role } = useSelector((state: RootState) => state.auth)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const id =
		role === ROLES.PERSONAl_MASTER
			? individualData?.masterId
			: branchAdminMasterJwt?.branchId

	const [open, setOpen] = useState(false)
	const [filter, setFilter] = useState<string[]>([])
	const [copy, setCopy] = useState<string[]>([])
	const [appointmentId, setAppointmentId] = useState(0)
	const [active, setActive] = useState(false)

	const { data, refetch } = useGetNotificationsQuery(
		{
			id: id,
			status: statuses[activeTab],
			appSatus: copy,
			...pagination,
		},
		{
			skip: !id,
		}
	)

	const haandleFilter = (item: string) => {
		if (filter.includes(item)) {
			setFilter(filter.filter((it) => it !== item))
		} else {
			setFilter([...filter, item])
		}
	}

	const readNoti = async (id: number) => {
		try {
			await read(id)
		} catch (error) {
			toast.error('Произошла ошибка')
		}
	}

	const overlay = (
		<Flex
			vertical
			gap={10}
			className="min-w-[270px] rounded-[16px] p-4 border-[1px] border-myviolet border-solid bg-white shadow-lg"
		>
			{APPOINTMENT_STATUS.map(
				(item: { label: string; value: string }, index) => (
					<Flex key={index} gap={10}>
						<div
							onClick={() => haandleFilter(item.value)}
							className={clsx(
								'w-5 h-5 rounded-[6px] flex justify-center cursor-pointer items-center border-[1px] border-[#D8DADC] border-solid',
								{ 'bg-myviolet': filter.includes(item.value) }
							)}
						>
							<IoCheckmarkOutline color="white" size={16} />
						</div>
						<p className="text-[16px] font-[300]">{item.label}</p>
					</Flex>
				)
			)}
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
		setPagination({ page: page, size: pageSize || pagination.size })
	}

	useEffect(() => {
		setPagination({ page: 1, size: 10 })
	}, [activeTab])

	const toRoute =
		role === ROLES.PERSONAl_MASTER ? PERSONAL_ROUTES.CALENDAR.path : '/'

	return (
		<Flex
			className="w-full h-[calc(100vh-45px)] overflow-y-auto p-[20px] bg-white"
			vertical
			gap={10}
		>
			<Details
				appointmentId={appointmentId}
				active={active}
				handleClose={() => setActive(false)}
				onSuccess={refetch}
				onOpen={readNoti}
			/>
			<Flex
				gap={10}
				align="center"
				justify="center"
				className="w-[130px] h-[30px] cursor-pointer"
				onClick={() => navigate(toRoute)}
			>
				<IoArrowBackOutline size={24} />
				<p className="text-[20px] font-[500] ">Назад</p>
			</Flex>
			<Flex justify="space-between">
				<p className="text-[24px] font-[500]">Уведомления</p>
				<Dropdown
					overlay={overlay}
					trigger={['click']}
					open={open}
					onOpenChange={handleOpenChange}
				>
					<div
						onClick={() => setOpen(!open)}
						className="flex items-center justify-center w-[125px] gap-[10px] h-[44px] rounded-[10px] border-[1px] border-[#D8DADC] border-solid cursor-pointer relative"
					>
						<Filter />
						<p className="text-[20px] font-[600] text-black">Фильтр</p>
						{copy.length > 0 && (
							<div className="absolute w-5 h-5 right-[-5px] top-[-8px] rounded-full bg-myviolet text-white flex items-center justify-center ">
								{copy.length}
							</div>
						)}
					</div>
				</Dropdown>
			</Flex>
			<TabTab
				active={activeTab}
				setActive={setActiveTab}
				panels={['Новые', 'Прочитанные']}
			/>
			{data?.content?.length ? (
				data?.content?.map((item: any, index: number) => (
					<div
						onClick={() => {
							setAppointmentId(item.appointmentId)
							setActive(true)
						}}
					>
						<NotificationsCard key={index} {...item} />
					</div>
				))
			) : (
				<Flex justify="center" align="center" className="w-full h-[70%]">
					<div className="flex flex-col items-center gap-2 justify-center">
						<IoNotificationsOffOutline color="#4E4E4E80" size={28} />
						<p className="text-[#4E4E4E80] text-[20px] font-[600]">
							Уведомлений нет
						</p>
					</div>
				</Flex>
			)}
			<div className="w-full flex justify-center">
				<PinkPagination
					current={pagination.page}
					pageSize={pagination.size}
					total={data?.totalElements}
					onChange={onPageChange}
				/>
			</div>
		</Flex>
	)
}
