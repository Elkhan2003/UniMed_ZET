import React from 'react';

const DatePicker = ({
    label,
    value,
    onChange,
    width = '100%',
    height = 'auto',
}: any) => {
    return (
        <div className='flex flex-col'>
            <p className='text-[14px] text-gray-600'>{label}</p>
            <input
                type='date'
                value={value}
                onChange={onChange}
                className='border border-solid border-gray-300 p-2 text-gray-500 font-normal text-sm rounded-md xs:w-[120px] xs:text-sm'
            />
        </div>
    );
};

export default DatePicker;
