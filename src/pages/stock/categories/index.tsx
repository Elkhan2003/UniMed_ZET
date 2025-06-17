import { useState } from 'react'
import { useGetInventoryCategories } from '../../../shared/queries/inventory.queries'
import { CreateCategory } from './create'

import { ReactComponent as Edit } from '../../../assets/icons/action/edit.svg'
import { EditCategory } from './edit'

export const StockCategories = () => {
	const { data: categories = [] } = useGetInventoryCategories()

	const [createActive, setCreateActive] = useState(false)

	const [editActive, setEditActive] = useState(false)
	const [editData, setEditData] = useState<{ name: string; id: number } | null>(
		null
	)

	return (
		<div
			style={{
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
			}}
			className="w-[25%] h-fit bg-white rounded-[24px] p-[20px] transition-all duration-300"
		>
			<CreateCategory active={createActive} setActive={setCreateActive} />
			<EditCategory
				active={editActive}
				setActive={setEditActive}
				editData={editData}
			/>
			<p className="text-[#101010] text-[16px] font-[600]">Категории товаров</p>
			<p className="text-[#4E4E4E80] text-[12px] font-[400]">
				Нажмите на категорию для просмотра списка товаров
			</p>
			<hr className="w-full h-[1px] bg-[#E8EAED] my-[10px]" />
			<div className="w-full flex flex-col gap-[5px] mb-[10px]">
				{categories.map((category: any) => (
					<div
						key={category.id}
						className="w-full flex items-center justify-between"
					>
						<p className="text-[#101010] text-[14px]">{category.name}</p>
						<div className="flex items-center gap-1">
							<p className="text-[#101010] text-[14px]">{category.count}</p>
							<div
								className="p-[6px] rounded-full hover:bg-[#E8EAED] cursor-pointer"
								onClick={() => {
									setEditData({ name: category.name, id: category.id })
									setEditActive(true)
								}}
							>
								<Edit />
							</div>
						</div>
					</div>
				))}
			</div>
			<button
				style={{
					boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
				}}
				onClick={() => setCreateActive(true)}
				className="w-full h-[37px] rounded-[24px] bg-[#101010] text-white text-[14px] px-[16px] py-[8px] whitespace-nowrap transition-all duration-300 shadow-xl hover:scale-[1.02] !hover:shadow-2xl"
			>
				+ Добавить категорию
			</button>
		</div>
	)
}
