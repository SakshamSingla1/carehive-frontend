import React from 'react';

interface DateCellProps {
    data: string;
    props: { [key: string]: any };
}

const DateCell: React.FC<DateCellProps> = ({ data, props }) => {
    return (
        <div {...props}>
            <span>{data}</span>
        </div>
    );
}

export default DateCell;