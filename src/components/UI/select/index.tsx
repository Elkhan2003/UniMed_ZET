import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { IoIosArrowDown } from 'react-icons/io'
import { BsDatabaseX } from 'react-icons/bs'
import clsx from 'clsx'

interface SelectProp {
	placeholder: string
	title: string
	required?: boolean
	options: any[]
	value: any
	setValue: any
	error?: string
	noData?: any
	noIcon?: boolean
	renderOption?: any
	color?: string
	renderValue?: any
}

export const InoiSelect = ({
	title,
	required,
	options,
	placeholder,
	value,
	setValue,
	error,
	noData,
	noIcon = false,
	color = 'focus:border-myviolet',
	renderOption = (item: any) => item,
	renderValue = (item: any) => item,
}: SelectProp) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleSelect = (option: string) => {
		setValue(option)
		setIsOpen(false)
	}

	return (
		<Wrapper className="noselect" ref={dropdownRef}>
			<Title>
				{title}
				{required && <p className="text-red-500">*</p>}
			</Title>
			<SelectBox
				tabIndex={0}
				onClick={() => setIsOpen(!isOpen)}
				className={clsx("border-[1px] border-transparent border-solid focus:shadow-lg", color)}
			>
				{value ? (
					<Value>{renderValue(value) || (value['name'] ?? value)}</Value>
				) : (
					<Placeholder>{placeholder}</Placeholder>
				)}
				<div className="absolute right-2 top-0 bottom-0 flex justify-center items-center">
					<IoIosArrowDown
						size={18}
						className={`text-[#999999] ${
							!isOpen ? 'rotate-0' : 'rotate-180'
						} transition-all duration-300 `}
					/>
				</div>
			</SelectBox>
			<Dropdown isOpen={isOpen}>
				{options.length ? (
					options.map((option: any, index) => (
						<Option key={index} onClick={() => handleSelect(option)}>
							{renderOption(option['name'] ?? option)}
						</Option>
					))
				) : (
					<div className="w-full flex justify-center items-center p-2">
						<div className="flex flex-col justify-center items-center gap-2 text-xs text-[#abadae]">
							{!noIcon && <BsDatabaseX size={26} className="text-[#abadae]" />}
							{noData || (
								<div className="text-[#abadae] text-xs font-[300]">
									Пустые данные
								</div>
							)}
						</div>
					</div>
				)}
			</Dropdown>
			{error && <Error>{error}</Error>}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	position: relative;
	font-family: 'Involve', sans-serif;
`

const Title = styled.p`
	font-weight: 400;
	font-size: 13px;
	display: flex;
	align-items: center;
	font-family: 'Involve', sans-serif;
`

const Error = styled.p`
	font-size: 11px;
	color: red;
	padding-left: 10px;
	position: absolute;
`

const Value = styled.span`
	color: #101010;
	font-size: 13px;
	font-weight: 400;
	font-family: 'Involve', sans-serif;
`

const SelectBox = styled.div`
	width: 100%;
	height: 40px;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 400;
	padding: 0px 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
	transition: box-shadow 0.2s ease-in-out;
	font-family: 'Involve', sans-serif;
`

const Placeholder = styled.span`
	color: #a0a0a0;
	font-weight: 300;
	font-size: 12px;
	font-family: 'Involve', sans-serif;
`

const Dropdown = styled.ul<{ isOpen: boolean }>`
	position: absolute;
	top: 62px;
	left: 0;
	width: 100%;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	background-color: #fff;
	list-style: none;
	padding: 5px;
	margin: 0;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	z-index: 99999;
	max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
	overflow: auto;
	transition:
		max-height 0.2s ease-in-out,
		opacity 0.2s ease-in-out;
	opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
	font-family: 'Involve', sans-serif;
`

const Option = styled.li`
	padding: 3px 10px;
	cursor: pointer;
	font-size: 13px;
	border-radius: 5px;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f1f1f1;
	}
	font-family: 'Involve', sans-serif;
`
