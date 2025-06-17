import React, { useState } from 'react'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { ReactComponent as User } from '../../../../assets/icons/Profile.svg'
import { ReactComponent as Wallet } from '../../../../assets/icons/Wallet.svg'
import { ReactComponent as Users } from '../../../../assets/icons/3 User.svg'
import { ReactComponent as Calendar } from '../../../../assets/icons/Calendar copy.svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { StyledTitle } from '../../../../shared/styles'
import { Flex, Layout } from 'antd'
import {
	calculateRate,
	formatDuration,
} from '../../../../shared/lib/helpers/helpers'
import { useGetTarifsActiveQuery } from '../../../../store/queries/tarrif.service'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { SubMenu } from '../Menu'
import { ROLES } from '../../../../shared/lib/constants/constants'
import { AddStuffs } from '../Menu/add-stuffs'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { LongMenu } from '../Menu/longMenu'
dayjs.locale('ru')

interface TariffPlan {
	id: number
	name: string
	price: number
	pricePerUser: number
	durationInDays: number
	maxUsers: number
	discount: number
	colors?: string[]
	features?: string[]
	isActive: boolean
	currentNumberOfEmployees: number
}

interface AdditionalUsersState {
	id: number
	count: number
	price: number
}

interface CurrentTariff {
	tariff?: TariffPlan
	startDate?: string
	endDate?: string
	maxUsers: number
	currentNumberOfEmployees: number
}

interface OwnerData {
	category?: string
}

interface IndividualData {
	categoryType?: string
}

export const classNamesPositions = [
	'bottom-[-30px] left-[10px]',
	'top-[-20px] right-[40%]',
	'bottom-[-10px] right-[10px]',
]

const CurrentTarif: React.FC = () => {
	const tarriff =
		(useSelector(
			(state: RootState) => state.ownerCompany?.tarriff
		) as CurrentTariff) || {}
	const role = useSelector((state: RootState) => state.auth?.role) as string
	const ownerData =
		(useSelector(
			(state: RootState) => state.ownerCompany?.ownerData
		) as OwnerData) || {}
	const individualData =
		(useSelector(
			(state: RootState) => state.individual?.individualData
		) as IndividualData) || {}

	const [selectedTarif, setSelectedTarif] = useState<TariffPlan | null>(null)
	const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false)
	const [addStufModal, setAddStufModal] = useState(false)
	const [addStufWidget, setAddStuffWidget] = useState(false)
	const [longTarif, setLongTarif] = useState(false)
	const [countStuf, setCountStuf] = useState(0)
	const [active, setActive] = useState(false)

	const [isSubMenuOpen, setIsSubMenuOpen] = useState<boolean>(false)
	const [additionalUsers, setAdditionalUsers] = useState<AdditionalUsersState>({
		id: 0,
		count: 0,
		price: 0,
	})

	const categoryType: string | undefined =
		role === 'OWNER' ? ownerData?.category : individualData?.categoryType

	const { data: tariffPlans = [] } = useGetTarifsActiveQuery(categoryType, {
		skip: !role || !categoryType,
	})

	const handleOpenPayModal = (tarif: TariffPlan): void => {
		const calculatedPrice: number =
			tarif?.price +
			tarif?.pricePerUser *
				(tarif?.id === additionalUsers?.id ? additionalUsers?.count || 0 : 0)

		setSelectedTarif({
			...tarif,
			price: calculatedPrice,
			currentNumberOfEmployees: tarriff?.currentNumberOfEmployees || 0,
		})
	}

	const handleConfirmTarif = (): void => {
		setIsPayModalOpen(false)
		setIsSubMenuOpen(true)
	}

	const currentTariff = tarriff?.tariff || ({} as any)
	const currentDate = dayjs()

	const startDate = dayjs(tarriff.startDate)
	const endDate = dayjs(tarriff.endDate)
	const totalMonths = endDate.diff(startDate, 'month') + 1

	const totalDays = endDate.diff(startDate, 'day')
	const elapsedDays = currentDate.diff(startDate, 'day')
	const daysRemaining = endDate.diff(currentDate, 'day')
	const positionPercentage = Math.min(
		Math.max((elapsedDays / totalDays) * 100, 0),
		100
	)

	const months = []
	const step = totalMonths > 12 ? 3 : 1
	for (let i = 0; i < totalMonths; i += step) {
		const monthDate = startDate.add(i, 'month')
		months.push({
			name:
				monthDate.format('MMMM').charAt(0).toUpperCase() +
				monthDate.format('MMMM').slice(1),
			isPast:
				monthDate.isBefore(currentDate, 'month') ||
				(monthDate.month() === currentDate.month() &&
					monthDate.year() === currentDate.year()),
		})
	}

	const startDateShow = dayjs(tarriff?.startDate).format('DD MMMM YYYY')
	const endDateShow = dayjs(tarriff?.endDate).format('DD MMMM YYYY')

	const renderCurrentTariffDetails = (): JSX.Element => {
		const currentTariff: TariffPlan = tarriff?.tariff || ({} as TariffPlan)
		const endDate: string | undefined = tarriff?.endDate

		return (
			<Flex
				vertical
				gap={20}
				className="p-4 w-full bg-white rounded-[20px] border-[1px] border-[#F2F2F1] border-solid relative overflow-clip"
			>
				{currentTariff?.colors?.map((color: string, index: number) => (
					<div
						key={index}
						className={`absolute ${classNamesPositions[index % classNamesPositions.length]} h-24 w-24 rounded-full blur-3xl`}
						style={{ backgroundColor: color }}
					></div>
				))}

				<Flex align="center" justify="space-between">
					<StyledTitle className="font-[600]">
						{currentTariff?.name || 'Тариф не выбран'}
					</StyledTitle>
					{currentTariff?.price > 0 ? (
						<Button
							width="fit-content"
							borderRadius="16px"
							disabled={daysRemaining > 0}
							onClick={() => {
								setCountStuf(0)
								if (role === ROLES.OWNER) {
									setSelectedTarif(currentTariff)
									setLongTarif(true)
								} else {
									handleOpenPayModal(tarriff.tariff || ({} as TariffPlan))
									setIsSubMenuOpen(true)
								}
							}}
						>
							Продлить
						</Button>
					) : (
						''
					)}
				</Flex>

				<Flex justify="space-between">
					<Flex gap={8} align="center">
						<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
							<Wallet />
						</Flex>
						<Flex gap={-5} vertical>
							<p className="text-[#4E4E4E80] text-[12px]">Стоимость тарифа</p>
							<p className="font-[600] text-[12px]">
								{currentTariff?.price || 0} сом /{' '}
								{formatDuration(currentTariff?.durationInDays || 0)}
							</p>
						</Flex>
					</Flex>
					{role === ROLES.PERSONAl_MASTER ? (
						<Flex gap={8} align="center">
							<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
								<Calendar />
							</Flex>
							<Flex gap={-5} vertical>
								<p className="text-[#4E4E4E80] text-[12px]">Цена за месяц</p>
								<p className="font-[600] text-[12px]">
									{calculateRate(
										currentTariff?.price || 0,
										currentTariff?.durationInDays || 30
									)}
								</p>
							</Flex>
						</Flex>
					) : (
						''
					)}
					{role === ROLES.OWNER && currentTariff?.price > 0 ? (
						<Flex gap={8} align="center">
							<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
								<User />
							</Flex>
							<Flex gap={-5} vertical>
								<p className="text-[#4E4E4E80] text-[12px]">За 1 сотрудника</p>
								<p className="font-[600] text-[12px]">
									{currentTariff?.pricePerUser} сом
								</p>
							</Flex>
						</Flex>
					) : (
						''
					)}

					{role === ROLES.OWNER && currentTariff?.price ? (
						<Flex gap={8} align="center">
							<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
								<Users />
							</Flex>
							<Flex gap={-5} vertical>
								<p className="text-[#4E4E4E80] text-[12px]">
									Кол-во сотрудников
								</p>
								<p className="font-[600] text-[12px]">
									{tarriff?.maxUsers || 0}
									<span
										onClick={() => {
											setSelectedTarif(currentTariff)
											setAddStufModal(true)
										}}
										className="text-myviolet ml-2 text-[12px] font-[600] cursor-pointer leading-3"
									>
										+Добавить
									</span>
								</p>
							</Flex>
						</Flex>
					) : (
						''
					)}

					{role === ROLES.OWNER && currentTariff?.price > 0 ? (
						<Flex gap={8} align="center">
							<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
								<Users />
							</Flex>
							<Flex gap={-5} vertical>
								<p className="text-[#4E4E4E80] text-[12px]">
									Текущие сотрудники
								</p>
								<p className="font-[600] text-[12px]">
									{tarriff?.currentNumberOfEmployees || 0}
								</p>
							</Flex>
						</Flex>
					) : (
						''
					)}

					<Flex gap={8} align="center">
						<Flex
							style={{
								backgroundColor: daysRemaining > 0 ? '#F2F2F1' : '#FF5E5E',
							}}
							className="p-[6px]  rounded-[10px]"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M1.9929 10.0177C1.9929 6.28975 5.01498 3.26768 8.7429 3.26768C12.4708 3.26768 15.4929 6.28975 15.4929 10.0177C15.4929 13.7456 12.4708 16.7677 8.7429 16.7677C5.01498 16.7677 1.9929 13.7456 1.9929 10.0177ZM3.1179 10.0177C3.1179 13.1243 5.6363 15.6427 8.7429 15.6427C10.2347 15.6427 11.6655 15.05 12.7204 13.9952C13.7753 12.9403 14.3679 11.5095 14.3679 10.0177C14.3679 6.91108 11.8495 4.39268 8.7429 4.39268C5.6363 4.39268 3.1179 6.91108 3.1179 10.0177Z"
									fill={daysRemaining > 0 ? 'black' : 'white'}
								/>
								<path
									d="M6.9804 7.16018C6.75877 6.95366 6.4134 6.95975 6.19919 7.17396C5.98498 7.38817 5.97888 7.73354 6.1854 7.95518L8.1804 9.95018V13.0177C8.1804 13.3283 8.43224 13.5802 8.7429 13.5802C9.05356 13.5802 9.3054 13.3283 9.3054 13.0177V9.71768C9.30527 9.56854 9.24592 9.42557 9.1404 9.32018L6.9804 7.16018Z"
									fill={daysRemaining > 0 ? 'black' : 'white'}
								/>
								<path
									d="M15.8904 4.39268C14.9644 3.1578 13.7345 2.1837 12.3204 1.56518C12.1824 1.50262 12.025 1.49839 11.8838 1.55344C11.7426 1.6085 11.6296 1.71819 11.5704 1.85768C11.5056 1.99541 11.5003 2.1537 11.5556 2.29549C11.6109 2.43729 11.722 2.55016 11.8629 2.60768C13.0981 3.15116 14.1726 4.00352 14.9829 5.08268C15.0891 5.22432 15.2559 5.30768 15.4329 5.30768C15.5547 5.30823 15.6733 5.26869 15.7704 5.19518C15.8953 5.10661 15.9787 4.97094 16.0014 4.81949C16.024 4.66805 15.9839 4.51391 15.8904 4.39268Z"
									fill={daysRemaining > 0 ? 'black' : 'white'}
								/>
								<path
									d="M2.4954 5.06768C3.30569 3.98852 4.38018 3.13616 5.6154 2.59268C5.75631 2.53516 5.86742 2.42229 5.92272 2.28049C5.97802 2.1387 5.97267 1.98041 5.9079 1.84268C5.84868 1.70319 5.73569 1.5935 5.59452 1.53844C5.45334 1.48339 5.29592 1.48762 5.1579 1.55018C3.74477 2.17399 2.51739 3.15332 1.5954 4.39268C1.4334 4.63417 1.48217 4.95934 1.7079 5.14268C1.80501 5.21619 1.92361 5.25573 2.0454 5.25518C2.2161 5.2643 2.38169 5.19531 2.4954 5.06768Z"
									fill={daysRemaining > 0 ? 'black' : 'white'}
								/>
							</svg>
						</Flex>
						<Flex gap={-5} vertical>
							<p
								style={{ color: daysRemaining > 0 ? '#4E4E4E80' : '#FF5E5E' }}
								className=" text-[12px]"
							>
								Дата продления
							</p>
							<p
								style={{ color: daysRemaining > 0 ? 'black' : '#FF5E5E' }}
								className="font-[600] text-[12px]"
							>
								{endDate ? dayjs(endDate).format('DD MMMM YYYY') : 'Не указана'}
							</p>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		)
	}

	const renderTariffPlans = (): JSX.Element => {
		return (
			<div className="w-full grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
				{tariffPlans.map(
					(plan: TariffPlan, index: number) =>
						plan.price > 0 && (
							<div
								key={index}
								className="border-[1px] border-[#F2F2F1] border-solid rounded-[28px] overflow-hidden bg-white"
							>
								<div className="w-full h-[60px] relative overflow-clip">
									{plan.colors?.map((color: string, innerIndex: number) => (
										<div
											key={innerIndex}
											className={`absolute ${classNamesPositions[innerIndex % classNamesPositions.length]} h-16 w-16 rounded-full blur-xl`}
											style={{ backgroundColor: color }}
										></div>
									))}

									<div className="w-full h-full items-center flex justify-between px-4">
										<p className="text-[14px] text-[#101010] font-[600] z-[60]">
											{plan.name || `План ${index + 1}`}
										</p>
										<p className="text-[#D8DADC] text-[55px] absolute right-8 z-[50] mb-[-30px] font-[600]">
											{index + 1}
										</p>
									</div>
								</div>

								<div
									style={{ borderTop: '1px solid #F2F2F1' }}
									className="w-full p-[20px]"
								>
									<p>
										<span className="text-[24px] ">
											<span className="text-[#4E4E4E80] text-[18px]">
												{plan?.id === additionalUsers?.id &&
												additionalUsers.price > 0
													? `${additionalUsers.price} c + `
													: ''}
											</span>
											{plan?.price || 0} c
										</span>{' '}
										/ <span>{formatDuration(plan.durationInDays || 30)}</span>
									</p>

									<Flex gap={10} className="flex items-star">
										<p className="text-[#4E4E4E80]">
											{calculateRate(
												plan.price || 0,
												plan.durationInDays || 30
											)}
										</p>
										{plan.discount > 0 && (
											<div className="bg-[#FFDEEE] text-myviolet rounded-[10px] px-2">
												<span className="text-[12px]">Скидка</span>{' '}
												{plan.discount || 0} %
											</div>
										)}
									</Flex>

									{plan.price > 0 && (
										<Button
											onClick={() => {
												if (role === ROLES.OWNER) {
													setCountStuf(0)
													handleOpenPayModal(plan)
													setLongTarif(true)
												} else {
													handleOpenPayModal(plan)
													setIsSubMenuOpen(true)
												}
											}}
											borderRadius="24px"
											margin="40px 0px 00px 0px"
										>
											Начать
										</Button>
									)}

									{role === ROLES.OWNER && plan.price > 0 && (
										<>
											<p className="text-[#101010] text-[14px] mt-4">
												Кол-во сотрудников: {plan?.maxUsers || 0}
											</p>
											<p className="text-[#4E4E4E80] text-[12px] mt-2">
												При добавлении следующего сотрудника к оплате
												прибавляется -{' '}
												<span className="text-black">
													{plan.pricePerUser || 0}с
												</span>
											</p>
										</>
									)}
								</div>
							</div>
						)
				)}
			</div>
		)
	}

	// Payment confirmation modal
	const renderPaymentModal = (): JSX.Element => (
		<ModalComponent
			handleClose={() => setIsPayModalOpen(false)}
			title="Подтверждение тарифного плана"
			active={isPayModalOpen}
		>
			<div className="flex flex-col justify-center items-center gap-4 w-[330px] my-2 mx-3">
				<p className="text-md xs:text-sm mt-1 text-center">
					{selectedTarif ? (
						<>
							Вы выбрали тариф "{selectedTarif?.name || ''},{' '}
							{formatDuration(selectedTarif?.durationInDays || 0)}, <br />{' '}
							{selectedTarif?.price || 0} с". Подтвердите своё решение, чтобы
							продолжить.
						</>
					) : (
						'Выберите тарифный план, чтобы продолжить.'
					)}
				</p>

				<div className="flex justify-between items-center gap-2">
					<Button
						onClick={() => setIsPayModalOpen(false)}
						backgroundColor="transparent"
						border="1px var(--myviolet) solid"
						color="var(--myviolet)"
					>
						нет
					</Button>
					<Button onClick={handleConfirmTarif}>да</Button>
				</div>
			</div>
		</ModalComponent>
	)

	const renderConformationModal = (): JSX.Element => {
		return (
			<ModalComponent
				handleClose={() => setAddStufModal(false)}
				title="Подтверждение"
				active={addStufModal}
			>
				<div className="flex flex-col justify-center items-center gap-4 w-[280px] my-2 mx-3">
					<p className="text-md xs:text-sm mt-1 text-center">
						Вы действительно хотите добавить нового сотрудника?
					</p>

					<div className="flex justify-between items-center gap-2">
						<Button
							onClick={() => setAddStufModal(false)}
							backgroundColor="transparent"
							border="1px var(--myviolet) solid"
							color="var(--myviolet)"
						>
							Отмена
						</Button>
						<Button
							onClick={() => {
								setAddStufModal(false)
								setAddStuffWidget(true)
							}}
						>
							Добавить
						</Button>
					</div>
				</div>
			</ModalComponent>
		)
	}

	return (
		<div className="w-full min-h-[calc(100vh-45px)]">
			{renderPaymentModal()}
			{renderConformationModal()}
			<LongMenu
				active={longTarif}
				handleClose={() => {
					setLongTarif(false)
					setActive(false)
				}}
				tarif={selectedTarif}
				stuffCount={countStuf}
				setStuffCount={setCountStuf}
				onSelect={() => {
					setLongTarif(false)
					setIsSubMenuOpen(true)
					setActive(false)
				}}
				selectedTarif={selectedTarif}
				setSelectedTarif={setSelectedTarif}
			/>
			<SubMenu
				active={isSubMenuOpen}
				handleClose={() => {
					setIsSubMenuOpen(false)
					setActive(false)
				}}
				tarif={selectedTarif}
				stuffCount={countStuf}
				isActive={active}
			/>
			<AddStuffs
				active={addStufWidget}
				handleClose={() => {
					setActive(false)
					setCountStuf(0)
					setAddStuffWidget(false)
				}}
				stuffCount={countStuf}
				setStuffCount={setCountStuf}
				selectedTarif={selectedTarif}
				setSelectedTarif={setSelectedTarif}
				onSelect={() => {
					setAddStuffWidget(false)
					setIsSubMenuOpen(true)
					setActive(true)
				}}
			/>
			<Flex
				align="center"
				style={{ borderBottom: '1px solid #D8DADC' }}
				className="px-[20px] h-[60px] flex items-center bg-white"
			>
				<p className="text-[20px]">Текущий тариф</p>
			</Flex>

			<Layout className="p-4 min-h-[calc(100vh-105px)] w-full">
				{renderCurrentTariffDetails()}
				<Flex vertical gap={15} className="mt-4 px-2">
					<p className="Срок действия text-[#101010] text-[14px]">
						Срок действия
					</p>
					<div className="flex justify-between text-[10px] mb-1 text-gray-500">
						{months.map((month, idx) => (
							<div key={idx} className="flex-1 text-center">
								{month.name}
							</div>
						))}
					</div>

					<div className="relative w-full max-w-full">
						<div className="absolute inset-0 flex h-2">
							{months.map((month, idx) => {
								return (
									<div
										key={idx}
										className="h-2 rounded-full"
										style={{
											flexGrow: 1,
											background: '#E0E0E0',
											margin: '0 2px',
										}}
									/>
								)
							})}
						</div>

						<div
							className="absolute h-2 rounded-full"
							style={{
								width: `${positionPercentage}%`,
								left: 2,
								top: '0px',
								background: `linear-gradient(to right, ${currentTariff?.colors?.length ? currentTariff?.colors?.join(', ') : ['gray']})`,
							}}
						/>
						<div
							className="absolute rounded-full shadow-md p-1"
							style={{
								left: `calc(${positionPercentage}% - 8px)`,
								top: '-4px',
								backgroundColor:
									currentTariff?.colors[currentTariff?.colors?.length - 1] ||
									'black',
							}}
						>
							<div className="bg-white h-2 w-2 rounded-full" />
						</div>

						<div
							className="absolute text-[12px] font-[600] text-[#101010]"
							style={{
								left: `calc(${positionPercentage}% - 16px)`,
								top: '-20px',
							}}
						>
							{(() => {
								const days = elapsedDays
								let dayWord = 'дней'

								const lastDigit = days % 10
								const lastTwoDigits = days % 100

								if (lastDigit === 1 && lastTwoDigits !== 11) {
									dayWord = 'день'
								} else if (
									[2, 3, 4].includes(lastDigit) &&
									![12, 13, 14].includes(lastTwoDigits)
								) {
									dayWord = 'дня'
								}

								return daysRemaining > 0 ? `${days} ${dayWord}` : 'Истек'
							})()}
						</div>
					</div>
					<Flex justify="space-between">
						<p className="text-[#101010] text-[12px] font-[600]">
							{startDateShow}
						</p>

						<p className="text-[#101010] text-[12px] font-[600]">
							{endDateShow}
						</p>
					</Flex>
				</Flex>
				{renderTariffPlans()}
			</Layout>
		</div>
	)
}

export default CurrentTarif