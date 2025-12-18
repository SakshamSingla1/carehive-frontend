import React from "react";
import { type ColumnType } from "../../atoms/Table";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import { Button } from "@mui/material";
import TextField from "../../atoms/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../atoms/Table";
import { type TemplateResponse, type TemplateFilterRequest } from "../../../services/useTemplateService";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";

interface TemplateListTableTemplateProps {
    templates: TemplateResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: TemplateFilterRequest;
}

const TemplateListTableTemplate: React.FC<TemplateListTableTemplateProps> = ({ templates, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const handleAddTemplate = () => {
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_ADD,{}));
    }

    const handleEdit = (name: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_EDIT, { query, params: { name: name } }));
    }

    const handleView = (name: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_VIEW, { query, params: { name: name } }));
    }

    const Action = (name: string) => {
        return (
            <div className='flex justify-center space-x-2' title=''>
                <button onClick={() => handleEdit(name)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(name)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => templates?.map((template: TemplateResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        template.name,
        template.subject,
        template.type,
        DateUtils.dateTimeSecondToDate(template.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(template.updatedAt ?? ""),
        template.active,
        Action(template.name ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' } },
        { label: "Subject", key: "subject", type: "text" as ColumnType, props: { className: '' } },
        { label: "Type", key: "type", type: "text" as ColumnType, props: { className: '' } },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Active", key: "active", type: "text" as ColumnType, props: { className: '' } },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' } },
    ]

    const getSchema = () => ({
        id: "1",
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: getTableColumns() ?? []
    });

    return (
        <div className="grid gap-y-4">
            <div className='flex justify-between'>
                <div className={`text-2xl font-semibold my-auto`}>Template List</div>
                <Button
                    variant="contained"
                    onClick={handleAddTemplate}
                    aria-label="Add Template"
                >
                    Add Template
                </Button>
            </div>
            <div className='flex justify-between'>
                <div className={`w-[250px]`}>
                    <TextField
                        label=''
                        variant="outlined"
                        placeholder="Search...."
                        value={filters.search}
                        name='search'
                        onChange={(event) => {
                            handleFiltersChange("search", event.target.value)
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" className='pl-[11px]'> <FiSearch /></InputAdornment>,
                        }}
                    />
                </div>
            </div>
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default TemplateListTableTemplate;
