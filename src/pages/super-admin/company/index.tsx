import { useEffect, useState } from 'react'
import { useLazyGetCompaniesQuery } from '../../../store/queries/company.service'
import { SearchOutlined } from '@ant-design/icons'
import { Filter } from '../../../assets/icons/Filter'
import toast from 'react-hot-toast'
import { Col, Dropdown, Flex, Grid } from 'antd'
import { useLazyGetTarifsQuery } from '../../../store/queries/tarrif.service'
import { StyledTable } from '../../../components/UI/StyledTable'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SUPER_ADMIN_ROUTES } from '../../../shared/lib/constants/routes'
import { getColumns } from './const'
import { ROLES } from '../../../shared/lib/constants/constants'
import { PinkPagination } from '../../../components/UI/Pagination'

import { MdArrowForwardIos } from 'react-icons/md'
import Checkbox from '../../../components/UI/Checkbox'

const IS_COMPANY = [
	{
		name: 'Компании',
		value: 'PERSONAL',
	},
	{
		name: 'Персональные специалисты',
		value: 'COMPANY',
	},
]

const STATUS = [
	{ label: 'Активные', value: 'ACTIVE', color: '#25BE22' },
	{ label: 'Заблокированные', value: 'EXPIRED', color: '#D80E0C' },
]

const TAB_ROLES = [ROLES.OWNER, ROLES.PERSONAl_MASTER]

export const СompanyPage = () => {
	const [getCompanies] = useLazyGetCompaniesQuery()
	const [getTarrifs] = useLazyGetTarifsQuery()

	const navigate = useNavigate()

	const [searchParams, setSearchParams] = useSearchParams()

	const [companies, setCompanies] = useState<any>({ content: [] })
	const [tarrifs, setTarrrifs] = useState<any[]>([])

	const [isLoading, setIsLoading] = useState(true)
	const [pagination, setPagination] = useState({ page: 1, size: 6 })
	const [tariffIds, setTariffIds] = useState<number[]>([])
	const [statuses, setStatuses] = useState<string[]>(['ACTIVE', 'EXPIRED'])
	const [search, setSearch] = useState('')
	const [open, setOpen] = useState(false)
	const type = searchParams.get('type')
	const [tab, setTab] = useState(
		type === null ? 0 : type === 'PERSONAL' ? 1 : 0
	)

	const getCompaniesFunc = async () => {
		try {
			setIsLoading(true)
			const response = await getCompanies({
				tariffIds: tariffIds,
				statuses: statuses,
				page: pagination.page,
				size: pagination.size,
				isCompany: !tab,
				search: search,
			})
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			}
			if (response['data']) {
				setCompanies(response?.data)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setIsLoading(false)
		}
	}

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

	useEffect(() => {
		getCompaniesFunc()
	}, [pagination, tariffIds, statuses, tab, search])

	useEffect(() => {
		getTarrifsFunc()
		if (type === null) {
			searchParams.set('type', 'COMPANY')
			setSearchParams(searchParams)
		}
	}, [])

	const role = TAB_ROLES[tab]
	const countFilters = statuses.length + tariffIds.length

	return (
		<Flex
			vertical
			gap={20}
			className="w-full h-full min-h-[calc(100vh-45px)]  p-4"
		>
			<Flex gap={20}>
				<div className="w-full h-[100px] bg-white rounded-[16px] p-[10px]">
					<p className="text-[#101010] font-bold">Всего пользователей</p>
					<p className="text-[37px] font-bold myfont text-myadmin">
						{companies?.allAdditionalData?.totalCompanies || 0}
					</p>
				</div>
				<div className="w-full h-[100px] bg-white rounded-[16px] p-[10px]">
					<p className="text-[#101010] font-bold">Активные</p>
					<p className="text-[37px] font-bold myfont text-[#25BE22]">
						{companies?.allAdditionalData?.activeCompanies || 0}
					</p>
				</div>
				<div className="w-full h-[100px] bg-white rounded-[16px] p-[10px]">
					<p className="text-[#101010] font-bold">Заблокированные</p>
					<p className="text-[37px] font-bold myfont text-[#D80E0C]">
						{companies?.allAdditionalData?.blockedCompanies || 0}
					</p>
				</div>
			</Flex>
			<Flex align="center" gap={10}>
				<div className="bg-white rounded-[24px] w-full h-[40px] relative pl-10 border">
					<div className="absolute left-4 top-0 bottom-0 flex justify-center items-center">
						<SearchOutlined />
					</div>
					<input
						className="w-full h-full bg-transparent myfont text-sm placeholder-font-involve"
						placeholder="Поиск по названию, Email, ФИО"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="relative w-fit flex gap-3 bg-white rounded-[16px] h-[40px] border">
					{IS_COMPANY.map(
						(item: { name: string; value: string }, i: number) => (
							<div
								key={i}
								className="w-[250px] z-10 cursor-pointer flex items-center justify-center"
								onClick={() => {
									setTab(i)
									setPagination({ page: 1, size: 6 })
									setTariffIds([])
									searchParams.set('type', i === 0 ? 'COMPANY' : 'PERSONAL')
									setSearchParams(searchParams)
								}}
							>
								<p
									className={`text-sm noselect text-center font-medium transition-all duration-200 ${
										tab === i ? 'text-white' : 'text-[#4E4E4E80]'
									}`}
								>
									{item.name}
								</p>
							</div>
						)
					)}
					<div
						className={`absolute bg-myadmin h-full transition-all duration-200 rounded-[16px] w-[250px]`}
						style={{
							height: '100%',
							left: `${IS_COMPANY.findIndex((item, index) => index === tab) * 262}px`,
						}}
					/>
				</div>
				<Dropdown
					overlay={
						<div className="w-[300px] rounded-[16px] p-[10px] bg-white border-[1px] border-[#dadada] border-solid-lg">
							<Flex
								justify="space-between"
								className="cursor-pointer"
								align="center"
							>
								<p>Статус</p>
								<MdArrowForwardIos className="rotate-90" />
							</Flex>
							<div className="ml-4 mt-2">
								{STATUS.map((item, i: number) => (
									<Flex key={item.value} justify="space-between" align="center">
										<Checkbox
											color="bg-myadmin"
											checked={statuses.includes(item.value)}
											setChecked={(checked) => {
												setStatuses((prev) => {
													if (checked) {
														return [...prev, item.value]
													} else {
														const newStatuses = prev.filter(
															(s) => s !== item.value
														)
														return newStatuses.length > 0
															? newStatuses
															: [item.value]
													}
												})
												setPagination({ page: 1, size: 6 })
											}}
										/>
										<p className="text-start w-full ml-2">{item.label}</p>
										<div
											style={{ backgroundColor: item.color }}
											className="w-3 h-3 rounded-full min-w-[12px]"
										/>
									</Flex>
								))}
							</div>
							<Flex
								justify="space-between"
								className="cursor-pointer mt-2"
								align="center"
							>
								<p>Тариф</p>
								<MdArrowForwardIos className="rotate-90" />
							</Flex>
							<div className="ml-4 mt-2">
								{tarrifs
									.filter((item: any) =>
										tab === 0
											? item.tariffType === 'COMPANY'
											: item.tariffType === 'PERSONAL'
									)
									.map((item, i: number) => (
										<Flex key={i} justify="space-between" align="center">
											<Flex align="center" gap={8}>
												<Checkbox
													color="bg-myadmin"
													checked={tariffIds.includes(item.id)}
													setChecked={(checked) => {
														setTariffIds((prev) =>
															checked
																? [...prev, item.id]
																: prev.filter(
																		(tariffId) => tariffId !== item.id
																	)
														)
														setPagination({ page: 1, size: 6 })
													}}
												/>
												<p className="text-start">{item.name}</p>
											</Flex>
											<p>{item.price} сом</p>
										</Flex>
									))}
							</div>
						</div>
					}
					trigger={['click']}
					open={open}
					onOpenChange={(open) => setOpen(open)}
					className="cursor-pointer"
				>
					<Flex
						align="center"
						gap={10}
						className="bg-white rounded-[24px] w-fit h-[40px] px-4 border relative"
					>
						<Filter />
						<p className="text-[#4E4E4E80]">Фильтр</p>
						<div className="absolute top-[-10px] right-0 w-5 h-5 rounded-full bg-myadmin text-white text-xs flex justify-center items-center">
							{countFilters}
						</div>
					</Flex>
				</Dropdown>
			</Flex>
			<div className="h-[85vh] overflow-y-auto">
				<StyledTable
					onRow={(record: any) => ({
						onClick: () => {
							navigate(
								`${SUPER_ADMIN_ROUTES.COMPANY.path}/${record.id}/info?type=${record?.master === null ? 'COMPANY' : 'PERSONAL'}`
							)
						},
					})}
					pagination={false}
					columns={getColumns(role)}
					dataSource={companies?.content || []}
					loading={isLoading}
				/>
			</div>
			<Flex justify="end">
				<PinkPagination
					color="--myadmin"
					showSizeChanger={false}
					current={pagination.page}
					pageSize={pagination.size}
					total={companies?.totalElements}
					onChange={(page, pageSize) =>
						setPagination({ page: page, size: pageSize || pagination.size })
					}
				/>
			</Flex>
		</Flex>
	)
}
