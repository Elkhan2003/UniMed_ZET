import { ReactComponent as User } from '../../../../../assets/icons/Profile.svg'
import { ReactComponent as Wallet } from '../../../../../assets/icons/Wallet.svg'
import Widget from '../../../../../components/UI/Widget'
import { Flex } from 'antd'
import { RiErrorWarningLine } from 'react-icons/ri'
import { useState } from 'react'
import { clsx } from 'clsx'
import { classNamesPositions } from '../../CurrentTarif'
import { formatDuration } from '../../../../../shared/lib/helpers/helpers'
import { Button } from '../../../../../components/UI/Buttons/Button/Button'

declare global {
	interface Window {
		PayBox: any
	}
}
function getSomsText(amount: number) {
	const lastDigit = amount % 10
	const lastTwoDigits = amount % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'сомов'
	}
	if (lastDigit === 1) {
		return 'сом'
	}
	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'сома'
	}
	return 'сомов'
}

function getEmployeesText(amount: number) {
	const lastDigit = amount % 10
	const lastTwoDigits = amount % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'сотрудников'
	}
	if (lastDigit === 1) {
		return 'сотрудник'
	}
	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'сотрудника'
	}
	return 'сотрудников'
}

interface LongMenuProps {
	active: boolean
	handleClose: () => void
	tarif: any
	stuffCount: number
	setStuffCount: (prev: any) => void
	onSelect: () => void
	selectedTarif: any
	setSelectedTarif: (prev: any) => void
}

export const LongMenu = ({
	active,
	handleClose,
	tarif,
	stuffCount,
	setStuffCount,
	onSelect,
	selectedTarif,
	setSelectedTarif,
}: LongMenuProps) => {
	const [step, setStep] = useState(0)
	const prev = () => {
		if (step === 0) {
			setStep(0)
			setStuffCount(0)
			handleClose()
		}
		if (step === 1) {
			setStep(0)
		}
	}

	const handleClick = () => {
		switch (step) {
			case 0:
				setStep((prev: number) => prev + 1)
				break
			case 1:
				setSelectedTarif({
					...selectedTarif,
					price: tarif.price + selectedTarif?.pricePerUser * stuffCount || 1,
				})
				onSelect()
				break
			default:
				break
		}
	}

	function getUsersWord(n: any) {
		const lastDigit = n % 10
		const lastTwoDigits = n % 100

		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'сотрудников'
		if (lastDigit === 1) return 'сотрудник'
		if (lastDigit >= 2 && lastDigit <= 4) return 'сотрудника'
		return 'сотрудников'
	}

	const isLeast =
		tarif?.maxUsers + stuffCount < tarif?.currentNumberOfEmployees

	return (
		<Widget
			active={active}
			handleClose={() => {
				setStep(0)
				setStuffCount(0)
				handleClose()
			}}
			back={prev}
		>
			<div className="w-full h-full mt-14">
				<Flex justify="center">
					<Flex align="center" gap={5}>
						{Array.from({ length: 2 }).map((_, index) => (
							<Flex
								key={index}
								justify="center"
								align="center"
								onClick={() => setStep(index)}
								className={clsx(
									'w-[30px] h-[30px] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-200',
									{
										'bg-[#332C39]': index === step,
										'bg-[#D8DADC]': index !== step,
									}
								)}
							>
								{index + 1}
							</Flex>
						))}
					</Flex>
				</Flex>

				{step === 0 && (
					<div className="w-full mt-4">
						<div className="flex gap-2 px-5">
							<RiErrorWarningLine size={20} className="mt-1" />
							<p>Ваш тариф</p>
						</div>
						<div className="px-10 mt-4">
							<div className="border-[1px] border-[#F2F2F1] border-solid rounded-[28px] overflow-hidden bg-white">
								<div className="w-full h-[60px] relative overflow-clip">
									{tarif?.colors?.map((color: string, innerIndex: number) => (
										<div
											key={innerIndex}
											className={`absolute ${classNamesPositions[innerIndex % classNamesPositions.length]} h-16 w-16 rounded-full blur-xl`}
											style={{ backgroundColor: color }}
										></div>
									))}

									<div className="w-full h-full items-center flex justify-between px-4">
										<p className="text-[14px] text-[#101010] font-[600] z-[60]">
											{tarif?.name || `План 1`}
										</p>
										<p className="text-[#D8DADC] text-[55px] absolute right-8 z-[50] mb-[-30px] font-[600]">
											1
										</p>
									</div>
								</div>

								<div
									style={{ borderTop: '1px solid #F2F2F1' }}
									className="w-full p-[20px]"
								>
									<Flex gap={8} align="center">
										<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
											<Wallet />
										</Flex>
										<Flex gap={-5} vertical>
											<p className="text-[#4E4E4E80] text-[12px]">
												Стоимость тарифа
											</p>
											<p className="font-[600] text-[12px]">
												{tarif?.price || 0} сом /{' '}
												{formatDuration(tarif?.durationInDays || 0)}
											</p>
										</Flex>
									</Flex>
									<Flex gap={8} align="center" className="mt-4">
										<Flex className="p-[6px] bg-[#F2F2F1] rounded-[10px]">
											<User />
										</Flex>
										<Flex gap={-5} vertical>
											<p className="text-[#4E4E4E80] text-[12px]">
												За 1 сотрудника
											</p>
											<p className="font-[600] text-[12px]">
												{tarif?.pricePerUser} сом
											</p>
										</Flex>
									</Flex>
									<p className="text-[#101010] text-[14px] mt-2">
										К этому плану предоставляется {tarif?.maxUsers} сотрудника
									</p>
									<p className="text-[#4E4E4E80] text-[12px] mt-2">
										При добавлении следующего сотрудника к оплате прибавляется -
										{tarif?.pricePerUser} с
									</p>
								</div>
							</div>
						</div>
						<div
							style={{ borderTop: '1px solid #D8DADC' }}
							className="py-8 mt-8"
						>
							<Flex justify="end" className="px-10">
								<Button width="fit-content" onClick={handleClick}>
									Далее
								</Button>
							</Flex>
						</div>
					</div>
				)}
				{step === 1 && (
					<div className="w-full mt-4">
						<div className="flex gap-2 px-5">
							<RiErrorWarningLine size={20} className="mt-1" />
							<div>
								<p>Подтвердите общее кол-во сотрудников</p>
								<p className="text-[#4E4E4E80] text-[15px]">
									По стандарту предоставляется {tarif?.maxUsers}{' '}
									{getUsersWord(tarif?.maxUsers)}
								</p>
								<p className="text-[#FF5E5E] text-[15px] mt-2">
									При добавлении следующего сотрудника к оплате прибавляется –
									{tarif?.pricePerUser} {getSomsText(tarif?.pricePerUser)}.
								</p>
							</div>
						</div>
						<p className="mt-2 text-[15px] ml-7 px-5">
							Ваше текущее кол-во сотрудников: {tarif?.currentNumberOfEmployees}
						</p>
						<p className="mt-8 text-[15px] ml-7 px-5">
							Укажите кол-во новых сотрудников
						</p>
						<div className="flex py-2 gap-2 ml-7 px-5">
							<div
								onClick={() => {
									if (stuffCount > 0) setStuffCount((prev: number) => prev - 1)
								}}
								className="bg-[#F2F2F1] rounded-full px-[8px] cursor-pointer text-myviolet"
							>
								-
							</div>
							<p>{stuffCount + tarif?.maxUsers}</p>
							<div
								onClick={() => setStuffCount((prev: number) => prev + 1)}
								className="bg-[#F2F2F1] rounded-full px-[6px] cursor-pointer text-myviolet"
							>
								+
							</div>
						</div>
						{isLeast && (
							<p className="text-[#FF5E5E] ml-12 text-[13px]">
								*Число сотрудников не может быть меньше вашего текущего
								количества сотрудников. Вам необходимо приобрести не менее{' '}
								{tarif?.currentNumberOfEmployees}
								сотрудников.
							</p>
						)}
						<div className="px-10">
							<div
								style={{ borderTop: '1px solid #F2F2F1' }}
								className="w-full mt-4 py-4"
							>
								<Flex
									justify="space-between"
									className="text-[#101010] text-[14px]"
								>
									<p>
										Базовый план, {formatDuration(tarif.durationInDays)},{' '}
										{tarif?.maxUsers} {getEmployeesText(tarif?.maxUsers)}
									</p>

									<p>{tarif.price} с</p>
								</Flex>
								<Flex
									justify="space-between"
									className="text-[#101010] text-[14px] mt-1"
								>
									<p>Дополнительно {stuffCount} сотрудников</p>
									<p>
										{stuffCount > 0 ? tarif?.pricePerUser * stuffCount : 0} с
									</p>
								</Flex>
								<Flex
									justify="space-between"
									className="text-[#101010] text-[14px] mt-4"
								>
									<p>К оплате</p>
									<p>
										{tarif.price + (stuffCount * tarif.pricePerUser || 0)} с
									</p>
								</Flex>
							</div>
						</div>
						<div
							style={{ borderTop: '1px solid #D8DADC' }}
							className="py-8 mt-8"
						>
							<Flex justify="end" className="px-10">
								<Button
									width="fit-content"
									disabled={isLeast}
									onClick={handleClick}
								>
									Далее
								</Button>
							</Flex>
						</div>
					</div>
				)}
			</div>
		</Widget>
	)
}
