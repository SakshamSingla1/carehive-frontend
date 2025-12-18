import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, SORT_ENUM } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import TemplateListTableTemplate from '../../templates/Templates/TemplateList.template';
import { useTemplateService , type TemplateResponse , type TemplateFilterRequest} from '../../../services/useTemplateService';
import { useSearchParams } from 'react-router-dom';

const TemplateListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const templateService = useTemplateService();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [templates, setTemplatesTo] = useState<TemplateResponse[]>([]);

    const refreshTemplates = async (page: string, size: string) => {
        const params: TemplateFilterRequest = {
            page: page,
            size: size,
            sort: SORT_ENUM.CREATED_AT_DESC,
            search: filters?.search,
        };
        await templateService.getAllTemplates(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setTemplatesTo(res?.data?.data?.content);
                }
            }).catch(() => {
                setTemplatesTo([]);
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage
        }));
    };

    useEffect(() => {
        refreshTemplates(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div>
            <TemplateListTableTemplate templates={templates} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
        </div>
    )
}

export default TemplateListPage;
