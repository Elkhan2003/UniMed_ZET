import { useState } from 'react'
import { StockCategories } from './categories'
import { StockProducts } from './products'
import { StockProductsCreate } from './products/create'

import { ReactComponent as Search } from '../../assets/icons/usage/search.svg'
import { ReactComponent as AddFile } from '../../assets/icons/usage/add-file.svg'
import { ReactComponent as Paper } from '../../assets/icons/usage/paper.svg'
import { CreateEntrance } from './products/create-entrance'

import { useOwnerStore } from '../../shared/states/owner.store'
import { HistoryProducts } from './products/history'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

const stationNames = {
	stock: 'Склад',
	archive: 'Архив',
	history: 'История',
}

export const StockPage = () => {
	const branchId = useOwnerStore((state: any) => state.branchId)
	const storeArhiveProducts: Function = useOwnerStore(
		(state: any) => state.storeArhiveProducts
	)
	const [search, setSearch] = useState('')

	const [createProduct, setCreateProduct] = useState(false)
	const [createEntrance, setCreateEntrance] = useState(false)

	const [station, setStations] = useState<'stock' | 'archive' | 'history'>(
		'stock'
	)

	return (
		<>
			{station !== 'stock' && (
				<div
					style={{
						boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
					}}
					className="w-fit px-[20px] py-[4px] bg-white rounded-br-[16px] sticky top-[60px] z-50"
				>
					<ol className="flex space-x-1 md:space-x-3 items-center">
						{[
							{
								label: 'Склад',
								href: 'stock',
							},
							{
								label:
									station === 'archive'
										? 'Архив товаров'
										: 'История поступления товара',
							},
						].map((item, index) => (
							<li key={index} className="flex items-center">
								{index > 0 && (
									<MdOutlineKeyboardArrowRight className="h-5 w-5 text-[var(--myviolet)] mx-1 mt-[2px]" />
								)}

								{item.href ? (
									<p
										onClick={() => setStations(item.href as any)}
										className={`hover:underline transition text-[14px] ${2 === index + 1 ? 'text-[#101010]' : 'text-[var(--myviolet)]'}`}
									>
										{item.label}
									</p>
								) : (
									<span className="text-[#101010] text-[14px]">
										{item.label}
									</span>
								)}
							</li>
						))}
					</ol>
				</div>
			)}
			<div className="w-full h-full p-[15px] flex flex-col gap-[15px]">
				<StockProductsCreate
					active={createProduct}
					handleClose={() => setCreateProduct(false)}
				/>
				<CreateEntrance
					active={createEntrance}
					handleClose={() => setCreateEntrance(false)}
					branchId={branchId}
				/>
				<div className="w-full flex items-center justify-between gap-[15px]">
					<p className="text-[#101010] text-[20px]">{stationNames[station]}</p>
					<div className="relative w-full">
						<input
							style={{
								boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
							}}
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={
								station === 'history'
									? 'Поиск по поставщику'
									: 'Поиск по названию товара, артикулу или штрих-коду'
							}
							className="w-full h-[37px] rounded-[24px] bg-white px-[16px] py-[9px] text-[14px] placeholder:text-[#4E4E4E80] text-[#101010]"
						/>
						<Search className="absolute right-[16px] top-[9px]" />
					</div>
					{/* <div className="bg-[#D8DADC] w-[37px] h-[37px] min-w-[37px] rounded-full flex items-center justify-center hover:bg-[#C4C4C4] transition-all duration-300 cursor-pointer hover:shadow-md">
						<AddFile />
					</div> */}
					<button
						style={{
							boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
						}}
						onClick={() => setCreateProduct(true)}
						className="w-fit h-[37px] rounded-[24px] bg-[#101010] text-white text-[14px] px-[16px] py-[8px] whitespace-nowrap transition-all duration-300 shadow-xl hover:scale-[1.02] !hover:shadow-2xl"
					>
						+ Добавить товар
					</button>
				</div>
				{station !== 'history' && (
					<div
						style={{
							boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
						}}
						className="bg-white rounded-[24px] w-full p-[20px] flex items-center justify-between gap-[20px]"
					>
						<p className="text-[#101010] text-[16px] font-[600] w-fit">
							Действия
						</p>
						{station === 'stock' ? (
							<>
								<div
									onClick={() => setCreateEntrance(true)}
									className="w-full py-[8px] rounded-[10px] bg-[#E8EAED] flex items-center justify-center gap-[6px] cursor-pointer hover:shadow-md"
								>
									<Paper />
									<p className="text-[#101010] text-[14px] font-[600]">
										Поступление товара
									</p>
								</div>
								<div
									onClick={() => setStations('history')}
									className="w-full py-[8px] rounded-[10px] bg-[#E8EAED] flex items-center justify-center gap-[6px] cursor-pointer hover:shadow-md text-[#101010] text-[14px] font-[600]"
								>
									История поступления товара
								</div>
								<div
									onClick={() => storeArhiveProducts()}
									className="w-full py-[8px] rounded-[10px] bg-[#E8EAED] flex items-center justify-center gap-[6px] cursor-pointer hover:shadow-md text-[#101010] text-[14px] font-[600]"
								>
									Архивация
								</div>
								<p
									onClick={() => setStations('archive')}
									className="text-[#FF99D4] text-[14px] font-[600] whitespace-nowrap hover:underline cursor-pointer"
								>
									Архив товаров
								</p>
							</>
						) : (
							<div className="flex items-center gap-[20px]">
								<p className="text-[#4E4E4E80] text-[12px] whitespace-nowrap">
									Выберите из списка товары, которые хотите извлечь
								</p>
								<div
									onClick={() => storeArhiveProducts()}
									className="w-full py-[8px] rounded-[10px] bg-[#F5F5F5] border-[1px] border-[#E8EAED] border-solid px-[50px] flex items-center justify-center gap-[6px] cursor-pointer hover:shadow-md text-[#101010] text-[14px] font-[600]"
								>
									Извлечь товары из архива
								</div>
							</div>
						)}
					</div>
				)}
				{station === 'history' ? (
					<HistoryProducts
						search={search}
						branchId={branchId}
						station={station}
					/>
				) : (
					<div className="w-full h-full flex gap-[15px]">
						<StockCategories />
						<StockProducts
							search={search}
							branchId={branchId}
							station={station}
						/>
					</div>
				)}
			</div>
		</>
	)
}
