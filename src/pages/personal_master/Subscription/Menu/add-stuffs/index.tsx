import { RiErrorWarningLine } from 'react-icons/ri'
import Widget from '../../../../../components/UI/Widget'
import { _KEY_AUTH } from '../../../../../shared/lib/constants/constants'
import { Flex } from 'antd'
import { Button } from '../../../../../components/UI/Buttons/Button/Button'

interface AddStuffProps {
	active: boolean
	handleClose: () => void
	stuffCount: number
	setStuffCount: (prev: any) => void
	selectedTarif: any
	setSelectedTarif: (prev: any) => void
	onSelect: () => void
}

export const AddStuffs = ({
	active,
	handleClose,
	stuffCount,
	setStuffCount,
	selectedTarif,
	setSelectedTarif,
	onSelect,
}: AddStuffProps) => {
	return (
		<Widget
			active={active}
			width="450"
			handleClose={() => handleClose()}
			back={() => handleClose()}
		>
			<div className="w-full h-full mt-20">
				<div className="flex gap-2 px-5">
					<RiErrorWarningLine size={20} className="mt-1" />
					<p>Добавление сотрудников</p>
				</div>
				<p className="text-[#4E4E4E80] ml-7 px-5">
					{selectedTarif?.pricePerUser || 0} сома - 1 сотрудник
				</p>
				<p className="mt-8 text-[15px] ml-7 px-5">
					Укажите кол-во новых сотрудников
				</p>
				<div className="flex py-2 gap-2 ml-7 px-5">
					<div
						onClick={() => {
							if (stuffCount > 1) setStuffCount((prev: number) => prev - 1)
						}}
						className="bg-[#F2F2F1] rounded-full px-[8px] cursor-pointer text-myviolet"
					>
						-
					</div>
					<p>{stuffCount}</p>
					<div
						onClick={() => setStuffCount((prev: number) => prev + 1)}
						className="bg-[#F2F2F1] rounded-full px-[6px] cursor-pointer text-myviolet"
					>
						+
					</div>
				</div>
				<div className="w-full h-[1px] bg-[#D8DADC] mt-10" />
				<Flex justify="space-between" className="mt-8 px-8">
					<p className="text-[#101010] text-[16px]">К оплате</p>
					<p>{selectedTarif?.pricePerUser * stuffCount} с</p>
				</Flex>
				<Flex
					onClick={() => {
						if (stuffCount > 0) {
							setSelectedTarif({
								...selectedTarif,
								price: selectedTarif?.pricePerUser * stuffCount,
							})
							onSelect()
						}
					}}
					justify="end"
					className="px-8 mt-4"
				>
					<Button disabled={!stuffCount} width="fit-content">
						Далее
					</Button>
				</Flex>
			</div>
		</Widget>
	)
}
