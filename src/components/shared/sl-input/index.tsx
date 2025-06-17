import { InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface SlInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	placeholder: string
	required?: boolean
	error?: string
	register?: UseFormRegisterReturn
}

export const SlInput = ({
	label,
	placeholder,
	required = false,
	error,
	register,
	...props
}: SlInputProps) => {
	return (
		<div className="w-full flex flex-col gap-[5px]">
			<label className="text-[14px] font-[400] text-[#101010]">
				{label}
				{required && <span className="text-[#FF0000]">*</span>}
			</label>
			<input
				className={`w-full h-[40px] rounded-[8px] border-[1px] ${
					error ? 'border-[#FF0000]' : 'border-[#E8EAED]'
				} border-solid px-[10px] pb-1 placeholder:text-[#4E4E4E80] placeholder:text-[14px] font-[400] text-[#101010] text-[14px]`}
				placeholder={placeholder}
				{...register}
				{...props}
			/>
			{error && <span className="text-[12px] text-[#FF0000]">{error}</span>}
		</div>
	)
}
