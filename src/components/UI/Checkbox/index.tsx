import React from "react";
import { IoCheckmark } from "react-icons/io5";

interface CheckboxProps {
	checked: boolean;
	setChecked: (checked: boolean) => void;
	disabled?: boolean;
	color?: string
}

export const Checkbox = ({
	checked,
	setChecked,
	disabled = false,
	color = 'bg-myviolet'
}: CheckboxProps) => {
	return (
		<div
			className={`${
				!checked
					? "border-[1px] border-[#D8DADC] border-solid"
					: color
			} w-[20px] min-w-[20px] h-[20px] rounded-[5px] flex justify-center items-center cursor-pointer noselect ${
				disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
			}`}
			onClick={() => !disabled && setChecked(!checked)}
		>
			{checked && <IoCheckmark size={16} className="text-white" />}
		</div>
	);
};

export default Checkbox;
