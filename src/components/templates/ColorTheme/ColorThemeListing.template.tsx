import React from "react";
import { type ColumnType } from "../../atoms/Table";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextField from "../../atoms/TextField";
import { InputAdornment } from "@mui/material";
import Table from "../../atoms/Table";
import { type ColorTheme } from "../../../services/useColorThemeService";
import { makeRoute, DateUtils } from "../../../utils/helper";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button";

interface ColorThemeListingTemplateProps {
    colorThemes: ColorTheme[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
}

const ColorThemeListingTemplate: React.FC<ColorThemeListingTemplateProps> = ({
    colorThemes,
    pagination,
    handleFiltersChange,
    handlePaginationChange,
    handleRowsPerPageChange
}) => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleEdit = (role: string, themeName: string) => {
        navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_EDIT, {
            params: {
                role,
                themeName
            },
            query: {
                page: searchParams.get("page") || "0",
                size: searchParams.get("size") || "10",
                search: searchParams.get("search") || ""
            }
        }));
    };

    const handleView = (role: string, themeName: string) => {
        navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_VIEW, {
            params: {
                role,
                themeName
            },
            query: {
                page: searchParams.get("page") || "0",
                size: searchParams.get("size") || "10",
                search: searchParams.get("search") || ""
            }
        }));
    };

    const Action = (role: string, themeName: string) => (
        <div className="flex justify-center space-x-2">
            <button onClick={() => handleEdit(role, themeName)} className="w-6 h-6 cursor-pointer">
                <FiEdit />
            </button>
            <button onClick={() => handleView(role, themeName)} className="w-6 h-6 cursor-pointer">
                <FiEye />
            </button>
        </div>
    );

    const getRecords = () =>
        colorThemes?.map((theme, index) => [
            pagination.currentPage * pagination.pageSize + index + 1,
            theme.themeName,
            theme.role,
            theme.createdAt ? DateUtils.dateTimeSecondToDate(theme.createdAt) : "-",
            theme.updatedAt ? DateUtils.dateTimeSecondToDate(theme.updatedAt) : "-",
            theme.updatedBy ?? "-",
            Action(theme.role ,theme.themeName?? "")
        ]);

    const getTableColumns = () => [
        { label: "Sr No.", key: "srNo", type: "number" as ColumnType, props: {} },
        { label: "Theme Name", key: "themeName", type: "string" as ColumnType, props: {} },
        { label: "Role", key: "role", type: "string" as ColumnType, props: {} },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: {} },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: {} },
        { label: "Updated By", key: "updatedBy", type: "string" as ColumnType, props: {} },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: {} },
    ];

    const getSchema = () => ({
        id: "color-theme-table",
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: getTableColumns()
    });

    return (
        <div className="grid gap-y-4">
            <div className="flex justify-between">
                <div className="text-2xl font-semibold my-auto">Color Theme List</div>
                <Button 
                    onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_ADD, {}))}
                    variant="primaryContained"
                    label="Add New Color Theme"
                />
            </div>
            <div className="flex justify-end">
                <div className="w-[250px]">
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        value={searchParams.get("search") || ""}
                        name="search"
                        onChange={(e) => handleFiltersChange("search", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" className="pl-[11px]">
                                    <FiSearch />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            </div>
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    );
};

export default ColorThemeListingTemplate;
