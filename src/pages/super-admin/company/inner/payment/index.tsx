import { useParams } from 'react-router-dom'
import {
	useLazyGetCompaniesPaymentQuery,
	useLazyGetTarifsQuery,
} from '../../../../../store/queries/tarrif.service'
import { StyledTable } from '../../../../../components/UI/StyledTable'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Flex } from 'antd'
import { Button } from '../../../../../components/UI/Buttons/Button/Button'
import { AddPayment } from './add-payment'
import { SearchOutlined } from '@ant-design/icons'
import {
	HistoryColumn,
	HistoryColumnInner,
} from '../../../../personal_master/Subscription/HistorySubscription'

export const CompanyInnerPayment = () => {
	const { companyId } = useParams()
	const [tarrifs, setTarrrifs] = useState<any[]>([])
	const [data, setData] = useState<any>([])
	const [isLoading, setIsLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [getTarrifs] = useLazyGetTarifsQuery()
	const [getPayment] = useLazyGetCompaniesPaymentQuery()

	const [active, setActive] = useState(false)

	const getTarrifsFunc = async () => {
		try {
			const response = await getTarrifs()
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			}
			if (response['data']) {
				setTarrrifs(response?.data)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		}
	}

	const getPaymentFunc = async () => {
		try {
			setIsLoading(true)
			const response = await getPayment({ companyId: Number(companyId) })
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			}
			if (response['data']) {
				setData(response?.data)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getTarrifsFunc()
		if (companyId) {
			getPaymentFunc()
		}
	}, [companyId, search])

	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

	const getRowKey = (record: any) => record.id || String(Math.random())

	const handleRowClick = (record: any) => {
		const key = getRowKey(record)

		if (
			!(
				Array.isArray(record?.paymentHistories) &&
				record.paymentHistories.length > 0
			)
		) {
			return
		}

		setExpandedRowKeys((prevKeys) => {
			if (prevKeys.includes(key)) {
				return prevKeys.filter((k) => k !== key)
			} else {
				return [...prevKeys, key]
			}
		})
	}

	const expandableConfig = {
		expandedRowRender: (record: any) => (
			<StyledTable
				columns={HistoryColumnInner('OWNER')}
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
		<Flex vertical gap={10} className="w-full h-full">
			<AddPayment
				active={active}
				handleClose={() => setActive(false)}
				title="Принять оплату"
				tarriffs={tarrifs}
				onSuccess={getPaymentFunc}
			/>
			<Flex align="center" justify="space-between" gap={10}>
				<div className="bg-white rounded-[24px] w-[40%] h-[40px] relative pl-10 border">
					<div className="absolute left-4 top-0 bottom-0 flex justify-center items-center">
						<SearchOutlined />
					</div>
					<input
						className="w-full h-full bg-transparent myfont text-sm placeholder-font-involve"
						placeholder="Введите ID счет фактуры"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<Button
					width="140px"
					borderRadius="16px"
					backgroundColor="var(--myadmin)"
					onClick={() => setActive(true)}
				>
					Принять оплату
				</Button>
			</Flex>
			<div className="w-full h-[55vh] overflow-y-auto">
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
		</Flex>
	)
}
