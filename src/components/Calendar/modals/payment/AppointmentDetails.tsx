import { ModalComponent } from '../../../UI/Modal/Modal'
import { FaCheck, FaRegUser } from 'react-icons/fa6'
import { IoMdTime } from 'react-icons/io'
import { TbDotsCircleHorizontal } from 'react-icons/tb'
import { ReactComponent as ServiceFolder } from '../../../../assets/icons/service-folder.svg'
import { formatPhoneNumber, formatServiceInfo } from '../../../../shared/lib/helpers/helpers'

interface ServiceDate {
	duration: number
	label: string
	value: number
}

const AppointmentDetails = (props: any) => {

	const start = new Date(
		`1970-01-01T${props.appointmentsCalendarData.startTime}Z`
	)
	const end = new Date(`1970-01-01T${props.appointmentsCalendarData.endTime}Z`)

	const durationMilliseconds = end.getTime() - start.getTime()

	const durationMinutes = durationMilliseconds / 1000 / 60

	const currentFindMaster = props?.dataMaster?.find((item: any) => {
		return item.id === props?.appointmentsCalendarData?.masterId?.value
	})

	const PAYMENT_TYPE: { [key: string]: string } = {
		MBANK: 'MBANK',
		OPTIMA: 'Optima Bank',
		BONUS: 'Бонусы',
		CARD: 'Карта',
		CASH: 'Наличные',
		DISCOUNT: 'Скидка',
	}

	return (
		<ModalComponent
			active={props?.active}
			title={
				<div className="flex items-center justify-between p-1 pt-[3px]">
					<h2 className="text-[20px] font-semibold">
						Запись №{props?.recordNumber}
					</h2>
				</div>
			}
			handleClose={props?.onClose}
		>
			<div className="p-1 w-[400px] sm:w-[300px]">
				<div className="flex items-center justify-between mb-4">
					<div
						className={`px-3 py-2 text-base flex gap-[8px] font-medium rounded-[8px] ${props?.appointmentsCalendarData?.appointmentStatus?.label === 'Завершенный' ? 'bg-[#3FC24C] text-[#FFFFFF]' : 'bg-gray-100 text-gray-800'}`}
					>
						<div className="w-[20px] h-[20px] bg-[#FFFFFF] rounded-[4px] flex items-center justify-center">
							<FaCheck className="fill-[#3FC24C] " />
						</div>
						{props?.appointmentsCalendarData?.appointmentStatus?.label}
					</div>
				</div>
				<div className="flex gap-[10px] mb-[10px]">
					<button className="w-[30px] h-[30px] bg-[#F2F2F1] rounded-[50%] flex items-center justify-center">
						<FaRegUser className="fill-[#FF99D4]" />
					</button>
					<div>
						<h3 className="text-base font-medium">{props?.clientName}</h3>
						<p className="text-[#101010]">
							{formatPhoneNumber(props?.clientPhone)}
						</p>
						<p className="text-[#4E4E4E80] text-[14px] font-medium">
							Всего визитов: {props?.totalVisits}
						</p>
					</div>
				</div>
				<div className="mb-4 flex gap-[10px]">
					<img
						className="w-[30px] h-[30px] rounded-[50%] object-cover"
						src={currentFindMaster?.avatar}
						alt={currentFindMaster?.firstName}
					/>
					<div>
						<h3 className="text-base font-medium">
							{currentFindMaster?.firstName} {currentFindMaster?.lastName}
						</h3>

						<ul className="flex gap-[5px]">
							{currentFindMaster?.specialization?.map((item: string) => (
								<li className="text-gray-500">{item}</li>
							))}
						</ul>
					</div>
				</div>
				<div className="mb-4 flex gap-[15px]">
					<IoMdTime className="text-[#4E4E4E80] mt-1" size={20} />
					<div>
						<p className="text-[#101010] text-base font-medium">
							{formatServiceInfo(props.appointmentsCalendarData)}
						</p>
						<p className="text-gray-500">
							Продолжительность: {durationMinutes} минут
						</p>
					</div>
				</div>
				{props?.appointmentsCalendarData?.description && (
					<div className="mb-4 flex gap-[15px]">
						<TbDotsCircleHorizontal
							className="text-[#4E4E4E80] mt-1"
							size={20}
						/>
						<div>
							<p className="text-base text-gray-500">Комментарий</p>
							<p>{props?.appointmentsCalendarData?.description}</p>
						</div>
					</div>
				)}
				<div className="mb-4 space-y-2">
					<div className="flex items-center gap-[15px]">
						<ServiceFolder />
						<h4 className="text-base font-medium">Список услуг</h4>
					</div>
					{props?.appointmentsCalendarData?.serviceIds?.map(
						(service: ServiceDate, index: number) => (
							<div key={index} className="flex flex-col">
								<b className="text-base font-medium text-[#101010]">
									{service.label}
								</b>
								<span className="text-[14px] font-medium text-[#4E4E4E80]">
									Продолжительность: {service.duration} минут
								</span>
							</div>
						)
					)}
				</div>
				<div className="mb-4">
					<h4 className="text-[20px] font-medium">
						К оплате: {props?.paymentsData?.totalAmount} сом
					</h4>
					{props?.paymentsData?.payments?.map((item: any) => (
						<p className="flex gap-[5px] text-base font-medium">
							<span className="text-[#4E4E4E80]">
								{PAYMENT_TYPE[item?.paymentType]}:
							</span>
							<span className="text-[#101010]">{item.amount} сом</span>
						</p>
					))}
				</div>
			</div>
		</ModalComponent>
	)
}

export default AppointmentDetails
