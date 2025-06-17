import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { ReactComponent as Branch } from '../../../../assets/icons/layout/branches.svg'
import { ReactComponent as Clock } from '../../../../assets/icons/layout/clock.svg'
import { useGetBranchesOwnerQuery } from '../../../../store/services/branch.service'
import { useGetCompanyCurrentQuery } from '../../../../store/queries/company.service'
import { TimeRemaining } from '../../const'
import { useGetSubscriptionsCurrentQuery } from '../../../../store/queries/tarrif.service'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { SlDropdown } from '../../../../components/shared/sl-dropdown'
import dayjs from 'dayjs'
import { useOwnerStore } from '../../../states/owner.store'

export const OwnerHeader = () => {
	const branchId = useOwnerStore((state: any) => state.branchId)
	const setBranchId = useOwnerStore((state: any) => state.setBranchId)
	const { token } = useSelector((state: RootState) => state.auth)
	const { data: branches } = useGetBranchesOwnerQuery()

	useEffect(() => {
		if (branches?.length > 0) {
			const id = branches[0]?.id
			setBranchId(id)
		}
	}, [branches])

	const { data: CompanyData = undefined } = useGetCompanyCurrentQuery(
		undefined,
		{
			skip: !token,
		}
	)

	const { data: Tarriff } = useGetSubscriptionsCurrentQuery(CompanyData?.id, {
		skip: !CompanyData?.id,
	})

	const branchItems =
		branches?.map((branch: any) => ({
			key: branch.id,
			label: branch?.addresses?.map((a: any) => a.name).join(', '),
			onClick: () => {
				setBranchId(branch.id)
			},
		})) || []

	const currentBranch = branches?.find((branch: any) => branch.id === branchId)
	const currentBranchName = currentBranch?.addresses
		?.map((a: any) => a.name)
		.join(', ')

	return (
		<div
			style={{
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
				backdropFilter: 'blur(100px)',
			}}
			className="bg-white w-[98.7%] flex items-center justify-between h-[60px] rounded-br-[24px] pr-[10px] pl-[60px] sticky top-0 z-50"
		>
			<SlDropdown
				items={branchItems}
				placement="bottomLeft"
				trigger="click"
				overlayClassName="!border-[#F2F2F1]"
			>
				<div className="w-[500px] h-[37px] bg-[#F2F2F1] rounded-[24px] px-2 flex items-center gap-1 cursor-pointer hover:bg-[#E8E8E8] transition-colors duration-150">
					<div className="min-w-[20px]">
						<Branch />
					</div>
					<p className="text-[#101010] text-[12px] font-[500] leading-[12px]">
						{currentBranchName}
					</p>
					<MdKeyboardArrowDown size={18} className="min-w-[18px]" />
				</div>
			</SlDropdown>

			<div className="flex items-center gap-[20px]">
				<div className="flex items-center gap-1">
					<Clock />
					<p className="text-[13px] text-[#4E4E4E80]">
						{TimeRemaining(
							Tarriff?.endDate || dayjs().add(1, 'month').toISOString()
						)}
					</p>
				</div>
				<Link
					to="/profile"
					className="flex items-center gap-2 hover:bg-[#F2F2F1] rounded-full p-1 cursor-pointer"
				>
					<img
						src={CompanyData?.logo}
						className="w-[37px] h-[37px] rounded-full object-cover"
					/>
					<div>
						<p className="text-[14px] leading-[16px] font-[600] text-[#101010]">
							{CompanyData?.name}
						</p>
						<p className="text-[13px] leading-[15px] text-[#101010] min-w-[100px]">
							{CompanyData?.owner?.firstName}{' '}
							{CompanyData?.owner?.lastName || ''}
						</p>
					</div>
				</Link>
			</div>
		</div>
	)
}
