import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../atoms/Table";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import { Button, Select, MenuItem } from "@mui/material";
import TextField from "../../atoms/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../atoms/Table";
import { type NavlinkResponse, type NavlinkFilterRequest } from "../../../services/useNavlinkService";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { useRoleService, type RoleResponse } from "../../../services/useRoleService";
import { HTTP_STATUS } from "../../../utils/types";

interface INavlinkListTableTemplateProps {
    navlinks: NavlinkResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: NavlinkFilterRequest;
}

const NavlinkListTableTemplate: React.FC<INavlinkListTableTemplateProps> = ({ navlinks, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roleService = useRoleService();
    const [roles, setRolesTo] = useState<RoleResponse[]>([]);

    const loadRoles = async () => {
        await roleService.getRoles()
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    setRolesTo(res?.data?.data);
                }
            }).catch(() => {
                setRolesTo([]);
            })
    }

    const handleAddNavlink = () => {
        navigate("/navlinks/create");
    }

    const handleEdit = (role: string, index: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute("/navlinks/:role/:index/edit", { query, params: { role: role, index: index } }));
    }

    const handleView = (role: string, index: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute("/navlinks/:role/:index", { query, params: { role: role, index: index } }));
    }

    const Action = (role: string, index: string) => {
        return (
            <div className='flex justify-center space-x-2' title=''>
                <button onClick={() => handleEdit(role, index)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(role, index)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => navlinks?.map((navlink: NavlinkResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        navlink.name,
        navlink.roleCode,
        navlink.index,
        DateUtils.dateTimeSecondToDate(navlink.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(navlink.updatedAt ?? ""),
        Action(navlink.roleCode ?? "", navlink.index ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' } },
        { label: "Role Code", key: "roleCode", type: "text" as ColumnType, props: { className: '' } },
        { label: "Index", key: "index", type: "number" as ColumnType, props: { className: '' } },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' } },
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

    useEffect(() => {
        loadRoles();
    }, []);

    return (
        <div className="grid gap-y-4">
            <div className='flex justify-between'>
                <div className={`text-2xl font-semibold my-auto`}>Navlink List</div>
                <Button
                    variant="contained"
                    onClick={handleAddNavlink}
                    aria-label="Add Navlink"
                >
                    Add Navlink
                </Button>
            </div>
            <div className='flex justify-between'>
                <div className={`w-[250px]`}>
                    <Select
                        value={filters.role || ""}
                        onChange={(e) => handleFiltersChange("role", e.target.value)}
                        fullWidth
                        displayEmpty
                        className="text-lg"
                    >
                        <MenuItem value="" disabled>Select Role</MenuItem>
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.enumCode}>{r.name}</MenuItem>
                        ))}
                    </Select>
                </div>
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
export default NavlinkListTableTemplate;
