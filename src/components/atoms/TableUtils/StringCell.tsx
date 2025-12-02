import React from 'react';

interface StringCellProps {
    data: string;
    props: { [key: string]: any };
}

const StringCell: React.FC<StringCellProps> = ({ data, props }) => {
    return (
        <div title={data} {...props}>
            <span>{data}</span>
        </div>
    );
}
export default StringCell