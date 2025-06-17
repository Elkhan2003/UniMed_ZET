import { Flex } from 'antd'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDeleteUserMutation } from '../../../../store/services/user.service'
import { ReactComponent as Paper } from '../../../../assets/icons/Paper.svg'
import { ReactComponent as Call } from '../../../../assets/icons/Calling.svg'
import { ReactComponent as User } from '../../../../assets/icons/2 User.svg'
import { ReactComponent as Calendar } from '../../../../assets/icons/CalendarMini.svg'
import { ReactComponent as Comment } from '../../../../assets/icons/More Circle.svg'
import toast from 'react-hot-toast'
import { convertPhoneNumber } from '../../../../shared/lib/helpers/helpers'
import { GENDER_CONVERT } from '../../../../shared/lib/constants/constants'
import { ReactComponent as Whatsapp } from '../../../../assets/icons/WhatsApp.svg'
import { ReactComponent as Telegram } from '../../../../assets/icons/Telegram.svg'
import { RightOutlined } from '@ant-design/icons'
import { UserAppointments } from '../../../../components/Calendar/modals/user-appointments'
import { useState } from 'react'

interface InnerClientProps {
	innerData: any
	setOpen: any
	refetch: any
	setRegistered: (prev: boolean) => void
	setIsOpenModal: any
	setUserId: (prev: number) => void
	setDataNewUser: any
}

export const InnerClient = ({
	innerData,
	setOpen,
	refetch,
	setRegistered,
	setIsOpenModal,
	setUserId,
	setDataNewUser,
}: InnerClientProps) => {
	const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation()
	const [userAppointmentsOpen, setUserAppointmentsOpen] = useState(false)

	const handleDelete = async (id: number) => {
		try {
			await deleteUser(id).unwrap()
			refetch()
			toast.success('Клиент успешно удален')
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setOpen(false)
		}
	}

	const lastDated = `${innerData?.clientStatistics?.lastVisitDate?.split('T')[0] || 'Не'} ${innerData?.clientStatistics?.lastVisitDate?.split('T')[1]?.slice(0, 5) || 'указано'}`

	return (
		<Flex
			style={{ border: '1px solid rgb(230, 230, 230)' }}
			vertical
			align="center"
			gap={10}
			className="w-[60%] h-full p-[20px] bg-white rounded-[8px]"
		>
			<UserAppointments
				userId={innerData?.id}
				active={userAppointmentsOpen}
				handleClose={() => setUserAppointmentsOpen(false)}
			/>
			<Flex justify="space-between" className="w-full">
				<Flex
					gap={10}
					align="center"
					className="cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 px-2"
					onClick={() => setOpen(false)}
				>
					<FaArrowLeftLong />
					Назад
				</Flex>
				<Flex gap={10}>
					{innerData.isUnregistered && (
						<Button
							isLoading={deleteLoading}
							onClick={() => handleDelete(innerData?.id)}
							width="120px"
							backgroundColor="#FF5E5E"
						>
							Удалить
						</Button>
					)}
					<Button
						onClick={() => {
							setRegistered(innerData.isUnregistered)
							setUserId(innerData.id)
							setIsOpenModal(true)
							setDataNewUser({
								firstName: innerData.firstName || '',
								lastName: innerData.lastName || '',
								gender: {
									name: GENDER_CONVERT[innerData.gender],
									value: innerData.gender,
								},
								birthDate: innerData.birthDate || '2000-01-01',
								discount: innerData?.clientStatistics?.discount || 0,
								comment: innerData?.clientStatistics?.comment || '',
								authInfoUpdateRequest: {
									phoneNumber: innerData.phoneNumber,
									oldPassword: '',
									newPassword: '',
								},
							})
						}}
						width="150px"
					>
						Редактировать
					</Button>
				</Flex>
			</Flex>
			<Flex justify="center" className="bg-[#F9F9F9] w-full py-1 rounded-xl">
				<Flex gap={5} align="center" className="text-[#4E4E4E80]">
					<div className="w-[6px] h-[6px] bg-[#4E4E4E80] rounded-full" />
					{innerData.isUnregistered
						? 'Неавторизованный клиент'
						: 'Авторизованный клиент'}
				</Flex>
			</Flex>
			<Flex vertical align="center">
				<img
					className="w-[100px] h-[100px] rounded-full object-cover"
					alt="clientImage"
					src={innerData?.avatar}
				/>
				<p className="space-x-2 text-lg leading-6">
					{innerData?.firstName} {innerData?.lastName}
				</p>
				<Flex align="center" gap={5}>
					<p className="text-[#4E4E4E80] leading-4">
						Всего визитов: {innerData?.clientStatistics?.totalVisits || '0'}
					</p>
					<div
						onClick={(e) => {
							setUserAppointmentsOpen(true)
						}}
						className="rounded-[8px] p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
					>
						<RightOutlined />
					</div>
				</Flex>
			</Flex>
			<Flex gap={20} justify="center" className="">
				<Flex
					justify="center"
					align="center"
					className="bg-[#E8EAED] cursor-pointer w-11 h-11 rounded-[10px]"
				>
					<a
						href={`https://wa.me/${innerData?.phoneNumber}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Написать в WhatsApp"
					>
						<Whatsapp className="w-[30px]" />
					</a>
				</Flex>

				<Flex
					justify="center"
					align="center"
					className="bg-[#E8EAED] cursor-pointer w-11 h-11 rounded-[10px]"
				>
					<a
						href={`https://t.me/${innerData?.phoneNumber}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Написать в Telegram"
					>
						<Telegram className="w-[24px]" />
					</a>
				</Flex>
			</Flex>
			<div className="w-full grid grid-cols-3 gap-2">
				<div className="rounded-[10px] bg-[#E8EAED] p-3">
					<p className="text-center">
						{innerData?.clientStatistics?.totalVisits || '0'}/мес
					</p>
					<p className="text-[#4E4E4E80] text-[13px] text-center">
						Частота записей
					</p>
				</div>
				<div className="rounded-[10px] bg-[#E8EAED] p-3">
					<p className="text-center">
						{innerData?.clientStatistics?.averageCheck || '0'}
					</p>
					<p className="text-[#4E4E4E80] text-[13px] text-center">
						Средний чек
					</p>
				</div>
				<div className="rounded-[10px] bg-[#E8EAED] p-3">
					<p className="text-center">
						{innerData?.clientStatistics?.totalSpent || '0'}
					</p>
					<p className="text-[#4E4E4E80] text-[13px] text-center">Потрачено</p>
				</div>
				<div className="rounded-[10px] bg-[#E8EAED] p-3">
					<p className="text-center">
						{innerData?.clientStatistics?.bonuses || '0'}
					</p>
					<p className="text-[#4E4E4E80] text-[13px] text-center">Бонусы</p>
				</div>
				<div className="rounded-[10px] bg-[#E8EAED] p-3">
					<p className="text-center">
						{innerData?.clientStatistics?.balance || '0'}
					</p>
					<p className="text-[#4E4E4E80] text-[13px] text-center">Баланс</p>
				</div>
				<div className="rounded-[10px] bg-[#E8EAED] p-3">
					<p className="text-center">
						{innerData?.clientStatistics?.discount || '0'}%
					</p>
					<p className="text-[#4E4E4E80] text-[13px] text-center">Скидка</p>
				</div>
			</div>
			<div className="w-full space-y-3">
				<div className="flex gap-[10px]">
					<Paper />
					<p>Последний визит : {lastDated || 'Не указано'}</p>
				</div>
				<div className="flex gap-[10px]">
					<Call />
					<div>
						<p className="text-[#4E4E4E80] text-[13px]">Номер телефона</p>
						<p className="leading-4">
							{convertPhoneNumber(innerData?.phoneNumber) || '-'}
						</p>
					</div>
				</div>
				<div className="flex gap-[10px]">
					<User />
					<div>
						<p className="text-[#4E4E4E80] text-[13px]">Пол</p>
						<p className="leading-4">{GENDER_CONVERT[innerData?.gender]}</p>
					</div>
				</div>
				<div className="flex gap-[10px]">
					<Calendar />
					<div>
						<p className="text-[#4E4E4E80] text-[13px]">Дата рождения</p>
						<p className="leading-4">{innerData?.birthDate}</p>
					</div>
				</div>
				<div className="flex gap-[10px]">
					<Comment />
					<div>
						<p className="text-[#4E4E4E80] text-[13px]">Комментарий</p>
						<p className="leading-4">
							{innerData?.clientStatistics?.comment || 'Не указано'}
						</p>
					</div>
				</div>
			</div>
		</Flex>
	)
}
