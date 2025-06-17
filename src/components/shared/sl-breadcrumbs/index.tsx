import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

type BreadcrumbItem = {
	label: string
	href?: string
}

interface SlBreadcrumbsProps {
	items: BreadcrumbItem[]
}

export const SlBreadcrumbs: React.FC<SlBreadcrumbsProps> = ({ items }) => {
	return (
		<div
			style={{
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
			}}
			className="w-fit px-[20px] py-[4px] bg-white rounded-br-[16px] sticky top-[60px] z-50"
		>
			<ol className="flex space-x-1 md:space-x-3 items-center">
				{items.map((item, index) => (
					<li key={index} className="flex items-center">
						{index > 0 && (
							<MdOutlineKeyboardArrowRight className="h-5 w-5 text-[var(--myviolet)] mx-1 mt-[2px]" />
						)}

						{item.href ? (
							<a
								href={item.href}
								className={`hover:underline transition text-[14px] ${items.length === index + 1 ? 'text-[#101010]' : 'text-[var(--myviolet)]'}`}
							>
								{item.label}
							</a>
						) : (
							<span className="text-[#101010] text-[14px]">{item.label}</span>
						)}
					</li>
				))}
			</ol>
		</div>
	)
}
