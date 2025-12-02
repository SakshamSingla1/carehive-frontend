import React from 'react';

interface CurrencyCellProps {
    data: number | string;
    props: { [key: string]: any };
}

const CurrencyCell: React.FC<CurrencyCellProps> = ({ data, props }) => {
    return (
        <div {...props}>
            <span>{data}</span>
        </div>
    );
}

export default CurrencyCell;