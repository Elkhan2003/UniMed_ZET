import { useEffect, useState } from 'react'
import { CreateService } from '../create'
import { useGetServicesQueryBybranchId } from '../../../shared/queries/services.queries'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { useOwnerStore } from '../../../shared/states/owner.store'
import { ROLES } from '../../../shared/lib/constants/constants'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import Loading from '../../loading'

import { ReactComponent as Clock } from '../../../assets/icons/layout/appointments.svg'
import { ReactComponent as Delete } from '../../../assets/icons/action/delete.svg'
import { ReactComponent as Edit } from '../../../assets/icons/action/edit.svg'

export const ServicesSubcategoriesPage = () => {
	const [results, setResults] = useState<any[]>([])
	const [createService, setCreateService] = useState(false)
	const [activeAccordion, setActiveAccordion] = useState<number | null>(null)

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

	const { data: services, isLoading } = useGetServicesQueryBybranchId(
		branchId,
		ownerData?.category|| '',
		''
	)

	useEffect(() => {
		if (services) {
			const result = services.map((service: any) => service.subCategoryServices)
			setResults(result.flat())
		}
	}, [services])

	const toggleAccordion = (id: number) => {
		setActiveAccordion((prev) => (prev === id ? null : id))
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] p-4 flex flex-col gap-4">
			<CreateService
				active={createService}
				handleClose={() => setCreateService(false)}
			/>

			<div className="w-full flex items-center justify-between gap-4">
				<p className="text-[#101010] font-semibold text-base">Услуги</p>
				<div className="flex items-center gap-5">
					<p className="text-[#4E4E4E80]">{results.length} услуг</p>
					<button
						onClick={() => setCreateService(true)}
						className="h-[37px] rounded-full bg-[#101010] text-white text-sm px-4 py-2 whitespace-nowrap transition-all duration-300 shadow-md hover:scale-[1.02] hover:shadow-lg"
					>
						+ Добавить услугу
					</button>
				</div>
			</div>

			{isLoading ? (
				<div className="w-full h-full flex items-center justify-center">
					<Loading />
				</div>
			) : (
				<div className="flex flex-col ">
					{results.map((item: any) => (
						<>
							<div
								key={item.id}
								style={{
									boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
								}}
								className="bg-white rounded-[16px] overflow-hidden mb-[10px]"
							>
								<div
									onClick={() => toggleAccordion(item.id)}
									className="flex items-center justify-between h-[58px] px-[20px] cursor-pointer"
								>
									<p className="text-[#101010]">{item.name}</p>
									{activeAccordion === item.id ? (
										<MdKeyboardArrowDown size={24} />
									) : (
										<MdKeyboardArrowRight size={24} />
									)}
								</div>
							</div>
							<div
								className={`transition-all duration-300 overflow-hidden ${
									activeAccordion === item.id
										? 'max-h-[500px] opacity-100'
										: '!max-h-[0px] opacity-0'
								}`}
							>
								<div className="grid grid-cols-2 gap-[10px]">
									{item.serviceResponses?.map((srv: any) => (
										<div
											style={{
												boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
											}}
											key={srv.id}
											className="w-full flex justify-between items-center bg-white rounded-[24px] p-[20px] gap-[10px]"
										>
											<img
												src={srv.image}
												className="w-[140px] min-w-[140px] h-[140px] rounded-[16px] object-cover border-[1px] border-gray-100 border-solid "
											/>
											<div className="w-full h-full p-[10px] flex flex-col justify-between">
												<div className="w-full flex items-center justify-between">
													<p className="text-[#101010] font-[600] text-[14px]">
														{srv.name}
													</p>
													<div className="flex items-center gap-[5px]">
														<p className="text-[#FF99D4] text-[14px] font-[600] mr-1">
															{srv.price} c
														</p>
														<Clock />
														<p className="text-[#101010] font-[600] text-[14px]">
															{srv.duration} мин
														</p>
													</div>
												</div>
												<p className="text-[12px] text-[#4E4E4E80] font-[350] line-clamp-3">
													{srv.description}
												</p>
												<div className="w-full flex justify-end gap-[10px]">
													<div className="flex items-center gap-[5px] rounded-[24px] bg-[#F2F2F1] text-[#101010] text-[12px] px-2 py-1 cursor-pointer">
														<Delete /> Удалить
													</div>
													<div className="flex items-center gap-[5px] rounded-[24px] bg-[#F2F2F1] text-[#101010] text-[12px] px-2 py-1 cursor-pointer">
														<Edit /> Редактировать
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</>
					))}
				</div>
			)}
		</div>
	)
}
