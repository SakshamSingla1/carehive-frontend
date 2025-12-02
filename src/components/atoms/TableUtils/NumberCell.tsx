import React from 'react';

interface NumberCellProps {
    data: number;
    props: { [key: string]: any };
}

const NumberCell: React.FC<NumberCellProps> = ({ data, props }) => {
    return (
        <div {...props}>
            <span>{data}</span>
        </div>
    );
}
export default NumberCell