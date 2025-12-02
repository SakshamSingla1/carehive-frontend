import React from 'react';

interface DateTimeCellProps {
    data: string;
    props: { [key: string]: any };
}

const DateTimeCell: React.FC<DateTimeCellProps> = ({ data, props }) => {
    return (
        <div {...props}>
            <span>{data}</span>
        </div>
    );
}

export default DateTimeCell