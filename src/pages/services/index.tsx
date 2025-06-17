import { useNavigate } from 'react-router-dom'
import { ReactComponent as Search } from '../../assets/icons/usage/search.svg'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import { ROLES } from '../../shared/lib/constants/constants'
import { useGetServicesQueryBybranchId } from '../../shared/queries/services.queries'
import { useState } from 'react'
import { CreateService } from './create'
import Loading from '../loading'
import { useOwnerStore } from '../../shared/states/owner.store'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { ownerLinks } from '../../shared/links'

export const ServicesPage = () => {
	const navigate = useNavigate()
	const { role } = useSelector((state: RootState) => state.auth)

	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const ownerBranchId = useOwnerStore((state: any) => state.branchId)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)
	const branchId =
		role === ROLES.PERSONAl_MASTER
			? individualData?.branchId
			: role === ROLES.OWNER
				? ownerBranchId
				: branchAdminMasterJwt?.branchId

	const [search, setSearch] = useState('')

	const { data: services, isLoading } = useGetServicesQueryBybranchId(
		branchId,
		ownerData?.category || '',
		search
	)

	const [createService, setCreateService] = useState(false)

	return (
		<div className="w-full h-[calc(100vh-100px)] rounded-[24px] p-[15px] flex flex-col gap-[15px]">
			<CreateService
				active={createService}
				handleClose={() => setCreateService(false)}
			/>
			<div className="w-full flex items-center justify-between gap-[15px]">
				<p className="text-[#101010] text-[20px]">Услуги</p>
				<div className="relative w-full">
					<input
						style={{
							boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
						}}
						type="text"
						placeholder="Поиск по названию услуги, подкатегории или категории"
						className="w-full h-[37px] rounded-[24px] bg-white px-[16px] py-[9px] text-[14px] placeholder:text-[#4E4E4E80] text-[#101010]"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Search className="absolute right-[16px] top-[9px]" />
				</div>
				<button
					style={{
						boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
					}}
					onClick={() => setCreateService(true)}
					className="w-fit h-[37px] rounded-[24px] bg-[#101010] text-white text-[14px] px-[16px] py-[8px] whitespace-nowrap transition-all duration-300 shadow-xl hover:scale-[1.02] !hover:shadow-2xl"
				>
					+ Добавить услугу
				</button>
			</div>
			{isLoading ? (
				<div className="w-full h-full flex items-center justify-center">
					<Loading />
				</div>
			) : (
				<div className="flex flex-col gap-[10px]">
					{services?.map((service: any) => (
						<div
							key={service.id}
							style={{
								boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
							}}
							onClick={() =>
								navigate(
									ownerLinks.services_subcategories.replace(':subid', '2')
								)
							}
							className="flex items-center justify-between w-full h-[58px] bg-white rounded-[16px] px-[20px]"
						>
							<div className="flex items-center gap-[10px]">
								<img
									style={{
										boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
									}}
									src={service.icon}
									alt={service.name}
									className="w-[38px] h-[38px] rounded-full object-cover"
								/>
								<p>{service.name}</p>
							</div>
							<div className="flex items-center gap-[10px]">
								<p className="text-[#4E4E4E80] text-[13px]">
									{service.subCategoryServices.reduce((sum: any, sub: any) => {
										return sum + (sub.serviceResponses?.length || 0)
									}, 0)}{' '}
									услуг
								</p>
								<MdKeyboardArrowRight
									size={24}
									className="w-[24px] h-[24px] mt-[2px]"
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
