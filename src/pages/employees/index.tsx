import { useNavigate, useSearchParams } from 'react-router-dom'
import { ReactComponent as Search } from '../../assets/icons/usage/search.svg'
import { RootState } from '../../store'
import { useGetMasterQuery } from '../../store/services/master.service'
import { useSelector } from 'react-redux'
import { ROLES } from '../../shared/lib/constants/constants'
import { SlTable } from '../../components/shared/sl-table'

import { ReactComponent as Edit } from '../../assets/icons/action/edit.svg'
import { ReactComponent as Delete } from '../../assets/icons/action/delete.svg'
import { ownerLinks } from '../../shared/links'
import { useOwnerStore } from '../../shared/states/owner.store'
import { useGetMasterByBranches } from '../../shared/queries/master.managment'

const columns = [
	{
		title: 'Фото',
		dataIndex: 'avatar',
		render: (value: string) => (
			<img
				src={value}
				alt="avatar"
				className="w-[40px] h-[40px] rounded-full object-cover"
			/>
		),
	},
	{
		title: 'Имя',
		dataIndex: 'firstName',
		render: (value: string, record: any) => `${value} ${record.lastName}`,
	},
	{
		title: 'Телефон',
		dataIndex: 'phoneNumber',
	},
	{
		title: 'Рейтинг',
		dataIndex: 'rating',
	},
	{
		title: 'Стаж',
		dataIndex: 'experience',
	},
	{
		title: 'Действие',
		dataIndex: 'action',
		render: (value: string, record: any) => (
			<div className="flex items-center gap-[10px]">
				<button className="w-[37px] h-[37px] rounded-[24px] flex items-center justify-center hover:bg-[#F2F2F1] transition-all duration-300">
					<Edit className="w-[16px] h-[16px] text-white" />
				</button>
				<button className="w-[37px] h-[37px] rounded-[24px] flex items-center justify-center hover:bg-[#F2F2F1] transition-all duration-300">
					<Delete className="w-[16px] h-[16px] text-white" />
				</button>
			</div>
		),
	},
]

export const EmployeesPage = () => {
	const navigate = useNavigate()

	const ownerBranchId = useOwnerStore((state: any) => state.branchId)
	const { role } = useSelector((state: RootState) => state.auth)

	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const branchId =
		role === ROLES.PERSONAl_MASTER
			? individualData?.branchId
			: role === ROLES.OWNER
				? ownerBranchId
				: branchAdminMasterJwt?.branchId

	const { data: masters = [], isLoading } = useGetMasterByBranches(branchId)

	return (
		<div className="w-full h-[calc(100vh-100px)] rounded-[24px] p-[15px] flex flex-col gap-[15px]">
			<div className="w-full flex items-center justify-between gap-[15px]">
				<p className="text-[#101010] text-[20px]">Сотрудники</p>
				<div className="relative w-full">
					<input
						style={{
							boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
						}}
						type="text"
						placeholder="Поиск"
						className="w-full h-[37px] rounded-[24px] bg-white px-[16px] py-[9px] text-[14px] placeholder:text-[#4E4E4E80] text-[#101010]"
					/>
					<Search className="absolute right-[16px] top-[9px]" />
				</div>
				<button
					style={{
						boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
					}}
					className="w-fit h-[37px] rounded-[24px] bg-[#101010] text-white text-[14px] px-[16px] py-[8px] whitespace-nowrap transition-all duration-300 shadow-xl hover:scale-[1.02] !hover:shadow-2xl"
				>
					+ Добавить сотрудника
				</button>
			</div>
			<SlTable
				columns={columns}
				dataSource={masters}
				loading={isLoading}
				onRow={{
					onClick: (record) => navigate(`${ownerLinks.employees}/${record.id}`),
				}}
			/>
		</div>
	)
}
