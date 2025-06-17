import { useState, useEffect } from 'react'
import Checkbox from '../../UI/Checkbox'

interface Stuff {
	name: string
	masterId: string
	fullName: string
}

interface StuffSelectorProps {
	stuff?: Stuff[]
	filteredData: any[]
	setFilteredData: (data: any[]) => void
	activeTab: number
	setChoosedMaster?: (master: Stuff | null) => void
}

export const StuffSelector = ({ 
	stuff = [], 
	filteredData, 
	setFilteredData, 
	activeTab,
	setChoosedMaster 
}: StuffSelectorProps) => {
	const [selectedStuff, setSelectedStuff] = useState<Stuff[]>([])

	const isChecked = (item: Stuff) =>
		selectedStuff.some((selected) => selected.masterId === item.masterId)

	const handleToggle = (item: Stuff) => {
		if (activeTab === 1 && setChoosedMaster) {
			// Для вкладки "Неделя" - выбор только одного мастера
			const isCurrentlySelected = isChecked(item);
			
			// Если мастер уже выбран, не позволяем снять выбор
			if (isCurrentlySelected) {
				return;
			}
			
			setSelectedStuff([item]);
			setChoosedMaster(item);
		} else {
			// Для других вкладок - мультивыбор
			setSelectedStuff((prev) =>
				isChecked(item)
					? prev.filter((s) => s.masterId !== item.masterId)
					: [...prev, item]
			)
		}
	}

	const handleToggleAll = () => {
		if (activeTab === 1) {
			// Для вкладки "Неделя" нельзя выбрать всех
			return;
		}
		
		if (selectedStuff.length === stuff.length) {
			setSelectedStuff([])
		} else {
			setSelectedStuff([...stuff])
		}
	}

	useEffect(() => {
		setSelectedStuff(prev => 
			prev.filter(selected => 
				stuff.some(item => item.masterId === selected.masterId)
			)
		)
	}, [stuff])

	useEffect(() => {
		setFilteredData(selectedStuff)
	}, [selectedStuff])

	useEffect(() => {
		if (stuff.length > 0) {
			if (activeTab === 1 && setChoosedMaster) {
				// Для вкладки "Неделя" автоматически выбираем первого мастера из списка
				const firstMaster = stuff[0];
				setSelectedStuff([firstMaster]);
				setChoosedMaster(firstMaster);
			} else {
				// Для других вкладок - выбираем всех
				setSelectedStuff(stuff);
			}
		} else if (activeTab === 1 && setChoosedMaster) {
			// Сбрасываем выбор, если список мастеров пустой
			setSelectedStuff([]);
			setChoosedMaster(null);
		}
	}, [stuff, activeTab, setChoosedMaster])

	return (
		<div className="w-full flex flex-col gap-[20px]">
			<p className="text-[14px] font-[600] text-[#101010]">Сотрудники</p>
			<div className="w-full flex flex-col gap-[10px]">
				{stuff.length > 0 && activeTab !== 1 ? (
					<div className="w-full flex items-center gap-[10px]">
						<Checkbox
							checked={selectedStuff.length === stuff.length}
							setChecked={handleToggleAll}
						/>
						<p className="text-[14px] text-[#101010]">Все</p>
					</div>
				) : stuff.length === 0 ? (
					<p className="text-[14px] text-[#101010]">Сотрудники не найдены</p>
				) : (
					<p className="text-[14px] text-[#101010]">Выберите специалиста</p>
				)}
				{stuff.map((item) => (
					<div
						key={item.masterId}
						className="w-full flex items-center gap-[10px]"
					>
						<Checkbox
							checked={isChecked(item)}
							setChecked={() => handleToggle(item)}
						/>
						<p className="text-[12px] text-[#101010]">{item.fullName}</p>
					</div>
				))}
			</div>
		</div>
	)
}
