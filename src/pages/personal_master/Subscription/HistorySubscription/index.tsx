import React, { useState } from 'react'
import { StyledTable } from '../../../../components/UI/StyledTable'
import { useGetCompaniesPaymentQuery } from '../../../../store/queries/tarrif.service'
import { ROLES, SUB_TYPE } from '../../../../shared/lib/constants/constants'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
dayjs.locale('ru')

interface HistorySubscriptionProps {
	masterData: string | number | undefined
}

export const HistoryColumn = [
	{
		title: 'Название тарифа',
		dataIndex: 'tarif',
		key: 'tarif',
		render: (_: any, sub: any) => (
			<div>
				<p>{sub?.tariff?.name || ''}</p>
			</div>
		),
	},
	{
		title: 'Период тарифа',
		dataIndex: 'Tariff period',
		key: 'row',
		render: (_: any, sub: any) => {
			const startDate = dayjs(sub.startDate).format('DD MMMM YYYY')
			const endDate = dayjs(sub.endDate).format('DD MMMM YYYY')
			return (
				<p>
					<span>{startDate} - </span>
					<span>{endDate}</span>
				</p>
			)
		},
	},
	{
		title: 'Количество платежей',
		dataIndex: 'paymentCount',
		key: 'paymentCount',
		render: (_: any, sub: any) => <p>{sub?.paymentHistories?.length || 0}</p>,
	},
]

export const HistoryColumnInner = (role: string) => {
	const columns = [
		{
			title: 'Тип оплаты',
			dataIndex: 'subscriptionType',
			key: 'subscriptionType',
			render: (value: string) => <p>{SUB_TYPE[value]}</p>,
		},
		{
			title: 'Дата оплаты',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (value: string) => {
				return <p>{dayjs(value).format('DD MMMM YYYY HH:mm')}</p>
			},
		},
		{
			title: 'Сумма оплаты',
			dataIndex: 'amount',
			key: 'amount',
			render: (value: number) => {
				return <p>{`${value} c`}</p>
			},
		},
		{
			title: 'Счёт-фактура',
			dataIndex: 'externalPaymentId',
			key: 'externalPaymentId',
			render: (value: number) => {
				return <p>{value || '-'}</p>
			},
		},
		{
			title: 'Статус оплаты',
			dataIndex: 'row',
			key: 'row',
			render: (_: any, sub: any) => (
				<div>
					{(() => {
						switch (sub.status) {
							case 'PENDING':
								return (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.865 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
											fill="#F4CE36"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M15.39 14.7668C15.259 14.7668 15.127 14.7328 15.006 14.6618L11.615 12.6388C11.389 12.5028 11.249 12.2578 11.249 11.9948V7.63281C11.249 7.21881 11.585 6.88281 11.999 6.88281C12.413 6.88281 12.749 7.21881 12.749 7.63281V11.5688L15.775 13.3718C16.13 13.5848 16.247 14.0448 16.035 14.4008C15.894 14.6358 15.645 14.7668 15.39 14.7668Z"
											fill="#F4CE36"
										/>
									</svg>
								)

							case 'PAID':
								return (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
											fill="#3FC24C"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M10.8132 15.1227C10.6222 15.1227 10.4292 15.0497 10.2832 14.9027L7.9092 12.5297C7.6162 12.2367 7.6162 11.7627 7.9092 11.4697C8.2022 11.1767 8.6762 11.1767 8.9692 11.4697L10.8132 13.3117L15.0292 9.0967C15.3222 8.8037 15.7962 8.8037 16.0892 9.0967C16.3822 9.3897 16.3822 9.8637 16.0892 10.1567L11.3432 14.9027C11.1972 15.0497 11.0052 15.1227 10.8132 15.1227Z"
											fill="#3FC24C"
										/>
									</svg>
								)

							case 'FAILED':
								return (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M9.60229 15.1375C9.41029 15.1375 9.21829 15.0645 9.07229 14.9175C8.77929 14.6245 8.77929 14.1505 9.07229 13.8575L13.8643 9.06545C14.1573 8.77245 14.6313 8.77245 14.9243 9.06545C15.2173 9.35845 15.2173 9.83245 14.9243 10.1255L10.1323 14.9175C9.98629 15.0645 9.79429 15.1375 9.60229 15.1375Z"
											fill="#FF5E5E"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M14.3963 15.1405C14.2043 15.1405 14.0123 15.0675 13.8663 14.9205L9.07034 10.1235C8.77734 9.8305 8.77734 9.3565 9.07034 9.0635C9.36434 8.7705 9.83834 8.7705 10.1303 9.0635L14.9263 13.8605C15.2193 14.1535 15.2193 14.6275 14.9263 14.9205C14.7803 15.0675 14.5873 15.1405 14.3963 15.1405Z"
											fill="#FF5E5E"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
											fill="#FF5E5E"
										/>
									</svg>
								)

							default:
								return null
						}
					})()}
				</div>
			),
		},
	]

	if (role === ROLES.OWNER) {
		columns.splice(2, 0, {
			title: 'Кол-во чел.',
			dataIndex: 'maxUsers',
			key: 'maxUsers',
			render: (value: number) => {
				return <p>{value || '-'}</p>
			},
		})
	}

	return columns
}

const HistorySubscription = ({ masterData }: HistorySubscriptionProps) => {
	const { role } = useSelector((state: RootState) => state.auth)
	const { data = [], isLoading } = useGetCompaniesPaymentQuery(
		{
			companyId: Number(masterData),
		},
		{ skip: !masterData }
	)

	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

	// Function to get row key
	const getRowKey = (record: any) => record.id || String(Math.random())

	// Handle row click to expand/collapse
	const handleRowClick = (record: any) => {
		const key = getRowKey(record)

		// Check if this row has payment histories
		if (
			!(
				Array.isArray(record?.paymentHistories) &&
				record.paymentHistories.length > 0
			)
		) {
			return // Don't expand rows without payment histories
		}

		setExpandedRowKeys((prevKeys) => {
			if (prevKeys.includes(key)) {
				// Collapse if already expanded
				return prevKeys.filter((k) => k !== key)
			} else {
				return [...prevKeys, key]
			}
		})
	}

	const expandableConfig = {
		expandedRowRender: (record: any) => (
			<StyledTable
				columns={HistoryColumnInner(role)}
				dataSource={record?.paymentHistories || []}
				loading={isLoading}
				pagination={false}
				size="small"
			/>
		),
		rowExpandable: (record: any) => {
			return (
				Array.isArray(record?.paymentHistories) &&
				record.paymentHistories.length > 0
			)
		},
		expandedRowKeys: expandedRowKeys,
	}

	return (
		<div className="w-full bg-white overflow-y-auto">
			<div
				style={{
					borderBottom: '1px solid #D8DADC',
				}}
			>
				<h3 className="text-[20px] py-[15px] px-[20px]">История оплаты</h3>
			</div>
			<div className="p-4">
				<StyledTable
					columns={HistoryColumn}
					dataSource={data}
					loading={isLoading}
					pagination={false}
					expandable={expandableConfig}
					rowKey={getRowKey}
					onRow={(record) => ({
						onClick: () => handleRowClick(record),
						style: { cursor: 'pointer' },
					})}
				/>
			</div>
		</div>
	)
}

export default HistorySubscription
