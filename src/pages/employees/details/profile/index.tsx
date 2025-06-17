import { ReactComponent as Edit } from '../../../../assets/icons/action/edit.svg'
import { ReactComponent as Star } from '../../../../assets/icons/usage/star.svg'

export const MasterMiniProfile = ({ master }: any) => {
	return (
		<>
			<div className="w-full flex items-center justify-between">
				<div className="py-1 px-2 text-[14px] leading-[12px] rounded-full bg-[#FFDEEE]">
					{master?.experience}
				</div>
				<button className="w-[30px] h-[30px] rounded-[24px] flex items-center justify-center hover:bg-[#F2F2F1] transition-all duration-300">
					<Edit className="w-[16px] h-[16px] text-white" />
				</button>
			</div>
			<div className="w-full flex flex-col items-center justify-center">
				<img
					src={master?.avatar}
					alt="avatar"
					className="w-[100px] h-[100px] rounded-full object-cover"
				/>
				<p className="text-[14px] font-[600] text-[#101010]">
					{master?.firstName} {master?.lastName}
				</p>
				<p className="text-[13px] font-[400] text-[#4E4E4E80] leading-[14px] text-center">
					{master?.specialization?.map((item: any) => (
						<>
							<span key={item.id}>{item.name}</span>
							<br />
						</>
					))}
				</p>
			</div>
			<div className="w-full grid grid-cols-3">
				<div className="flex flex-col gap-[10px] items-center">
					<p className="text-[14px] font-[400] text-[#4E4E4E80]">Записи</p>
					<p className="text-[14px] font-[600] text-[#101010]">
						{master?.numberOfVisit}
					</p>
				</div>
				<div className="flex flex-col gap-[10px] items-center">
					<p className="text-[14px] font-[400] text-[#4E4E4E80]">Оценка</p>
					<div className="flex items-center gap-[10px]">
						<p className="text-[14px] font-[600] text-[#101010]">
							{master?.rating}
						</p>
						<Star />
					</div>
				</div>
				<div className="flex flex-col gap-[10px] items-center">
					<p className="text-[14px] font-[400] text-[#4E4E4E80]">Отзывы</p>
					<p className="text-[14px] font-[600] text-[#101010]">
						{master?.feedbackCount}
					</p>
				</div>
			</div>
		</>
	)
}
