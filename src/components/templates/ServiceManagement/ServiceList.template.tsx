import React from "react";
import { type ColumnType } from "../../atoms/Table";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../atoms/Table";
import { type ServiceResponse, type ServiceFilterRequest } from "../../../services/useServicesService";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button";

interface IServiceListTableTemplateProps {
    services: ServiceResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ServiceFilterRequest;
}

const ServiceListTableTemplate: React.FC<IServiceListTableTemplateProps> = ({ services, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const handleAddService = () => {
        navigate(makeRoute(ADMIN_ROUTES.SERVICES_ADD, {}));
    }

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.SERVICES_EDIT, {
                params: { id },
                query: query    
            })
        );
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.SERVICES_VIEW, {
                params: { id },
                query: query
            })
        );
    }

    const Action = (id: string) => {
        return (
            <div className='flex justify-center space-x-2' title=''>
                <button onClick={() => handleEdit(id)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(id)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => services?.map((service: ServiceResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        service.name,
        service.pricePerHour,
        DateUtils.dateTimeSecondToDate(service.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(service.updatedAt ?? ""),
        service.status,
        Action(service?.id || "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' } },
        { label: "Price", key: "pricePerHour", type: "number" as ColumnType, props: { className: '' } },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Status", key: "status", type: "text" as ColumnType, props: { className: '' } },
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
                <div className={`text-2xl font-semibold my-auto`}>Service List</div>
                <Button 
                    onClick={handleAddService}
                    variant="primaryContained"
                    label="Add New Service"
                />
            </div>
            <div className='flex justify-end'>
                <div className={`w-[250px]`}>
                    <TextField
                        label=''
                        variant="outlined"
                        placeholder="Search..."
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
export default ServiceListTableTemplate;
