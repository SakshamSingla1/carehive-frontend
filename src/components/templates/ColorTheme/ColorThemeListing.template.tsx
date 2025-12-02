import React, { useState } from "react";
import { type ColumnType } from "../../atoms/Table";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextField from "../../atoms/TextField";
import { Button, InputAdornment } from "@mui/material";
import Table from "../../atoms/Table";
import { type ColorTheme } from "../../../services/useColorThemeService";
import { makeRoute, DateUtils } from "../../../utils/helper";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import ColorPickerField from "../../atoms/ColorPicker";

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
    const [selectedColor, setSelectedColor] = useState("#aabbcc");

    // -------------------- ACTIONS --------------------
    const handleEdit = (role: string, themeName: string) => {
        navigate(makeRoute(`/color-theme/${role}/${themeName}/edit`, {
            query: {
                page: searchParams.get("page") || "0",
                size: searchParams.get("size") || "10",
                search: searchParams.get("search") || ""
            }
        }));
    };

    const handleView = (role: string, themeName: string) => {
        navigate(makeRoute(`/color-theme/${role}/${themeName}`, {
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

    // -------------------- RECORDS FOR TABLE --------------------
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

    // -------------------- TABLE COLUMNS --------------------
    const getTableColumns = () => [
        { label: "Sr No.", key: "srNo", type: "number" as ColumnType, props: {} },
        { label: "Theme Name", key: "themeName", type: "string" as ColumnType, props: {} },
        { label: "Role", key: "role", type: "string" as ColumnType, props: {} },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: {} },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: {} },
        { label: "Updated By", key: "updatedBy", type: "string" as ColumnType, props: {} },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: {} },
    ];

    // -------------------- TABLE SCHEMA --------------------
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

    // -------------------- RENDER --------------------
    return (
        <div className="grid gap-y-4">

            {/* -------------------- TITLE + ADD BUTTON -------------------- */}
            <div className="flex justify-between">
                <div className="text-2xl font-semibold my-auto">Color Theme List</div>
                <Button 
                    onClick={() => navigate("/color-theme/create")}
                    size="medium"
                    className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                    Add New
                </Button>
            </div>

            {/* -------------------- SEARCH BAR -------------------- */}
            <div className="flex justify-between">
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

                <div>
                    <ColorPickerField 
                        value={selectedColor}
                        onChange={(color) => setSelectedColor(color)}
                    />
                </div>
            </div>

            {/* -------------------- TABLE -------------------- */}
            <Table schema={getSchema()} records={getRecords()} />

        </div>
    );
};

export default ColorThemeListingTemplate;
