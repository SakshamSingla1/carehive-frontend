import React, { useState } from "react";
import TablePagination from '@mui/material/TablePagination';
import DateTimeCell from "../atoms/TableUtils/DateTimeCell";
import CurrencyCell from "../atoms/TableUtils/CurrencyCell";
import NumberCell from "../atoms/TableUtils/NumberCell";
import StringCell from "../atoms/TableUtils/StringCell";
import { createUseStyles } from "react-jss";
import DateCell from "../atoms/TableUtils/DateCell";
import { IconButton, Input } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import { getColor } from "../../utils/helper";

export interface Pagination {
  limit: number;
  isVisible: boolean;
  currentPage: number;
  total: number;
  handleChangePage?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type ColumnType = "number" | "string" | "date" | "datetime" | "custom" | "currency";

export interface TableColumn {
  label: string;
  key: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  component?: (props: any) => React.ReactNode
  type: ColumnType;
  props: { [key: string]: any };
}

export interface TableSchema {
  id: string;
  title?: string;
  pagination: Pagination;
  sort?: {
    sortBy: "asc" | "desc";
    sortOn: string;
  }
  filter?: {
    [key: string]: any;
  }
  columns: TableColumn[];
}

interface TableProps {
  schema: TableSchema;
  records: any[][];
  isRounded?: boolean;
}

// ---------------------------------------------------------------------------------------
// THEME-INTEGRATED JSS STYLES
// ---------------------------------------------------------------------------------------

const useStyles = createUseStyles({
  mainTableContainer: (colors: any) => ({
    border: `1px solid ${colors.neutral200}`,
    color: colors.neutral700,
    overflowX: "auto",
  }),

  cellWrap: {
    whiteSpace: "nowrap",
    padding: "0px 8px"
  },

  tableWrapper: {
    overflowX: "auto",
    width: "100%",
  },

  header: (colors: any) => ({
    backgroundColor: colors.neutral50,
    whiteSpace: "nowrap",
  }),

  title: (colors: any) => ({
    color: colors.neutral700,
  }),

  tableBody: (colors: any) => ({
    color: colors.neutral700,
  }),

  tableRow: (colors: any) => ({
    '&:nth-child(odd)': {
      backgroundColor: colors.neutral50,
    },
    '&:nth-child(even)': {
      backgroundColor: colors.neutral50,
    },
    borderBottom: `1px solid ${colors.neutral200}`,
    borderTop: `1px solid ${colors.neutral200}`,
  }),

  paginationTable: (colors: any) => ({
    "& .MuiTablePagination-selectLabel": {
      color: colors.neutral900,
      fontWeight: 500,
      fontSize: "14px",
    },

    "& .MuiTablePagination-input": {
      borderRadius: '8px',
      border: `1px solid ${colors.neutral200}`,
      width: '80px',
      paddingRight: '10px',
      marginRight: "24px",
      height: "30px"
    },

    "& .MuiTablePagination-displayedRows": {
      color: colors.neutral900,
      fontWeight: 500,
      fontSize: "14px",
    },

    "& .MuiTablePagination-spacer": {
      flex: 0
    },

    "& .MuiToolbar-root": {
      paddingLeft: "0px !important",
      paddingRight: "0px",
      width: "100%"
    },
  }),

  paginationComponent: (colors: any) => ({
    color: colors.neutral900,
    fontWeight: 500,
    fontSize: "14px",
    width: "100%"
  }),
});

// ---------------------------------------------------------------------------------------
// CELL VIEW HANDLING
// ---------------------------------------------------------------------------------------

const getCellView = (data: any, columnProps: TableColumn) => {
  const { type, component, props } = columnProps;

  if (type === "custom" && component) {
    return component({ value: data, ...props });
  }

  switch (type) {
    case "number": return <NumberCell data={data} props={props} />;
    case "date": return <DateCell data={data} props={props} />;
    case "datetime": return <DateTimeCell data={data} props={props} />;
    case "currency": return <CurrencyCell data={data} props={props} />;
    default: return <StringCell data={data} props={props} />;
  }
};

// ---------------------------------------------------------------------------------------
// PAGINATION ACTIONS COMPONENT
// ---------------------------------------------------------------------------------------

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 25, 50];

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const [inputPage, setInputPage] = useState(page + 1);

  const handleFirstPageButtonClick = (event: any) => onPageChange(event, 0);
  const handleBackButtonClick = (event: any) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event: any) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event: any) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <div className="flex gap-x-6 justify-end items-center">
      <div className="flex gap-x-2.5">
        <div className="my-auto">Page</div>

        <Input
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(parseInt(e.target.value, 10))}
          onBlur={() => onPageChange(null, inputPage - 1)}
          disableUnderline
          inputProps={{ min: 1, max: Math.ceil(count / rowsPerPage) }}
          style={{
            width: '54px',
            height: '28px',
            borderRadius: '8px',
            border: '1px solid #E6E6E6',
            paddingLeft: '16px'
          }}
        />

        <div className="my-auto">of {Math.ceil(count / rowsPerPage)}</div>
      </div>

      <div className='flex'>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>

        <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>

        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>

        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------
// MAIN TABLE COMPONENT
// ---------------------------------------------------------------------------------------

const TableV2: React.FC<TableProps> = ({ schema, records, isRounded = true }) => {

  const { defaultTheme } = useAuthenticatedUser();

  const colors = {
    primary300: getColor(defaultTheme, "primary300") ?? "#3498db",

    neutral50: getColor(defaultTheme, "neutral50") ?? "#FAFAFA",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#eeeeee",
    neutral400: getColor(defaultTheme, "neutral400") ?? "#aaaaaa",
    neutral700: getColor(defaultTheme, "neutral700") ?? "#555",
    neutral900: getColor(defaultTheme, "neutral900") ?? "#222",

    secondary50: getColor(defaultTheme, "secondary50") ?? "#FFFDE7",
    secondary200: getColor(defaultTheme, "secondary200") ?? "#FFECB3",
    secondary400: getColor(defaultTheme, "secondary400") ?? "#FFC107",
  };

  const classes = useStyles(colors);

  const { total, isVisible, currentPage, limit,
    handleChangePage = () => { },
    handleChangeRowsPerPage = () => { }
  } = schema.pagination;

  const centerColumns: number[] = [];
  schema.columns.forEach((col, index) => {
    if (["status", "action"].includes(col.key)) centerColumns.push(index);
  });

  return (
    <div>
      {schema.title && <span className={`${classes.title} text-xl font-normal`}>{schema.title}</span>}

      <div className={`${classes.mainTableContainer} ${isRounded ? "rounded-2xl" : ""}`}>

        <table className={`w-full ${isRounded ? "rounded-2xl" : ""} ${classes.tableWrapper}`}>
          <thead className={`${classes.header} text-sm`}>
            <tr className="h-12 font-medium">
              {schema.columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-2 font-medium ${centerColumns.includes(index) ? "!text-center" : "!text-left pl-3"}`}
                >
                  {column.label.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`${classes.tableBody} text-sm font-normal`}>
            {records.map((record, rowIndex) => (
              <tr key={rowIndex} className={`${classes.tableRow} h-12`}>
                {schema.columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${classes.cellWrap} ${centerColumns.includes(colIndex) ? "!text-center" : "!text-left pl-3"}`}
                  >
                    {getCellView(record[colIndex], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={!isVisible ? `hidden` : `flex`}>
        <TablePagination
          className={`${classes.paginationTable} w-full mt-2`}
          component="div"
          count={total}
          page={currentPage}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showLastButton
          showFirstButton
          labelRowsPerPage="Rows per page"
          ActionsComponent={TablePaginationActions}
        />
      </div>
    </div>
  );
};

export default TableV2;
