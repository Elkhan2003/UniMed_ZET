import {
	AppointmentStatusColor,
	convertStatus,
	formatDateToRussian,
} from '../../../../shared/lib/helpers/helpers'

export const UserAppCard = ({ item }: { item: any }) => {
	const startTime = new Date(item.startTime).getTime()
	const endTime = new Date(item.endTime).getTime()

	const timeDifferenceInMinutes = (endTime - startTime) / 60000
	return (
		<div
			style={{
				borderLeft: `3px solid ${AppointmentStatusColor(item.appointmentStatus)}`,
			}}
			className="bg-[#F2F2F1] rounded-[16px] p-[8px] flex flex-col gap-[5px]"
		>
			<p>Запись №{item.id}</p>
			<p>
				{formatDateToRussian(item.startTime.split('T')[0])} в{' '}
				<span>
					{item.startTime.split('T')[1].slice(0, 5)} -
					{item.endTime.split('T')[1].slice(0, 5)}
				</span>
				<span className="text-[#4E4E4E80]">{`  (${timeDifferenceInMinutes} минут)`}</span>
			</p>
			<p>
				<span className="text-[#4E4E4E80]">Специалист:</span>{' '}
				{item.master.firstName} {item.master.lastName}
			</p>
			<p>
				<span className="text-[#4E4E4E80]">Клиент:</span> {item.user.firstName}{' '}
				{item.user.lastName}
			</p>
			<p>
				<span className="text-[#4E4E4E80]">
					Услуг{`${item.services.length > 1 ? 'и' : 'а'}`}:
				</span>{' '}
				{item.services.map((service: any, index: number) => (
					<span className="mr-1" key={index}>
						{service.name},
					</span>
				))}
			</p>
            {convertStatus(item?.appointmentStatus)}
		</div>
	)
}
