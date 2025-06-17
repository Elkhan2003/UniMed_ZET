import { MdKeyboardArrowDown } from 'react-icons/md'

interface SlSelectProps {
	label: string
	value: string
	required?: boolean
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	options: { value: string; label: string }[]
	error?: string
	placeholder?: string
}

export const SlSelect = ({
	label,
	value,
	onChange,
	required = false,
	options,
	error,
	placeholder,
	...props
}: SlSelectProps) => {
	return (
		<div className="w-full flex flex-col gap-[5px]">
			<p className="text-[14px] font-[400] text-[#101010]">
				{label}
				{required && <span className="text-[#FF0000]">*</span>}
			</p>
			<div className="relative">
				<select
					style={{
						border: error ? '1px solid #FF0000' : '1px solid #E8EAED',
					}}
					className="w-full h-[40px] rounded-[8px] px-[10px] pr-[35px] pb-1 appearance-none text-[#101010] text-[14px] font-[400] bg-white"
					value={value}
					onChange={onChange}
					{...props}
				>
					{placeholder && (
						<option key={'placeholder'} value={placeholder} disabled={required}>
							{placeholder}
						</option>
					)}
					<option value="" key="empty"></option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				<div className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-[#4E4E4E] text-[12px]">
					<MdKeyboardArrowDown size={20} />
				</div>
			</div>
			{error && <p className="text-[#FF0000] text-[12px]">{error}</p>}
		</div>
	)
}
