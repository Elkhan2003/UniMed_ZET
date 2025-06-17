import { NavLink } from 'react-router-dom'
import { CATEGORY_TYPE, ROLES } from '../../../shared/lib/constants/constants'
import {
	formatDateToRussian,
	formatDuration,
} from '../../../shared/lib/helpers/helpers'

export const STATUS = [
	{ label: 'Активен', value: '#25BE22' },
	{ label: 'Заблокирован', value: '#D80E0C' },
]

export const getColumns = (role: string) => {
	const columns = [
		{
			title: '№',
			dataIndex: 'id',
			key: 'id',
			width: 50,
		},
		{
			title: 'Лого',
			dataIndex: 'record',
			key: 'record',
			width: 60,
			render: (_: any, record: any) => (
				<img
					alt="company"
					className="w-10 min-w-[40px] h-10 rounded-full object-cover"
					src={record.logo}
				/>
			),
		},
		{
			title: 'ФИО, Email',
			dataIndex: 'record',
			key: 'record',
			render: (_: any, record: any) =>
				role === ROLES.PERSONAl_MASTER ? (
					<>
						<p className="font-bold">
							{record?.master?.firstName}
							{record?.master?.lastName && `-${record?.master?.lastName || ''}`}
						</p>
						<p className="text-[#949393] text-xs">{record?.address}</p>
						<p className="text-[#949393] text-xs">{record?.master?.email}</p>
					</>
				) : (
					<>
						<p className="font-bold">
							{record?.owner?.firstName}
							{record?.owner?.lastName && `-${record?.owner?.lastName || ''}`}
						</p>
						<p className="text-[#949393] text-xs">{record?.owner?.google}</p>
					</>
				),
		},
		{
			title: 'Тариф',
			dataIndex: 'record',
			key: 'record',
			render: (_: any, record: any) => (
				<>
					<p className="font-bold">{record?.subscription?.tariff?.name}</p>
					<p className="text-[#949393] text-xs">
						{formatDuration(record?.subscription?.tariff?.durationInDays)}
					</p>
				</>
			),
		},
		{
			title: 'Оплата тарифа',
			dataIndex: 'record',
			key: 'record',
			render: (_: any, record: any) => <p>{record?.subscription?.amount} c</p>,
		},
		{
			title: 'Статус',
			dataIndex: 'record',
			key: 'record',
			render: (_: any, record: any) => (
				<div
					style={{
						backgroundColor: `${STATUS[Number(!record.isNonLocked)].value}50`,
					}}
					className="flex justify-center items-center rounded-[20px] py-[3px] w-[110px]"
				>
					<p
						className="text-xs"
						style={{ color: STATUS[Number(!record.isNonLocked)].value }}
					>
						{STATUS[Number(!record.isNonLocked)].label}
					</p>
				</div>
			),
		},
	]

	if (role !== ROLES.PERSONAl_MASTER) {
		columns.splice(2, 0, {
			title: 'Название',
			dataIndex: 'record',
			key: 'record',
			width: 500,
			render: (_: any, record: any) => (
				<>
					<p className="font-bold">{record.name}</p>
					<p className="text-xs font-bold">
						{CATEGORY_TYPE[record.categoryType]}
					</p>
					<p className="text-[#949393] text-xs">{record.address}</p>
				</>
			),
		})
	}

	if (role === ROLES.PERSONAl_MASTER) {
		columns.splice(3, 0, {
			title: 'Специальность',
			dataIndex: 'record',
			key: 'record',
			render: (_: any, record: any) => (
				<>
					<p className="font-bold">
						{record?.master?.specialization.map((item: any) => (
							<span>{item.name},</span>
						))}
					</p>
					<p className="text-[#949393] text-xs">
						{CATEGORY_TYPE[record.categoryType]}
					</p>
				</>
			),
		})
	}

	return columns
}

export const getPaymentColumns = () => {
	const columns = [
		{
			title: 'Дата оплаты',
			dataIndex: 'paymentDate',
			key: 'paymentDate',
			render: (payment: string) => (
				<p>
					{formatDateToRussian(payment.split('T')[0])} - {payment.slice(0, 4)}{' '}
					года, {payment.split('T')[1].slice(0, 5)}
				</p>
			),
		},
		{
			title: 'Тариф',
			dataIndex: 'tariffName',
			key: 'tariffName',
		},
		{
			title: 'Период',
			dataIndex: 'record',
			key: 'record',
			render: (_: any, record: any) => (
				<p className="">
					<span>
						{record.startDate.split('T')[0]}_{record.endDate.split('T')[0]}
					</span>
				</p>
			),
		},
		{
			title: 'На сумму',
			dataIndex: 'amount',
			key: 'amount',
		},
		{
			title: 'Способ оплаты',
			dataIndex: 'paymentSystem',
			key: 'paymentSystem',
		},
		{
			title: 'Счет-фактура',
			dataIndex: 'externalPaymentId',
			key: 'externalPaymentId',
		},
	]
	return columns
}

export const companyBreadCrumbItems = (name: string, to: string) => {
	return [
		{
			title: <NavLink to={to}>Пользователи</NavLink>,
		},
		{
			title: <p>{name}</p>,
		},
	]
}
