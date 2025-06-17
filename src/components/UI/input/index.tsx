import clsx from 'clsx'
import styled from 'styled-components'

interface InputProp {
	title: string
	required?: boolean
	placeholder?: string
	value: any
	onChange: any
	error?: string
	classNames?: string
}

export const InoiInput = ({
	value,
	title,
	required,
	placeholder = '',
	onChange,
	error,
	classNames = '',
}: InputProp) => {
	return (
		<Wrappik className="noselect">
			<Title>
				{title} {required && <p className="text-red-500">*</p>}
			</Title>
			<StyledInput
				value={value}
				onChange={onChange}
				className={clsx(
					'border-[1px] border-transparent  border-solid focus:shadow-lg',
					classNames,
					{ 'focus:border-myviolet': classNames.length === 0 }
				)}
				placeholder={placeholder}
			/>
			{error && <Error>{error}</Error>}
		</Wrappik>
	)
}

const StyledInput = styled.input`
	width: 100%;
	height: 40px;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	font-size: 13px;
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
