import { useState } from 'react'
import styled from 'styled-components'
import { IoEyeOutline } from 'react-icons/io5'
import { IoEyeOffOutline } from 'react-icons/io5'
import clsx from 'clsx'

interface InputProp {
	title: string
	required?: boolean
	placeholder?: string
	value: any
	onChange: any
	error?: string
}

export const InoiInputPassword = ({
	value,
	title,
	required,
	placeholder = '',
	onChange,
	error,
}: InputProp) => {
	const [open, setOpen] = useState(true)
	return (
		<Wrappik className="noselect">
			<Title>
				{title} {required && <p className="text-red-500">*</p>}
			</Title>
			<StyledInput
				value={value}
				onChange={onChange}
				className={clsx('border-[1px] border-transparent focus:border-myviolet border-solid focus:shadow-lg', {'text-white': open})}
				placeholder={placeholder}
			/>
            {open && (
                <div className="absolute left-3 bottom-0 top-8 flex items-center">
                    <p className='text-black'>{value.split('').map((item: any) => <span>*</span>)}</p>
                </div>
            )}
			{error && <Error>{error}</Error>}
			<div className="absolute right-0 w-[50px] bottom-0 top-5 flex items-center justify-center">
				{open ? (
					<IoEyeOffOutline onClick={() => setOpen(false)} className="cursor-pointer" />
				) : (
					<IoEyeOutline onClick={() => setOpen(true)} className="cursor-pointer" />
				)}
			</div>
		</Wrappik>
	)
}

const StyledInput = styled.input`
	width: 100%;
	height: 40px;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	font-size: 13px;
	// letter-spacing: 0.5px;
	font-weight: 400;
	padding: 0px 10px;
	position: relative;

	&::placeholder {
		color: #a0a0a0;
		font-weight: 300;
		font-size: 13px;
	}
	font-family: 'Involve', sans-serif;
`

const Wrappik = styled.div`
	width: 100%;
	font-family: 'Involve', sans-serif;
	position: relative;
`

const Error = styled.p`
	font-size: 11px;
	color: red;
	padding-left: 10px;
	position: absolute;
`

const Title = styled.p`
	font-weight: 400;
	font-size: 13px;
	display: flex;
	align-items: center;
	font-family: 'Involve', sans-serif;
`
