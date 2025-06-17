import { Flex } from 'antd'
import { StyledTitle } from '../../../shared/styles'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { TransformTarrif } from './TransformTarrif'
import { useState } from 'react'
import { useGetTarifsQuery } from '../../../store/queries/tarrif.service'
import { CardTarif } from './CardTarif'

const TARRIF_OPTIONS = [
	{
		name: 'Индивидуал',
		value: 'PERSONAL',
	},
	{
		name: 'Компания',
		value: 'COMPANY',
	},
]

const editHelp = {
	name: '',
	description: '',
	price: '',
	durationInDays: '',
	maxUsers: '',
	active: true,
	tariffType: 'PERSONAL',
	features: [],
}

export const TariffsPage = () => {
	const { data = [], isLoading } = useGetTarifsQuery()
	const [active, setActive] = useState(false)
	const [editId, setEditId] = useState(0)
	const [editData, setEditData] = useState<any>(editHelp)
	const [tab, setTab] = useState(0)

	const tarriffs = data.filter(
		(item: any) => item.tariffType === TARRIF_OPTIONS[tab].value
	)

	return (
		<div className="w-full h-[calc(100vh-45px)] overflow-y-auto p-2">
			<TransformTarrif
				tab={tab}
				setTab={setTab}
				editData={editData}
				editId={editId}
				active={active}
				handleClose={() => {
					setActive(false)
					setEditData(editHelp)
					setEditId(0)
				}}
				setTabProp={setTab}
			/>
			<Flex justify="space-between">
				<StyledTitle>Тарифные планы</StyledTitle>
				<Button
					onClick={() => setActive(true)}
					width="130px"
					backgroundColor="var(--myadmin)"
				>
					Создать тариф
				</Button>
			</Flex>
			<Flex vertical align="center" className="w-full ">
				<div className="relative w-fit flex gap-3 bg-white rounded-[16px] h-[40px] mb-6">
					{TARRIF_OPTIONS.map(
						(item: { name: string; value: string }, i: number) => (
							<div
								key={i}
								className="w-[150px] z-10 cursor-pointer flex items-center justify-center"
								onClick={() => setTab(i)}
							>
								<p
									className={`text-sm noselect text-center transition-all duration-200 font-[600] ${
										tab === i ? 'text-white' : 'text-myadmin'
									}`}
								>
									{item.name}
								</p>
							</div>
						)
					)}
					<div
						className={`absolute bg-myadmin h-full transition-all duration-200 rounded-[16px] w-[150px]`}
						style={{
							height: '100%',
							left: `${TARRIF_OPTIONS.findIndex((item, index) => index === tab) * 162}px`,
						}}
					/>
				</div>
				{tarriffs.length ? (
					<div className="w-full grid grid-cols-4 px-4 gap-4">
						{tarriffs.map((item: any, index: number) => (
							<CardTarif
								setTab={setTab}
								key={index}
								index={index}
								{...item}
								setActive={setActive}
								setEditData={setEditData}
								setEditId={setEditId}
							/>
						))}
					</div>
				) : isLoading ? (
					<Flex justify="center">
						<p>Загрузкa...</p>
					</Flex>
				) : (
					<Flex justify="center">
						<p>Нет тарифов</p>
					</Flex>
				)}
			</Flex>
		</div>
	)
}
