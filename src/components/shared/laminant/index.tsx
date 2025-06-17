export const Wrapper = ({ children }: any) => {
	return (
		<div className="w-[400px] xs:w-[330px] h-full px-[30px] py-[25px] shadow-md bg-white rounded-[16px] gap-[13px] flex flex-col">
			{children}
		</div>
	)
}