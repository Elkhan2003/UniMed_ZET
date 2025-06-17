import clsx from "clsx"

interface TabProp {
    active: number,
    setActive: (active: number) => void,
    panels: string[]
}

export const TabTab = ({active, setActive, panels}: TabProp) => {
    return (
        <div className="w-full rounded-[16px] h-[48px] !min-h-[48px] bg-[#D8DADC] p-[3px] gap-[3px] flex justify-between">
            {panels.map((item, index) => (
                <div onClick={() => setActive(index)} key={index} className={clsx('w-full h-full cursor-pointer rounded-[16px] flex items-center justify-center', {'text-myviolet bg-white': active === index })} >
                    {item}
                </div>
            ))}
        </div>
    )
}