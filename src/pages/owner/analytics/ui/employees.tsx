import { Flex } from 'antd'
import React from 'react'
import { CustomScroll } from './scroll'
import { MdStar } from 'react-icons/md'
import { Cell, Pie, PieChart } from 'recharts'

const EmployeeCard = ({ employee }: any) => {
	
	const data = [
		{
			name: 'label',
			value: employee?.cancelPercentage || 0,
			color: '#FF5E5E',
		},
		{
			name: 'label2',
			value: 100 - employee?.cancelPercentage || 0,
			color: '#D9D9D9',
		},
	]

	return (
		<Flex
			gap={10}
			vertical
			className="bg-[#F9F9F9] rounded-[16px] p-4 w-[250px] min-w-[350px]"
		>
			<Flex justify="space-between">
				<Flex vertical>
					<p className="text-[#101010] font-[600] text-[14px]">
						{employee?.name}
					</p>
					<p className="text-[13px] text-[#4E4E4E80] font-[600]">
						{employee?.role}
					</p>
					<Flex
						gap={3}
						className="bg-[#FFF9C7] px-2 mt-2 rounded-[8px]"
						align="center"
					>
						<span className="text-[13px]">
							{Number(employee.rating).toFixed(1)}
						</span>
						{Array.from({ length: 5 }).map((_, index) => (
							<MdStar
								key={index}
								color={index < employee?.rating ? '#F4CE36' : '#C0C0C0'}
							/>
						))}
					</Flex>
				</Flex>
			</Flex>
			<Flex className="w-full" gap={10}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="24" height="24" rx="10" fill="#C7FFD2" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M18.5925 14.5968H15.8938C14.6291 14.5968 13.5998 13.5681 13.5991 12.3041C13.5991 11.0388 14.6285 10.0095 15.8938 10.0088H18.5925C18.8685 10.0088 19.0925 10.2328 19.0925 10.5088C19.0925 10.7848 18.8685 11.0088 18.5925 11.0088H15.8938C15.1798 11.0095 14.5991 11.5901 14.5991 12.3035C14.5991 13.0161 15.1805 13.5968 15.8938 13.5968H18.5925C18.8685 13.5968 19.0925 13.8208 19.0925 14.0968C19.0925 14.3728 18.8685 14.5968 18.5925 14.5968Z"
						fill="#101010"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M16.1988 12.7627H15.9908C15.7148 12.7627 15.4908 12.5387 15.4908 12.2627C15.4908 11.9867 15.7148 11.7627 15.9908 11.7627H16.1988C16.4748 11.7627 16.6988 11.9867 16.6988 12.2627C16.6988 12.5387 16.4748 12.7627 16.1988 12.7627Z"
						fill="#101010"
					/>
					<mask
						id="mask0_3647_36981"
						maskUnits="userSpaceOnUse"
						x="5"
						y="6"
						width="15"
						height="13"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M5.33331 6H19.0924V18.7819H5.33331V6Z"
							fill="white"
						/>
					</mask>
					<g mask="url(#mask0_3647_36981)">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M9.33174 7C7.6784 7 6.33307 8.34533 6.33307 9.99867V14.7833C6.33307 16.4367 7.6784 17.782 9.33174 17.782H15.0944C16.7477 17.782 18.0924 16.4367 18.0924 14.7833V9.99867C18.0924 8.34533 16.7477 7 15.0944 7H9.33174ZM15.0944 18.782H9.33174C7.12707 18.782 5.33307 16.988 5.33307 14.7833V9.99867C5.33307 7.79333 7.12707 6 9.33174 6H15.0944C17.2991 6 19.0924 7.79333 19.0924 9.99867V14.7833C19.0924 16.988 17.2991 18.782 15.0944 18.782Z"
							fill="#101010"
						/>
					</g>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12.4564 10.0254H8.85706C8.58106 10.0254 8.35706 9.80139 8.35706 9.52539C8.35706 9.24939 8.58106 9.02539 8.85706 9.02539H12.4564C12.7324 9.02539 12.9564 9.24939 12.9564 9.52539C12.9564 9.80139 12.7324 10.0254 12.4564 10.0254Z"
						fill="#101010"
					/>
				</svg>
				<Flex vertical className="w-full">
					<p>Выручка</p>
					<Flex justify="space-between" align="center" className="w-full">
						<p className="text-[#4E4E4E80] text-[14px]">за день</p>
						<p className="text-[14px]">{employee?.revenue?.day}c</p>
					</Flex>
					<Flex justify="space-between" align="center" className="w-full">
						<p className="text-[#4E4E4E80] text-[14px]">за неделю</p>
						<p className="text-[14px]">{employee?.revenue?.week}c</p>
					</Flex>
					<Flex justify="space-between" align="center" className="w-full">
						<p className="text-[#4E4E4E80] text-[14px]">за месяц</p>
						<p className="text-[14px]">{employee?.revenue?.month}c</p>
					</Flex>
				</Flex>
			</Flex>
			<Flex gap={10}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="24" height="24" rx="10" fill="#FFC4E1" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12 6.33301C8.87531 6.33301 6.33331 8.87501 6.33331 11.9997C6.33331 15.1243 8.87531 17.6663 12 17.6663C15.1246 17.6663 17.6666 15.1243 17.6666 11.9997C17.6666 8.87501 15.1246 6.33301 12 6.33301ZM12 18.6663C8.32398 18.6663 5.33331 15.6757 5.33331 11.9997C5.33331 8.32367 8.32398 5.33301 12 5.33301C15.676 5.33301 18.6666 8.32367 18.6666 11.9997C18.6666 15.6757 15.676 18.6663 12 18.6663Z"
						fill="#101010"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M14.2874 14.4608C14.2001 14.4608 14.1121 14.4382 14.0314 14.3908L11.5181 12.8915C11.3674 12.8008 11.2741 12.6375 11.2741 12.4615V9.22949C11.2741 8.95349 11.4981 8.72949 11.7741 8.72949C12.0508 8.72949 12.2741 8.95349 12.2741 9.22949V12.1775L14.5441 13.5308C14.7808 13.6728 14.8588 13.9795 14.7174 14.2168C14.6234 14.3735 14.4574 14.4608 14.2874 14.4608Z"
						fill="#101010"
					/>
				</svg>
				<Flex vertical className="w-full">
					<p>Записи</p>
					<Flex justify="space-between" align="center" className="w-full">
						<p className="text-[#4E4E4E80] text-[14px]">за день</p>
						<p className="text-[14px]">{employee?.appointments?.day}</p>
					</Flex>
					<Flex justify="space-between" align="center" className="w-full">
						<p className="text-[#4E4E4E80] text-[14px]">за неделю</p>
						<p className="text-[14px]">{employee?.appointments?.week}</p>
					</Flex>
					<Flex justify="space-between" align="center" className="w-full">
						<p className="text-[#4E4E4E80] text-[14px]">за месяц</p>
						<p className="text-[14px]">{employee?.appointments?.month}</p>
					</Flex>
				</Flex>
			</Flex>
			<Flex>
				<Flex align="center" gap={12} className="w-[250px] relative">
					<PieChart width={50} height={50}>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={17}
							outerRadius={23}
							cornerRadius={4}
							paddingAngle={2}
							labelLine={false}
							// fill={color}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry?.color} />
							))}
						</Pie>
					</PieChart>
					<p className="text-[14px]">Отмена</p>
					<div
						className="absolute top-1/2 left-[26px] transform -translate-x-1/2 -translate-y-1/2 text-center"
						style={{ width: '100px' }}
					>
						<p className="text-[12px] text-[#101010]">
							{employee?.cancelPercentage}%
						</p>
					</div>
				</Flex>
			</Flex>
			<Flex vertical gap={-2}>
				<p className="text-[14px] text-[#4E4E4E80]">Средний чек</p>
				<p className="text-[24px] text-[#101010] leading-5 font-[600]">
					{employee?.averageBill}c
				</p>
			</Flex>
		</Flex>
	)
}

// Главный компонент списка сотрудников
export const Employees = ({ data }: any) => {
	return (
		<>
			<CustomScroll height="600px" width="100%">
				<Flex wrap="nowrap" gap="small" style={{ width: 100 }}>
					{data?.map((item: any, index: number) => (
						<EmployeeCard key={index} employee={item} />
					))}
				</Flex>
			</CustomScroll>
		</>
	)
}

export default Employees
