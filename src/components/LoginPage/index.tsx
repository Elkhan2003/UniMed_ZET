import React, { useState } from 'react'
import Login from './Login'
import { Background } from '../shared/background'
import Reset from './Reset'
import Confirm from './Confirm'
import Change from './Change'

const LoginPage = () => {
	const [step, setStep] = useState(0)
	const [phoneNumber, setPhoneNumber] = useState('+996')
	const [roles, setRoles] = useState({})
	return (
		<div className="w-full h-[100vh] flex bg-gray-100">
			{step === 0 && <Login step={step} setStep={setStep} />}
			{step === 1 && <Reset setPhoneNumber={setPhoneNumber} step={step} setStep={setStep} />}
			{step === 2 && <Confirm setRoles={setRoles} phoneNumber={phoneNumber} step={step} setStep={setStep} />}
			{step === 3 && <Change roles={roles} phoneNumber={phoneNumber} step={step} setStep={setStep} />}
			<div className="w-full h-full lg:hidden">
				<Background />
			</div>
		</div>
	)
}

export default LoginPage
