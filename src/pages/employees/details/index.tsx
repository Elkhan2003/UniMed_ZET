import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useGetMasterProfileByIdQuery } from '../../../store/queries/masters.service'
import ReusableTabs from '../../../components/shared/sl-tab'

import Loading from '../../loading'
import { Visits } from './visits'
import { SlScrollShadow } from '../../../components/shared/sl-scroll-shadow'
import { MasterMiniProfile } from './profile'
import { MasterMiniSchedule } from './schedule'

const tabs = [
	{
		id: 0,
		label: 'Визиты',
		value: 'visits',
	},
	{
		id: 1,
		label: 'Услуги',
		value: 'services',
	},
	{
		id: 2,
		label: 'О специалисте',
		value: 'about',
	},
	{
		id: 3,
		label: 'Отзывы',
		value: 'reviews',
	},
	{
		id: 4,
		label: 'Доступ',
		value: 'access',
	},
]

export const EmployeeDetails = () => {
	const { id } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [activeTab, setActiveTab] = useState(
		tabs.findIndex((item) => item.value === searchParams.get('tab')) >= 0
			? tabs.findIndex((item) => item.value === searchParams.get('tab'))
			: 0
	)

	const { data: master, isLoading } = useGetMasterProfileByIdQuery(Number(id))

	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] p-[15px] flex gap-[15px]">
			<div className="w-[25%] h-full flex flex-col gap-[15px]">
				<div
					style={{
						boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
						backdropFilter: 'blur(100px)',
					}}
					className="w-full h-[40%] max-h-[40%] rounded-[16px] bg-white p-[15px] flex flex-col gap-[10px] overflow-y-auto"
				>
					{isLoading ? (
						<div className="w-full h-full flex items-center justify-center">
							<Loading />
						</div>
					) : (
						<MasterMiniProfile master={master} />
					)}
				</div>
				<div
					style={{
						boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
						backdropFilter: 'blur(100px)',
					}}
					className="w-full h-[60%] rounded-[16px] bg-white flex items-center justify-between"
				>
					{isLoading ? (
						<div className="w-full h-full flex items-center justify-center">
							<Loading />
						</div>
					) : (
						<MasterMiniSchedule />
					)}
				</div>
			</div>
			<div className="w-[75%] h-full flex flex-col gap-[15px]">
				<div className="max-w-[550px] min-w-[400px]">
					<ReusableTabs
						tabs={tabs}
						searchParams={searchParams}
						setSearchParams={setSearchParams}
						active={activeTab}
						onChange={handleTabChange}
					/>
				</div>
				<SlScrollShadow
					innerClassName="w-full rounded-[16px] overflow-x-auto"
					topShadowClassName="rounded-t-[16px]"
					bottomShadowClassName="rounded-b-[16px]"
					className="rounded-[16px] border w-full h-full overflow-y-auto overflow-x-auto"
				>
					{activeTab === 0 && <Visits masterId={Number(id)} />}
				</SlScrollShadow>
			</div>
		</div>
	)
}
