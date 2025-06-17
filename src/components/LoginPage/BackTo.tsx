import { GoArrowLeft } from 'react-icons/go'
import { MainLogo } from '../../assets/icons/MainLogo'

export const BackTO = ({ onClickLogo, onClickArrow }: any) => {
	return (
		<div className="absolute top-4 left-4 flex items-center gap-4">
			<div onClick={onClickLogo} className="flex items-center sm:hidden">
				<MainLogo color="#FF99D4" height="22" width="19" />
				<p className="text-[#FF99D4] text-[28px] baloo-cheatan font-[800]">
					niWork
				</p>
			</div>
			<div
				onClick={onClickArrow}
				className="bg-[#E8EAED] rounded-[8px] flex justify-center items-center w-8 h-8 cursor-pointer hover:shadow-xl"
			>
				<GoArrowLeft
					size={16}
					className="text-text-primary active:translate-x-[-5px]"
				/>
			</div>
		</div>
	)
}
