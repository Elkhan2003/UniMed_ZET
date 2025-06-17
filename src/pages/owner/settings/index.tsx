import { useState } from 'react'
import { RxChevronRight } from 'react-icons/rx'
import { EmployeeAccessPage } from './employee-access'

const sessions = [
	{
		id: 1,
		name: 'Доступы сотрудников',
	},
]

export const OwnerSettingsPage = () => {
	const [activeSession, setActiveSession] = useState(1)
	return (
		<div className="w-full h-[calc(100vh-60px)] flex gap-4 p-[15px]">
			<div
				style={{
					boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
				}}
				className="w-[300px] h-full rounded-[16px] bg-white flex flex-col gap-[10px] p-[10px]"
			>
				<p className="text-[18px] font-[500]">Настройки</p>
				{sessions.map((session) => (
					<div
						key={session.id}
						className={`w-full px-[15px] py-[10px] cursor-pointer rounded-[16px] bg-white hover:bg-[#F5F5F5] flex items-center justify-between ${
							activeSession === session.id ? 'bg-[#F5F5F5]' : ''
						}`}
						onClick={() => setActiveSession(session.id)}
					>
						<p className="text-[14px] font-[500] leading-4">{session.name}</p>
						<RxChevronRight />
					</div>
				))}
			</div>
			<div
				style={{
					boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
				}}
				className="w-full h-full rounded-[16px] bg-white"
			>
				{activeSession === 1 ? <EmployeeAccessPage /> : null}
			</div>
		</div>
	)
}
